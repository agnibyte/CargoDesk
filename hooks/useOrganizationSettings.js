import { useSwrApi } from "@/utilities/hooks/useSwrApi";
import { resolveOrganizationSettings } from "@/utilities/organizationSettings";

/**
 * Settings of one organization on the client (defaults filled in), e.g.
 *   const { settings } = useOrganizationSettings(fleet?.orgId, initialSettings);
 *   settings["maintenance.requireLocation"]
 * Until the request returns (or without an orgId) every setting is its registry default.
 */
export function useOrganizationSettings(orgId, initialSettings = null) {
  const { data, isLoading } = useSwrApi(
    "GET_ORGANIZATION_SETTINGS",
    { orgId: orgId ? Number(orgId) : null },
    {
      enabled: Boolean(orgId),
      ttl: 60000,
      initialData: initialSettings ? { orgId, settings: initialSettings } : null,
    }
  );
  return {
    settings: resolveOrganizationSettings(data?.settings || initialSettings),
    isLoading: Boolean(orgId) && isLoading && !initialSettings,
  };
}

export default useOrganizationSettings;
