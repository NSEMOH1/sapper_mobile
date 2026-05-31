import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  fetchActiveLoans,
  fetchMemberLoanBalance,
} from "@/services/api.service";

export function useActiveLoans(enabled?: boolean) {
  return useQuery({
    queryKey: queryKeys.payments.activeLoans,
    queryFn: fetchActiveLoans,
    enabled,
  });
}

export function useMemberLoanBalance(enabled?: boolean) {
  return useQuery({
    queryKey: queryKeys.payments.memberBalance,
    queryFn: fetchMemberLoanBalance,
    enabled,
  });
}
