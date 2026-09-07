import { Twilio } from "twilio";
import {
  addNewMessageTemplateModel,
  deleteMessageTemplateModel,
  getUserMessageTemplatesModel,
} from "../models/messangerModel";

// Configurable constants
const SERVER_CONCURRENCY_LIMIT = 5; // Max concurrent Twilio API requests
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 600;

/**
 * Normalizes and validates phone numbers into standard E.164 format.
 * Supports:
 * - 10-digit Indian numbers: '9876543210' -> '+919876543210'
 * - With leading zero: '09876543210' -> '+919876543210'
 * - With 91 prefix: '919876543210' -> '+919876543210'
 * - Already in E.164: '+919876543210', '+12025550123' -> '+919876543210', '+12025550123'
 */
export function normalizePhoneNumber(rawNumber, defaultCountryCode = "+91") {
  if (!rawNumber || (typeof rawNumber !== "string" && typeof rawNumber !== "number")) {
    return { isValid: false, normalized: null, original: rawNumber };
  }

  const str = String(rawNumber).trim();
  // Remove formatting characters: spaces, hyphens, parentheses, dots
  let cleaned = str.replace(/[\s\-\(\)\.]/g, "");

  // Already E.164 with +
  if (cleaned.startsWith("+")) {
    const digitsOnly = cleaned.slice(1);
    if (/^\d{7,15}$/.test(digitsOnly)) {
      return { isValid: true, normalized: cleaned, original: str };
    }
    return { isValid: false, normalized: null, original: str };
  }

  // Double zero international prefix: 00919876543210 -> +919876543210
  if (cleaned.startsWith("00")) {
    const converted = "+" + cleaned.slice(2);
    if (/^\+\d{7,15}$/.test(converted)) {
      return { isValid: true, normalized: converted, original: str };
    }
  }

  // 10-digit Indian mobile number (starts with 6-9)
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: `${defaultCountryCode}${cleaned}`, original: str };
  }

  // 11 digits starting with 0 followed by 10-digit Indian number
  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: `${defaultCountryCode}${cleaned.slice(1)}`, original: str };
  }

  // 12 digits starting with 91 followed by 10-digit Indian number
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, normalized: `+${cleaned}`, original: str };
  }

  // Generic 10-digit fallback
  if (/^\d{10}$/.test(cleaned)) {
    return { isValid: true, normalized: `${defaultCountryCode}${cleaned}`, original: str };
  }

  return { isValid: false, normalized: null, original: str };
}

/**
 * Sends a single SMS with exponential backoff retry for transient errors (429, 5xx).
 */
async function sendSingleSmsWithRetry(client, fromNumber, toNumber, messageBody) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await client.messages.create({
        body: messageBody,
        from: fromNumber,
        to: toNumber,
      });
      return {
        success: true,
        to: toNumber,
        sid: result.sid,
        status: result.status,
      };
    } catch (err) {
      const isRetryable =
        err.status === 429 ||
        (err.status >= 500 && err.status < 600) ||
        err.code === 20429;

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return {
        success: false,
        to: toNumber,
        error: err.message || "Failed to send message",
        code: err.code || err.status || "UNKNOWN_ERROR",
      };
    }
  }
}

/**
 * Processes recipient numbers in controlled concurrent chunks to avoid API / server overload.
 */
async function processBatchConcurrently(
  client,
  fromNumber,
  numbers,
  message,
  concurrencyLimit = SERVER_CONCURRENCY_LIMIT
) {
  const results = [];

  for (let i = 0; i < numbers.length; i += concurrencyLimit) {
    const chunk = numbers.slice(i, i + concurrencyLimit);
    const chunkPromises = chunk.map((num) =>
      sendSingleSmsWithRetry(client, fromNumber, num, message)
    );
    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);

    // Brief inter-batch pause to respect SMS provider rate limits
    if (i + concurrencyLimit < numbers.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Main controller to send messages to one or multiple recipients.
 */
export default async function sendMessage(requestBody = {}) {
  const { message, contacts } = requestBody;

  // Validation
  if (!message || typeof message !== "string" || !message.trim()) {
    return {
      status: false,
      message: "Message content cannot be empty.",
    };
  }

  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    return {
      status: false,
      message: "Please select at least one contact or phone number.",
    };
  }

  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const senderPhoneNo = process.env.TWILIO_SENDER_PHONE_NO;

  if (!accountSid || !authToken || !senderPhoneNo) {
    return {
      status: false,
      message:
        "SMS gateway is not configured. Missing Twilio Account SID, Auth Token, or Sender Number in environment variables.",
    };
  }

  let client;
  try {
    client = new Twilio(accountSid, authToken);
  } catch (err) {
    console.error("Twilio client initialization error:", err);
    return {
      status: false,
      message: "Failed to initialize SMS gateway client.",
      error: err?.message,
    };
  }

  // Deduplicate raw numbers
  const uniqueRawContacts = Array.from(
    new Set(
      contacts
        .map((c) => (typeof c === "string" ? c.trim() : String(c).trim()))
        .filter(Boolean)
    )
  );

  const validNumbers = [];
  const invalidNumbers = [];

  for (const raw of uniqueRawContacts) {
    const { isValid, normalized, original } = normalizePhoneNumber(raw);
    if (isValid && normalized) {
      validNumbers.push(normalized);
    } else {
      invalidNumbers.push(original);
    }
  }

  // Deduplicate normalized numbers
  const uniqueValidNumbers = Array.from(new Set(validNumbers));

  if (uniqueValidNumbers.length === 0) {
    return {
      status: false,
      message: `All provided recipient numbers are invalid (${invalidNumbers.length} invalid).`,
      data: {
        total: uniqueRawContacts.length,
        sentCount: 0,
        failedCount: 0,
        invalidCount: invalidNumbers.length,
        invalidNumbers,
        sent: [],
        failed: [],
      },
    };
  }

  // Execute sending with batching & concurrency
  const results = await processBatchConcurrently(
    client,
    senderPhoneNo,
    uniqueValidNumbers,
    message.trim()
  );

  const sent = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  const sentCount = sent.length;
  const failedCount = failed.length;
  const invalidCount = invalidNumbers.length;
  const total = uniqueRawContacts.length;

  let overallStatus = sentCount > 0;
  let summaryMessage = "";

  if (sentCount === total && invalidCount === 0) {
    summaryMessage = `Successfully sent message to all ${sentCount} recipient${sentCount > 1 ? "s" : ""}!`;
  } else if (sentCount > 0) {
    summaryMessage = `Sent to ${sentCount} of ${total} recipient${total > 1 ? "s" : ""}.${failedCount > 0 ? ` ${failedCount} failed.` : ""}${invalidCount > 0 ? ` ${invalidCount} invalid numbers skipped.` : ""}`;
  } else {
    overallStatus = false;
    const firstError = failed[0]?.error || "Failed to send messages.";
    summaryMessage = `Failed to send messages: ${firstError}`;
  }

  return {
    status: overallStatus,
    isPartial: sentCount > 0 && (failedCount > 0 || invalidCount > 0),
    message: summaryMessage,
    data: {
      total,
      sentCount,
      failedCount,
      invalidCount,
      invalidNumbers,
      sent,
      failed,
    },
  };
}

// postSiteApiData("SEND_SMS", request)
//   .then((result) => {
//     if (result.status) {
//       response.status = true;
//       response.message = "Message sent successfully";
//     } else {
//       response.message = result.message || "Failed to send message.";
//     }
//     resolve(response);
//   })
//   .catch((error) => {
//     response.message =
//       error.message || "An error occurred while sending the message.";
//     reject(response);
//   });

export function addNewMsgTemplateController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };

    addNewMessageTemplateModel(request.body)
      .then((result) => {
        if (result.status) {
          resolve(result);
        } else {
          response.message = result.message;
          resolve(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getUserMessageTemplates(userId) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };

    getUserMessageTemplatesModel(userId)
      .then((result) => {
        if (result.status) {
          resolve(result);
        } else {
          response.message = result.message;
          resolve(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function deleteMessageTemplates(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };
    const userId = request.body.id;
    const msgId = request.body.msgId;

    deleteMessageTemplateModel(userId, msgId)
      .then((result) => {
        if (result.status) {
          resolve(result);
        } else {
          response.message = result.message;
          resolve(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
