import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchLoanBalances } from "@/services/api.service";
import type { LoanCategory } from "@/types";

/**
 * Returns loan balances, summary, and category data.
 *
 * Usage:
 *   const { data, isLoading, error, refetch } = useLoanBalances();
 *   const summary = data?.summary;
 *   const chartData = data?.chartData;
 */
export function useLoanBalances() {
  const query = useQuery({
    queryKey: queryKeys.loans.balances(),
    queryFn: fetchLoanBalances,
    // Transform the raw API data into the shape the UI needs
    select: (raw) => ({
      loans: raw.loans,
      summary: raw.summary,
      categories: raw.categories,
      chartData: raw.categories.map((c: LoanCategory) => ({
        id: c.categoryId,
        name: c.categoryName === "HOME" ? "HOME APPLIANCES" : c.categoryName,
        amount: `₦${c.maxAmount.toLocaleString()}`,
        collected: c.collectedAmount,
        percentage: c.percentageCollected,
      })),
    }),
  });

  // ── Derived helpers ────────────────────────────────────────────────────────
  const getCategory = (name: string) =>
    query.data?.categories.find((c) => c.categoryName === name);

  return {
    ...query,
    getLoanById: (id: string) =>
      query.data?.loans.find((l) => l.loanId === id),
    getCollectedAmount: (name: string) => getCategory(name)?.collectedAmount ?? 0,
    getMaxAmount: (name: string) => getCategory(name)?.maxAmount ?? 0,
    getRemainingAmount: (name: string) => getCategory(name)?.remainingAmount ?? 0,
  };
}