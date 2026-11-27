/**
 * Organization Settings Registry
 *
 * Per-organization rules that change how CargoDesk behaves for one organization. Super Admin can edit them for any
 * organization; an organization's Admin can edit them for their own organization (Organization Details > Settings).
 *
 * To add a rule: append an entry here, then read it where it applies with
 * `resolveOrganizationSettings(org.settings)[key]` (server) or `useOrganizationSettings(orgId)` (client).
 * Nothing else needs to change: storage, the API and the Settings tab all work from this list.
 *
 * Each entry:
 *   key         unique id, stored in organizations.settings (JSON)
 *   group       heading the setting is listed under in the Settings tab
 *   label       short name shown to admins
 *   description what the setting does, shown under the label
 *   type        "boolean" (toggle) or "select" (one of `options`)
 *   options     for "select": [{ value, label }]
 *   default     value used when an organization has never set it
 */
export const ORGANIZATION_SETTINGS = [
  {
    key: "maintenance.requireLocation",
    group: "Service logs",
    label: "Require GPS location on service logs",
    description:
      "When on, maintenance supervisors must allow device location before saving a service log, and the coordinates are stamped on the photos. When off, they can save a service log with or without location coordinates.",
    type: "boolean",
    default: true,
  },
];

export const ORGANIZATION_SETTING_KEYS = ORGANIZATION_SETTINGS.map((s) => s.key);

const definitionByKey = new Map(ORGANIZATION_SETTINGS.map((s) => [s.key, s]));

function isValidValue(def, value) {
  if (def.type === "boolean") return typeof value === "boolean";
  if (def.type === "select") return (def.options || []).some((o) => o.value === value);
  return false;
}

function parseStored(stored) {
  if (!stored) return {};
  if (typeof stored === "object") return stored;
  try {
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (_) {
    return {};
  }
}

/**
 * Full settings for an organization: every registered key, with the stored value where it is valid and the default
 * otherwise. Accepts the raw `organizations.settings` column (JSON string) or an already-parsed object.
 */
export function resolveOrganizationSettings(stored) {
  const saved = parseStored(stored);
  const resolved = {};
  for (const def of ORGANIZATION_SETTINGS) {
    resolved[def.key] = isValidValue(def, saved[def.key]) ? saved[def.key] : def.default;
  }
  return resolved;
}

/**
 * Validates a partial update. Returns { values } with only known keys of the right type, or { error } naming the
 * first problem, so a bad request never stores junk.
 */
export function validateOrganizationSettingsPatch(patch) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return { error: "Settings must be an object of { key: value }." };
  }
  const values = {};
  for (const [key, value] of Object.entries(patch)) {
    const def = definitionByKey.get(key);
    if (!def) return { error: `Unknown setting: ${key}` };
    if (!isValidValue(def, value)) return { error: `Invalid value for ${def.label}.` };
    values[key] = value;
  }
  if (Object.keys(values).length === 0) return { error: "No settings to update." };
  return { values };
}
