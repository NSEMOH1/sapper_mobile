/**
 * Centralised query key factory.
 *
 * Rules:
 *  - Every key is an array so React Query can do partial invalidation.
 *  - Nest from most-general → most-specific so you can invalidate a whole
 *    domain (e.g. queryKeys.loans.all) or a single record (queryKeys.loans.detail(id)).
 */
export const queryKeys = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  auth: {
    session: ["auth", "session"] as const,
  },

  // ── Member / Profile ──────────────────────────────────────────────────────
  member: {
    all: ["member"] as const,
    detail: (userId: string) => ["member", userId] as const,
  },

  // ── Balance ───────────────────────────────────────────────────────────────
  balance: {
    all: ["balance"] as const,
  },

  // ── Loans ─────────────────────────────────────────────────────────────────
  loans: {
    all: ["loans"] as const,
    balances: () => ["loans", "balances"] as const,
    detail: (loanId: string) => ["loans", loanId] as const,
  },

  // ── Savings ───────────────────────────────────────────────────────────────
  savings: {
    all: ["savings"] as const,
    balances: () => ["savings", "balances"] as const,
  },
} as const;