import { useQuery, useMutation } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { queryKeys } from "@/lib/queryKeys";
import {
  fetchSavingsBalance,
  submitDeposit,
} from "@/services/api.service";
import type { DepositPayload } from "@/services/api.service";

/**
 * Returns the member's savings balance with category helpers.
 *
 * Usage:
 *   const { data, isLoading, error, refetch } = useSavingsBalance();
 *   const total = data?.totalSavings;
 */
export function useSavingsBalance() {
  const query = useQuery({
    queryKey: queryKeys.savings.balances(),
    queryFn: fetchSavingsBalance,
  });

  const getCategoryTotal = (categoryName: string): Decimal => {
    const balance = query.data;
    if (!balance) return new Decimal(0);

    if (categoryName === "QUICK") return balance.normalSavings;
    if (categoryName === "COOPERATIVE") return balance.cooperativeSavings;

    const category = balance.details.find((d) => d.categoryName === categoryName);
    return category ? category.amount : new Decimal(0);
  };

  return {
    ...query,
    getCategoryTotal,
  };
}

export function useDeposit() {
  return useMutation({
    mutationFn: (payload: DepositPayload) => submitDeposit(payload),
  });
}