import { MaterialIcons } from "@expo/vector-icons";
import Decimal from "decimal.js";

export interface JwtPayload {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  iat: number;
  exp: number;
}

export interface AuthData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  token?: string;
}

export interface AuthStore {
  user: AuthData | null;
  token: string | null;
  loading: boolean;
  setUser: (data: AuthData | null) => void;
  logout: () => void;
  validateSession: () => Promise<void>;
}

export interface MemberData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  service_number: string;
  bank: {
    id: string;
    name: string;
    account_name: string;
    account_number: string;
  }[];
  address: string;
  phone: string;
}

export interface MemberStore {
  member: MemberData | null;
  loading: boolean;
  error: string | null;
  fetchMemberData: (memberId: string) => Promise<void>;
}

export interface RepaymentProgress {
  paid: number;
  remaining: number;
  percentage: number;
}

export interface NextPayment {
  dueDate: string;
  amount: number;
}

export interface LoanBalance {
  loanId: string;
  category: string;
  reference: string;
  originalAmount: number;
  approvedAmount: number;
  interestRate: number;
  durationMonths: number;
  totalPaid: number;
  outstandingBalance: number;
  status: string;
  startDate?: string;
  endDate?: string;
  nextPayment?: NextPayment;
  repaymentProgress: RepaymentProgress;
}

export interface LoanSummary {
  totalOutstanding: number;
  totalPaid: number;
  activeLoans: number;
  completedLoans: number;
  defaultedLoans: number;
}

export interface LoanCategory {
  categoryId: string;
  categoryName: string;
  maxAmount: number;
  collectedAmount: number;
  remainingAmount: number;
  percentageCollected: number;
}

export interface LoanBalanceState {
  loans: LoanBalance[];
  summary: LoanSummary;
  categories: LoanCategory[];
  loading: boolean;
  error: string | null;
  fetchLoanBalances: () => Promise<void>;
  getLoanById: (loanId: string) => LoanBalance | undefined;
  getCategoryById: (categoryId: string) => LoanCategory | undefined;
  getCollectedAmount: (categoryName: string) => number;
  getMaxAmount: (categoryName: string) => number;
  getRemainingAmount: (categoryName: string) => number;
  getChartData: () => {
    id: string;
    name: string;
    amount: string;
    collected: number;
    percentage: number;
  }[];
}

export interface SavingsCategoryDetail {
  categoryId: string;
  categoryName: string;
  amount: Decimal;
}

export interface SavingsBalance {
  totalSavings: number;
  monthlyDeduction: number;
  normalSavings: Decimal;
  cooperativeSavings: Decimal;
  details: SavingsCategoryDetail[];
}

export interface SavingsBalanceState {
  balance: SavingsBalance | null;
  loading: boolean;
  error: string | null;
  fetchSavingsBalance: () => Promise<void>;
  getCategoryTotal: (categoryName: string) => Decimal;
}

export interface LoanEnrollmentFlowProps {
  visible: boolean;
  onClose: () => void;
}

export interface FormData {
  servicingLoan: string;
  totalSavings: string;
  monthlyDeduction: string;
  authorizedSignature: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: string;
  rank: string;
  tenure: string;
}

export interface UploadedFiles {
  recommendation: boolean;
  nonIndebtedness: boolean;
  application: boolean;
  personnelId: boolean;
}

export interface WithdrawalFormData {
  serviceNumber: string;
  rank: string;
  corpsUnit: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  salaryAccountName: string;
  salaryAccountNumber: string;
  bankName: string;
  branch: string;
  amount: number;
}

export interface ForgotPasswordFormData {
  email: string;
  otp: string;
  securityAnswer: string;
  transactionPin: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
  otp?: string;
  securityAnswer?: string;
  transactionPin?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ForgotPasswordFlowProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export interface LoanRecord {
  type: string;
  amount: string;
  percentage: number;
  current: string;
  total: string;
}

export interface LoanCategory {
  title: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}

export interface CircularProgressProps {
  percentage: number;
  size?: number;
}
