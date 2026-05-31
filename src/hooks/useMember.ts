import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchMember } from "@/services/api.service";

/**
 * Fetches a member's profile data by user ID.
 *
 * Usage:
 *   const { data: member, isLoading } = useMember(userId);
 *
 * The query is disabled when userId is falsy (e.g. before auth resolves).
 */
export function useMember(userId: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.member.detail(userId ?? ""),
    queryFn: () => fetchMember(userId!),
    enabled: Boolean(userId),
  });
}

export function useUpdateMemberMutation(userId: string | undefined | null, options?: Parameters<typeof useQuery>[0]) {
  const query = useQuery({
    queryKey: queryKeys.member.detail(userId ?? ""),
    queryFn: () => fetchMember(userId!),
    enabled: Boolean(userId),
  });

  return {
    ...query,
    update: query.refetch,
  };
}