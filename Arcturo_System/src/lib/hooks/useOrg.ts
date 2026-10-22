import { useQuery } from "@tanstack/react-query";
import { getOrgProfile } from "@/lib/api/org-service";

export const useOrgProfile = (orgId: string) =>
  useQuery({
    queryKey: ["org", "profile", orgId],
    queryFn: () => getOrgProfile(orgId),
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5,
  });
