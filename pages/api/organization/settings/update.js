import { updateOrganizationSettingsController } from "@/backend/controllers/organizationController";
import { getAuthUserFromReq } from "@/utilities/authServer";

/**
 * POST { orgId, settings: { key: value, ... } } -> { status, data: { orgId, settings } }
 * Super Admin: any organization. Organization Admin: their own organization. Everyone else: 403.
 * Only keys defined in utilities/organizationSettings.js are accepted.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ status: false, message: `Method ${req.method} Not Allowed` });
  }

  const authUser = getAuthUserFromReq(req);
  if (!authUser) {
    return res.status(401).json({ status: false, message: "Unauthorized. Please log in." });
  }

  const { orgId, settings } = req.body || {};
  if (!orgId) {
    return res.status(400).json({ status: false, message: "Organization ID is required." });
  }

  try {
    const result = await updateOrganizationSettingsController(orgId, settings, authUser);
    return res.status(result?.status ? 200 : result?.code || 400).json(result);
  } catch (error) {
    console.error("Error in organization settings update API:", error);
    return res.status(500).json({ status: false, message: "Internal server error saving settings." });
  }
}
