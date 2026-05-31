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

// ── Payments ──────────────────────────────────────────────────────────────────

export interface ActiveLoan {
  id: string;
  reference: string;
  approvedAmount: number;
}

export interface InitializePaymentPayload {
  paymentType: string;
  amount: number;
  loanId?: string;
}

export interface InitializePaymentResponse {
  authorizationUrl: string;
  reference: string;
}

export interface PaymentResult {
  message: string;
  transaction?: {
    type: string;
    amount: number;
    reference: string;
  };
  loanCompleted?: boolean;
  remainingBalance?: number;
  alreadyProcessed?: boolean;
}

export async function fetchActiveLoans(): Promise<ActiveLoan[]> {
  const res = await api.get<{ data: ActiveLoan[] }>("/api/loan/active");
  return res.data.data || [];
}

export async function fetchMemberLoanBalance(): Promise<number> {
  const res = await api.get<{ data: { loan_balance: number } }>("/api/member/balance");
  return Number(res.data.data?.loan_balance || 0);
}

export async function initializePayment(
  payload: InitializePaymentPayload
): Promise<InitializePaymentResponse> {
  const res = await api.post<{ success: boolean; data: InitializePaymentResponse }>(
    "/api/payments/initialize",
    payload
  );
  return res.data.data;
}

export async function verifyPayment(reference: string): Promise<PaymentResult> {
  const res = await api.get<{ success: boolean; data: PaymentResult }>(
    `/api/payments/verify/${reference}`
  );
  return res.data.data;
}

// ── Mono Payment ─────────────────────────────────────────────────────────────

export interface MonoInitializeResponse {
  monoUrl: string;
}

export interface MonoVerificationResult {
  paymentType?: string;
  message?: string;
  transaction?: {
    type: string;
    amount: number;
    reference: string;
  };
  alreadyProcessed?: boolean;
  loanCompleted?: boolean;
  remainingBalance?: number;
}

export async function initializeMonoPayment(
  payload: InitializePaymentPayload
): Promise<MonoInitializeResponse> {
  const res = await api.post<{ success: boolean; data: MonoInitializeResponse }>(
    "/api/payments/initialize-mono",
    payload
  );
  return res.data.data;
}

export async function verifyMonoPayment(
  reference: string
): Promise<MonoVerificationResult> {
  const res = await api.get<{ success: boolean; data: MonoVerificationResult }>(
    `/api/payments/mono-verify-callback/${reference}`
  );
  console.log("Mono verification response:", res.data);
  if (!res.data.success) {
    throw new Error(res.data.data?.message || "Verification request failed");
  }
  return res.data.data;
}