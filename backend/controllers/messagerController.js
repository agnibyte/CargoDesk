// import { postSiteApiData } from "@/utilities/services/apiService";
import { Twilio } from "twilio";
import {
  addNewMessageTemplateModel,
  deleteMessageTemplateModel,
  getUserMessageTemplatesModel,
} from "../models/messangerModel";

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = new Twilio(accountSid, authToken);

export default async function sendMessage(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, contacts } = req.body;
  const response = {
    status: false,
  };

  // Validation
  if (
    !message ||
    !contacts ||
    !Array.isArray(contacts) ||
    contacts.length === 0
  ) {
    response.message = "Message and at least one contact are required.";
    return res.status(400).json(response);
  }

  try {
    for (const contact of contacts) {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_SENDER_PHONE_NO, // ensure this is in E.164 format, e.g. +1234567890
        to: contact.trim(),
      });
    }

    response.status = true;
    response.message = "Messages sent successfully";

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error sending message:", error);
    response.message = "Failed to send message";
    response.error = error.message;
    return res.status(500).json(response);
  }
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
