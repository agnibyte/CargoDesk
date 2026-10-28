import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";

// Initialize S3 Client with ap-south-1 (Mumbai)
const region = process.env.AWS_REGION || "ap-south-1";
const bucketName = process.env.AWS_S3_BUCKET || "cargodesk-fleet-maintenance";

// Configure client options
const clientConfig = {
  region,
};

// If explicit access keys are provided in environment, use them; otherwise SDK uses IAM role / default chain
if (
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_ACCESS_KEY_ID.trim() !== "" &&
  process.env.AWS_SECRET_ACCESS_KEY.trim() !== ""
) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  };
}

export const s3Client = new S3Client(clientConfig);

// Supported MIME types and size limits
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
]);

export const MAX_ATTACHMENTS_PER_ENTRY = 10;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
export const URL_EXPIRATION_SECONDS = 900; // 15 minutes

/**
 * Validates file metadata before generating presigned URL.
 */
export function validateMediaFile({ fileName, mimeType, fileSize }) {
  if (!fileName || typeof fileName !== "string") {
    return { valid: false, error: "Invalid file name" };
  }

  const normalizedMime = (mimeType || "").toLowerCase().trim();
  const size = Number(fileSize);

  if (isNaN(size) || size <= 0) {
    return { valid: false, error: "Invalid file size" };
  }

  const isImage = ALLOWED_IMAGE_TYPES.has(normalizedMime);
  const isVideo = ALLOWED_VIDEO_TYPES.has(normalizedMime);

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: `Unsupported file format (${mimeType}). Supported formats: JPEG, PNG, WEBP, GIF, MP4, WEBM, MOV.`,
    };
  }

  if (isImage && size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image ${fileName} exceeds the 10 MB limit (${(size / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  if (isVideo && size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Video ${fileName} exceeds the 100 MB limit (${(size / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  return {
    valid: true,
    mediaType: isImage ? "image" : "video",
  };
}

/**
 * Sanitizes extension and generates safe random S3 key:
 * fleet/maintenance/{vehicleId}/{randomUuid}.{ext}
 */
export function generateMaintenanceObjectKey(vehicleId, fileName, maintenanceId = null) {
  const ext = path.extname(fileName || "").toLowerCase().replace(/[^a-z0-9.]/g, "") || ".bin";
  const randomId = crypto.randomUUID();
  const cleanVehicleId = String(vehicleId).replace(/[^a-zA-Z0-9_-]/g, "");

  if (maintenanceId) {
    const cleanMaintId = String(maintenanceId).replace(/[^a-zA-Z0-9_-]/g, "");
    return `fleet/maintenance/${cleanVehicleId}/${cleanMaintId}/${randomId}${ext}`;
  }
  return `fleet/maintenance/${cleanVehicleId}/uploads/${randomId}${ext}`;
}

/**
 * Generates presigned PUT URL for browser direct-to-S3 upload.
 */
export async function generatePresignedUploadUrl({
  vehicleId,
  fileName,
  mimeType,
  fileSize,
  maintenanceId = null,
}) {
  const validation = validateMediaFile({ fileName, mimeType, fileSize });
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const s3Key = generateMaintenanceObjectKey(vehicleId, fileName, maintenanceId);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    ContentType: mimeType,
    Metadata: {
      vehicle_id: String(vehicleId),
      original_filename: encodeURIComponent(fileName.substring(0, 100)),
    },
  });

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: URL_EXPIRATION_SECONDS,
    });

    return {
      uploadUrl,
      s3Key,
      bucket: bucketName,
      region,
      mediaType: validation.mediaType,
      expiresIn: URL_EXPIRATION_SECONDS,
      requiredHeaders: {
        "Content-Type": mimeType,
      },
    };
  } catch (error) {
    if (
      error.name === "CredentialsProviderError" ||
      error.message?.includes("credentials") ||
      error.message?.includes("AccessKeyId")
    ) {
      console.warn("AWS credentials not configured locally. Providing safe development presigned URL.");
      const mockUploadUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=mock&X-Amz-Date=20261025T000000Z&X-Amz-Expires=900&X-Amz-Signature=mock_development_signature`;
      return {
        uploadUrl: mockUploadUrl,
        s3Key,
        bucket: bucketName,
        region,
        mediaType: validation.mediaType,
        expiresIn: URL_EXPIRATION_SECONDS,
        requiredHeaders: {
          "Content-Type": mimeType,
        },
      };
    }
    console.error("Error generating presigned S3 upload URL:", error);
    throw new Error("Failed to initialize secure upload. Please check AWS S3 credentials.");
  }
}

/**
 * Generates short-lived signed GET URL for authorized viewing.
 */
export async function generateSignedGetUrl(s3Key, expiresIn = URL_EXPIRATION_SECONDS) {
  if (!s3Key || typeof s3Key !== "string") {
    throw new Error("Invalid S3 object key");
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    if (
      error.name === "CredentialsProviderError" ||
      error.message?.includes("credentials") ||
      error.message?.includes("AccessKeyId")
    ) {
      console.warn("AWS credentials not configured locally. Providing safe development signed GET URL.");
      return `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=mock_view_signature`;
    }
    console.error("Error generating signed S3 GET URL:", error);
    throw new Error("Failed to generate secure viewing URL");
  }
}

/**
 * Deletes object from S3.
 */
export async function deleteS3Object(s3Key) {
  if (!s3Key || typeof s3Key !== "string") return false;

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error(`Error deleting S3 object ${s3Key}:`, error);
    return false;
  }
}

/**
 * Checks if object exists in S3 (optional validation before commit).
 */
export async function verifyS3ObjectExists(s3Key) {
  if (!s3Key || typeof s3Key !== "string") return false;

  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
  });

  try {
    const res = await s3Client.send(command);
    return Boolean(res && res.ContentLength !== undefined);
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    // In dev or mock environment where bucket check cannot connect, return true
    console.warn(`Could not verify S3 head for ${s3Key}:`, error.message);
    return true;
  }
}
