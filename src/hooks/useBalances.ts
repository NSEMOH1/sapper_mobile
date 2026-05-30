// src/hooks/useBalances.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchBalance } from "@/services/api.service";

/**
 * Returns the member's combined loan + savings balance.
 *
 * The hook handles loading, error, and caching automatically.
 * No manual useEffect or Zustand store needed.
 *
 * Usage:
 *   const { data, isLoading, error, refetch } = useBalances();
 */
export function useBalances() {
  return useQuery({
    queryKey: queryKeys.balance.all,
    queryFn: fetchBalance,
  });
}