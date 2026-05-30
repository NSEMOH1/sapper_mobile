// src/services/api.service.ts
/**
 * Pure async data-fetching functions.
 * These have NO React/hook dependencies — React Query calls them.
 * Each function throws on error so React Query can handle retries/error state.
 */
import api from "@/constants/api";
import type {
  MemberData,
  SavingsBalance,
  LoanBalance,
  LoanSummary,
  LoanCategory,
} from "@/types";

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  service_number: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
    token?: string;
  };
  token?: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/api/auth/member/login", payload);
  return res.data;
}

// ── Member ────────────────────────────────────────────────────────────────────

export async function fetchMember(userId: string): Promise<MemberData> {
  const res = await api.get<MemberData>(`/api/members/${userId}`);
  return res.data;
}

// ── Balance ───────────────────────────────────────────────────────────────────

export interface BalanceResponse {
  id: string;
  loan_balance: number;
  savings_balance: number;
}

export async function fetchBalance(): Promise<BalanceResponse> {
  const res = await api.get<BalanceResponse>("/api/balances");
  return res.data;
}

// ── Loans ─────────────────────────────────────────────────────────────────────

export interface LoanBalancesResponse {
  data: {
    loans: LoanBalance[];
    summary: LoanSummary;
    categories: LoanCategory[];
  };
}

export async function fetchLoanBalances(): Promise<LoanBalancesResponse["data"]> {
  const res = await api.get<LoanBalancesResponse>("/api/loan/balances");
  return res.data.data;
}

// ── Register ──────────────────────────────────────────────────────────────────

export async function registerUser(formData: FormData): Promise<{ message: string }> {
  const res = await api.post("/api/auth/member/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
  });
  return res.data;
}

// ── Savings ───────────────────────────────────────────────────────────────────

export interface SavingsBalanceResponse {
  data: SavingsBalance;
}

export async function fetchSavingsBalance(): Promise<SavingsBalance> {
  const res = await api.get<SavingsBalanceResponse>("/api/savings/balances");
  return res.data.data;
}

// ── Withdrawal ────────────────────────────────────────────────────────────────

export interface WithdrawalPayload {
  amount: string;
  category_name: string;
  pin: string;
}

export async function submitWithdrawal(payload: WithdrawalPayload): Promise<void> {
  await api.post("/api/savings/withdraw", payload);
}

// ── Deposit ───────────────────────────────────────────────────────────────────

export interface DepositPayload {
  category_name: string;
  amount: string;
}

export async function submitDeposit(payload: DepositPayload): Promise<void> {
  await api.post("/api/savings/deposit", payload);
}

// ── Loan Application ──────────────────────────────────────────────────────────

export async function applyForLoan(formData: FormData): Promise<any> {
  const res = await api.post("/api/loan/apply", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
  });
  return res.data;
}

export async function verifyLoanOTP(loanId: string, otp: string): Promise<any> {
  const res = await api.post(`/api/loan/${loanId}/verify`, { otp });
  return res.data;
}

// ── Transactions ──────────────────────────────────────────────────────────────

export interface TransactionResponseItem {
  id: string;
  type: string;
  description: string;
  reference: string;
  amount: number;
  createdAt: string;
  status: string;
}

export async function fetchTransactions(): Promise<TransactionResponseItem[]> {
  const res = await api.get<{ data: TransactionResponseItem[] }>("/api/transactions");
  return res.data.data;
}