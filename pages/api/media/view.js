import { generateSignedGetUrl } from "@/backend/services/s3Service";

/**
 * Universal media viewer/streamer for S3 objects.
 * Solves private S3 bucket 403 Forbidden issues by dynamically
 * generating an authorized signed GET URL and redirecting the browser (HTTP 307).
 *
 * Query parameters:
 * - key: S3 object key (e.g., drivers/12/profile/abc.jpg)
 * - url: Full S3 URL (e.g., https://bucket.s3.region.amazonaws.com/drivers/...)
 * - download: If '1' or 'true', instructs browser to trigger download
 */
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", ["GET", "HEAD"]);
    return res.status(405).json({ status: false, message: `Method ${req.method} Not Allowed` });
  }

  const { key, url, download } = req.query || {};

  let s3Key = "";
  if (key && typeof key === "string") {
    s3Key = decodeURIComponent(key).trim();
  } else if (url && typeof url === "string") {
    const rawUrl = decodeURIComponent(url).trim();
    // Extract key after amazonaws.com/ or r2.cloudflarestorage.com/ or domain/
    const match = rawUrl.match(/(?:amazonaws\.com\/[^\/]+\/|amazonaws\.com\/|r2\.cloudflarestorage\.com\/[^\/]+\/)(.+)$/i);
    if (match && match[1]) {
      s3Key = match[1].split("?")[0];
    } else {
      // Try finding drivers/ or fleet/ in path
      const prefixMatch = rawUrl.match(/(drivers\/[^\s?#]+|fleet\/[^\s?#]+)/i);
      if (prefixMatch && prefixMatch[1]) {
        s3Key = prefixMatch[1];
      }
    }
  }

  // Remove leading slashes
  s3Key = s3Key.replace(/^\/+/, "");

  if (!s3Key || s3Key.includes("..")) {
    return res.status(400).json({ status: false, message: "Invalid or missing storage key." });
  }

  // Security check: Only allow authorized prefixes
  const isAllowedPrefix =
    s3Key.startsWith("drivers/") ||
    s3Key.startsWith("fleet/") ||
    s3Key.startsWith("documents/") ||
    s3Key.startsWith("uploads/");

  if (!isAllowedPrefix) {
    return res.status(403).json({ status: false, message: "Unauthorized storage path." });
  }

  try {
    // Generate fresh signed GET URL valid for 1 hour (3600 seconds)
    const signedUrl = await generateSignedGetUrl(s3Key, 3600);

    // Browser cache control: cache redirect for 30 minutes
    res.setHeader("Cache-Control", "public, max-age=1800, stale-while-revalidate=86400");

    // Redirect browser to authorized S3 URL
    return res.redirect(307, signedUrl);
  } catch (error) {
    console.error("Error generating media view URL for key:", s3Key, error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to load media file.",
    });
  }
}

