import { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveLoans, useMemberLoanBalance } from "@/hooks/usePayments";
import {
  initializeMonoPayment,
  verifyMonoPayment,
  fetchTransactions,
} from "@/services/api.service";
import type { MonoVerificationResult } from "@/services/api.service";
import { useSavingsBalanceStore } from "@/store/savings";
import { queryKeys } from "@/lib/queryKeys";
import { useTheme } from "@/hooks/use-theme";

const QUICK_AMOUNTS = [5000, 10000, 15000, 20000, 30000];
const PAYMENT_TYPES = [
  { label: "Loan Repayment", value: "LOAN_REPAYMENT" },
  { label: "Quick Savings Deposit", value: "SAVINGS_DEPOSIT" },
];

const formatAmount = (v: string | number) =>
  v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


const formatCurrency = (n: number) => `\u20A6${n.toLocaleString()}`;

type Screen = "form" | "webview" | "verifying" | "success" | "failed";

const SummaryRow = ({
  label,
  value,
  bold,
  valueColor,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) => (
  <View style={s.summaryRow}>
    <Text style={[s.summaryLabel, bold && s.summaryLabelBold]}>{label}</Text>
    <Text
      style={[
        s.summaryValue,
        bold && s.summaryValueBold,
        valueColor ? { color: valueColor } : undefined,
      ]}
    >
      {value}
    </Text>
  </View>
);

const SecurityBadge = ({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) => (
  <View style={s.badgeRow}>
    <Ionicons name={icon as any} size={18} color="#4CAF50" />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={s.badgeTitle}>{title}</Text>
      <Text style={s.badgeDesc}>{desc}</Text>
    </View>
  </View>
);

function PaymentTypeModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[s.dropdownModal, { backgroundColor: colors.card }]}>
          <Text style={[s.dropdownModalTitle, { color: colors.text, borderBottomColor: colors.borderLight }]}>Payment Type</Text>
          {PAYMENT_TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[s.dropdownItem, { borderBottomColor: colors.borderLight }, selected === t.value && { backgroundColor: colors.primaryLight }]}
              onPress={() => { onSelect(t.value); onClose(); }}
            >
              <Text style={[s.dropdownItemText, { color: colors.text }, selected === t.value && { color: colors.primary }]}>{t.label}</Text>
              {selected === t.value && <Ionicons name="checkmark" size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function LoanSelectorModal({
  visible,
  loans,
  selectedId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  loans: { id: string; reference: string; approvedAmount: number }[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[s.dropdownModal, { backgroundColor: colors.card }]}>
          <Text style={[s.dropdownModalTitle, { color: colors.text, borderBottomColor: colors.borderLight }]}>Select Loan</Text>
          {loans.map((loan) => (
            <TouchableOpacity
              key={loan.id}
              style={[s.dropdownItem, { borderBottomColor: colors.borderLight }, selectedId === loan.id && { backgroundColor: colors.primaryLight }]}
              onPress={() => { onSelect(loan.id); onClose(); }}
            >
              <View>
                <Text style={[s.dropdownItemText, { color: colors.text }]}>{loan.reference}</Text>
                <Text style={[s.dropdownItemSub, { color: colors.text }]}>\u20A6{Number(loan.approvedAmount).toLocaleString()}</Text>
              </View>
              {selectedId === loan.id && <Ionicons name="checkmark" size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const PaymentFlow = () => {
  const [screen, setScreen] = useState<Screen>("form");
  const [paymentType, setPaymentType] = useState("");
  const [amount, setAmount] = useState("");
  const [loanId, setLoanId] = useState<string | undefined>();
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const { colors } = useTheme();

  const { data: activeLoans = [], isLoading: loadingLoans } = useActiveLoans(paymentType === "LOAN_REPAYMENT");
  const { data: memberLoanBalance = 0 } = useMemberLoanBalance(paymentType === "LOAN_REPAYMENT");

  const selectedLoanBalance = loanId ? memberLoanBalance : 0;
  const [loading, setLoading] = useState(false);
  const [monoUrl, setMonoUrl] = useState("");
  const [pendingReference, setPendingReference] = useState("");
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [result, setResult] = useState<MonoVerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [rateLimitError, setRateLimitError] = useState("");

  const queryClient = useQueryClient();
  const fetchSavingsBalance = useSavingsBalanceStore((state) => state.fetchSavingsBalance);

  const validateAmount = useCallback((): string | null => {
    const n = Number(amount);
    if (!n || n < 100) return "Minimum payment amount is \u20A6100";
    if (n > 10_000_000) return "Maximum payment amount is \u20A610,000,000";
    if (!Number.isInteger(n * 100)) return "Amount can have at most 2 decimal places";
    if (paymentType === "LOAN_REPAYMENT" && selectedLoanBalance > 0 && n > selectedLoanBalance) {
      return `Amount cannot exceed outstanding balance of \u20A6${selectedLoanBalance.toLocaleString()}`;
    }
    return null;
  }, [amount, paymentType, selectedLoanBalance]);

  const isFormValid = useCallback((): boolean => {
    const n = Number(amount);
    if (!paymentType || !(n > 0)) return false;
    if (paymentType === "LOAN_REPAYMENT") {
      if (activeLoans.length > 0) return !!(loanId && selectedLoanBalance > 0);
      return selectedLoanBalance > 0;
    }
    return true;
  }, [paymentType, amount, activeLoans.length, loanId, selectedLoanBalance]);

  const handlePayNow = useCallback(async () => {
    setRateLimitError("");
    const err = validateAmount();
    if (err) { Alert.alert("Invalid Amount", err); return; }
    setLoading(true);
    try {
      const { monoUrl: url } = await initializeMonoPayment({ paymentType, amount: Number(amount), loanId });
      setMonoUrl(url);
      setScreen("webview");
    } catch (error: any) {
      const status = error.response?.status;
      const msg = error.response?.data?.error?.message || error.response?.data?.message || "Failed to initialize payment.";
      if (status === 429) {
        const retryAfter = error.response?.headers["retry-after"] || "60";
        setRateLimitError(`Too many attempts. Please try again in ${retryAfter} seconds.`);
      } else {
        Alert.alert(status === 400 ? "Validation Error" : "Payment Error", msg);
      }
    } finally { setLoading(false); }
  }, [validateAmount, paymentType, amount, loanId]);

  const refetchData = useCallback(async () => {
    try {
      await Promise.all([
        fetchSavingsBalance(),
        fetchTransactions(),
        queryClient.invalidateQueries({ queryKey: queryKeys.payments.memberBalance }),
        queryClient.invalidateQueries({ queryKey: queryKeys.loans.balances() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.savings.balances() }),
      ]);
    } catch {}
  }, [fetchSavingsBalance, queryClient]);

  const handleVerify = useCallback(async (reference: string, retryCount = 0) => {
    setVerificationAttempts(retryCount + 1);
    setScreen("verifying");
    try {
      const data = await verifyMonoPayment(reference);
      setResult(data);
      await refetchData();
      setScreen("success");
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 500 && retryCount < 3) {
        setTimeout(() => handleVerify(reference, retryCount + 1), 2000 * (retryCount + 1));
        return;
      }
      const msg =
        status === 404 ? "Payment not found. Contact support if you were charged."
        : status === 429 ? "Too many verification attempts. Please wait and retry."
        : status === 402 ? (error.response?.data?.error?.message || "Payment verification failed.")
        : error.response?.data?.error?.message || error.response?.data?.message || "Failed to verify payment. Please contact support.";
      setErrorMessage(msg);
      setScreen("failed");
    }
  }, [refetchData]);

  const handleWebViewNavChange = useCallback((navState: { url: string }) => {
    const { url } = navState;
    try {
      const urlObj = new URL(url);
      if (!urlObj.pathname.includes("mono-success")) return;
      const ref = urlObj.searchParams.get("reference");
      const status = urlObj.searchParams.get("status");
      if (ref && !isVerifyingOrDone.current) {
        if (status && status !== "success") {
          const reason = urlObj.searchParams.get("reason") || "Payment was not completed";
          setErrorMessage(reason);
          setScreen("failed");
          return;
        }
        isVerifyingOrDone.current = true;
        setPendingReference(ref);
        handleVerify(ref);
      }
    } catch {}
  }, [handleVerify]);

  const isVerifyingOrDone = useRef(false);

  const handleShouldStartLoad = useCallback((request: { url: string }) => {
    const { url } = request;
    try {
      const urlObj = new URL(url);
      if (!urlObj.pathname.includes("mono-success")) return true;
      const ref = urlObj.searchParams.get("reference");
      const status = urlObj.searchParams.get("status");
      if (ref) {
        if (status && status !== "success") {
          const reason = urlObj.searchParams.get("reason") || "Payment was not completed";
          setErrorMessage(reason);
          setScreen("failed");
        } else if (!isVerifyingOrDone.current) {
          isVerifyingOrDone.current = true;
          setPendingReference(ref);
          handleVerify(ref);
        }
        return false;
      }
    } catch {}
    return true;
  }, [handleVerify]);

  const handleRetry = useCallback(() => {
    setErrorMessage("");
    isVerifyingOrDone.current = false;
    handleVerify(pendingReference);
  }, [handleVerify, pendingReference]);

  const navigateAfterSuccess = useCallback(() => {
    if (!result) { router.replace("/(tabs)"); return; }
    const txnType = result.paymentType || result.transaction?.type;
    if (txnType === "SAVINGS_DEPOSIT") router.replace("/(tabs)/savings");
    else if (txnType === "LOAN_REPAYMENT") router.replace("/(tabs)/loan");
    else router.replace("/(tabs)");
  }, [result]);

  const handlePaymentTypeChange = useCallback((value: string) => {
    setPaymentType(value);
    setLoanId(undefined);
  }, []);

  const handleAmountChange = useCallback((v: string) => {
    if (/^\d*\.?\d{0,2}$/.test(v)) setAmount(v);
  }, []);

  if (screen === "webview") {
    return (
      <SafeAreaView style={[s.safeArea, { backgroundColor: colors.background }]}>
        <View style={[s.webviewHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => Alert.alert("Cancel Payment", "Are you sure you want to cancel this payment?", [
              { text: "No", style: "cancel" },
              { text: "Yes", onPress: () => { isVerifyingOrDone.current = false; setScreen("form"); } },
            ])}
            style={s.webviewBack}
          >
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[s.webviewTitle, { color: colors.text }]}>Mono Payment</Text>
          <View style={s.webviewLock}>
            <Ionicons name="lock-closed" size={14} color="#4CAF50" />
          </View>
        </View>
        <WebView
          source={{ uri: monoUrl }}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          onNavigationStateChange={handleWebViewNavChange}
          startInLoadingState
          renderLoading={() => (
            <View style={[s.webviewLoading, { backgroundColor: colors.background }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[s.webviewLoadingText, { color: colors.text }]}>Loading secure payment page...</Text>
            </View>
          )}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }

  if (screen === "verifying") {
    return (
      <SafeAreaView style={[s.safeArea, { backgroundColor: colors.background }]}>
        <View style={[s.centeredScreen, { backgroundColor: colors.background }]}>
          <View style={[s.statusCard, { backgroundColor: colors.card }]}>
            <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 20 }} />
            <Text style={[s.statusTitle, { color: colors.text }]}>Verifying Payment</Text>
            <Text style={[s.statusSubtitle, { color: colors.text }]}>
              Please wait while we securely confirm your payment...
            </Text>
            {verificationAttempts > 1 && (
              <Text style={[s.attemptText, { color: colors.text }]}>Attempt {verificationAttempts} of 4</Text>
            )}
            <View style={s.secureRow}>
              <Ionicons name="lock-closed" size={14} color={colors.text} />
              <Text style={[s.secureText, { color: colors.text }]}> Secure verification in progress</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "success" && result) {
    return (
      <SafeAreaView style={[s.safeArea, { backgroundColor: colors.background }]}>
        <View style={[s.centeredScreen, { backgroundColor: colors.background }]}>
          <View style={[s.statusCard, { backgroundColor: colors.card }]}>
            <View style={s.successCircle}>
              <Ionicons name="checkmark" size={44} color="white" />
            </View>
            <Text style={[s.statusTitle, { color: colors.text }]}>
              {result.loanCompleted ? "Loan Completed!" : "Payment Successful!"}
            </Text>
            <Text style={[s.statusSubtitle, { color: colors.text }]}>
              {result.alreadyProcessed ? "This payment has already been processed." : result.message || "Your payment has been processed successfully."}
            </Text>
            {result.transaction && (
              <View style={[s.detailsBox, { backgroundColor: colors.background }]}>
                <SummaryRow label="Amount" value={'\u20A6${Number(result.transaction.amount).toLocaleString()}'} />
                <SummaryRow label="Reference" value={result.transaction.reference} />
                <SummaryRow label="Status" value="Completed" valueColor="#4CAF50" />
                {result.loanCompleted && (
                  <View style={s.loanCompletedBadge}>
                    <Text style={s.loanCompletedText}>Your loan has been fully repaid!</Text>
                  </View>
                )}
                {result.remainingBalance !== undefined && result.remainingBalance > 0 && (
                  <SummaryRow label="Remaining Balance" value={'\u20A6${result.remainingBalance.toLocaleString()}'} />
                )}
              </View>
            )}
            <TouchableOpacity style={[s.primaryBtn, { backgroundColor: colors.primary }]} onPress={navigateAfterSuccess}>
              <Text style={s.primaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "failed") {
    return (
      <SafeAreaView style={[s.safeArea, { backgroundColor: colors.background }]}>
        <View style={[s.centeredScreen, { backgroundColor: colors.background }]}>
          <View style={[s.statusCard, { backgroundColor: colors.card }]}>
            <View style={s.failedCircle}>
              <Ionicons name="close" size={44} color="white" />
            </View>
            <Text style={[s.statusTitle, { color: colors.text }]}>Payment Failed</Text>
            <View style={[s.errorBox, { backgroundColor: colors.error + "15" }]}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
              <Text style={[s.errorText, { color: colors.error }]}>{errorMessage || "Unable to process your payment."}</Text>
            </View>
            <View style={[s.warningBox, { backgroundColor: "#FFFDE7", borderLeftColor: "#FFC107" }]}>
              <Text style={s.warningTitle}>What to do next:</Text>
              <Text style={s.warningItem}>{"\u2022"} Check your email for payment confirmation</Text>
              <Text style={s.warningItem}>{"\u2022"} Contact support with your payment reference</Text>
              <Text style={s.warningItem}>{"\u2022"} Your payment may still be processing</Text>
            </View>
            {pendingReference ? (
              <View style={[s.referenceBox, { backgroundColor: colors.background }]}>
                <Text style={[s.referenceLabel, { color: colors.text }]}>Payment Reference:</Text>
                <Text style={[s.referenceValue, { color: colors.text }]}>{pendingReference}</Text>
              </View>
            ) : null}
            <View style={s.buttonRow}>
              {verificationAttempts < 4 && (
                <TouchableOpacity style={[s.primaryBtn, { backgroundColor: colors.primary, flex: 1, marginRight: 8 }]} onPress={handleRetry}>
                  <Text style={s.primaryBtnText}>Retry</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[s.outlineBtn, { borderColor: colors.border, flex: 1 }]} onPress={() => { isVerifyingOrDone.current = false; setScreen("form"); }}>
                <Text style={[s.outlineBtnText, { color: colors.text }]}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.safeArea, { backgroundColor: colors.background }]}>
      <View style={[s.backToHome, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={s.backToHomeBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={[s.backToHomeText, { color: colors.text }]}>Home</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.formHeader}>
          <View style={s.formIconWrapper}>
            <Ionicons name="card-outline" size={30} color="white" />
          </View>
          <Text style={[s.formTitle, { color: colors.text }]}>Make Payment</Text>
          <View style={s.encryptionBadge}>
            <Ionicons name="lock-closed" size={12} color={colors.text} />
            <Text style={[s.encryptionText, { color: colors.text }]}> 256-bit encryption</Text>
          </View>
        </View>

        {!!rateLimitError && (
          <View style={s.rateLimitBox}>
            <Ionicons name="time-outline" size={16} color="#E65100" />
            <Text style={s.rateLimitText}>{rateLimitError}</Text>
          </View>
        )}

        <View style={s.section}>
          <Text style={[s.label, { color: colors.text }]}>Payment Type *</Text>
          <TouchableOpacity style={[s.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setShowPaymentTypeModal(true)} disabled={loading}>
            <Text style={[s.dropdownText, { color: colors.text }, !paymentType && { color: colors.text }]}>
              {PAYMENT_TYPES.find((t) => t.value === paymentType)?.label || "Select payment type"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {paymentType === "LOAN_REPAYMENT" && (
          <View style={s.section}>
            <Text style={[s.label, { color: colors.text }]}>Select Loan *</Text>
            {loadingLoans ? (
              <View style={s.loansLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[s.loansLoadingText, { color: colors.text }]}>Loading loans...</Text>
              </View>
            ) : activeLoans.length > 0 ? (
              <>
                <TouchableOpacity style={[s.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setShowLoanModal(true)} disabled={loading}>
                  <Text style={[s.dropdownText, { color: colors.text }, !loanId && { color: colors.text }]}>
                    {loanId ? `${activeLoans.find((l) => l.id === loanId)?.reference} \u2014 \u20A6${Number(activeLoans.find((l) => l.id === loanId)?.approvedAmount).toLocaleString()}` : "Select loan to repay"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={colors.text} />
                </TouchableOpacity>
                {selectedLoanBalance > 0 && (
                  <View style={s.balanceBadge}>
                    <Ionicons name="information-circle-outline" size={14} color="#1565C0" />
                    <Text style={s.balanceText}> Outstanding Balance: \u20A6${selectedLoanBalance.toLocaleString()}</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={[s.noLoansBox, { backgroundColor: colors.background }]}>
                <Text style={[s.noLoansText, { color: colors.text }]}>No active loans found</Text>
              </View>
            )}
          </View>
        )}

        <View style={s.section}>
          <Text style={[s.label, { color: colors.text }]}>Amount (NGN) *</Text>
          <TextInput
            style={[s.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="Enter amount"
            placeholderTextColor={colors.text}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            editable={!loading}
          />
          <Text style={[s.inputHint, { color: colors.text }]}>Min: {formatCurrency(100)} | Max: {formatCurrency(10000000)}</Text>
        </View>

        <View style={s.section}>
          <Text style={[s.quickLabel, { color: colors.text }]}>Quick amounts</Text>
          <View style={s.quickAmounts}>
            {QUICK_AMOUNTS.map((qa) => (
              <TouchableOpacity
                key={qa}
                style={[s.quickBtn, { borderColor: colors.border, backgroundColor: colors.card }, amount === qa.toString() && { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}
                onPress={() => setAmount(qa.toString())}
              >
                <Text style={[s.quickBtnText, { color: colors.text }, amount === qa.toString() && { color: colors.primary }]}>
                  {formatAmount(qa.toString())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[s.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SummaryRow label="Payment Type" value={PAYMENT_TYPES.find((t) => t.value === paymentType)?.label || "Not selected"} />
          {paymentType === "LOAN_REPAYMENT" && selectedLoanBalance > 0 && (
            <SummaryRow label="Outstanding" value={formatCurrency(selectedLoanBalance)} />
          )}
          <SummaryRow label="Amount" value={amount ? formatCurrency(Number(amount)) : formatCurrency(0)} />
          <View style={[s.summaryDivider, { backgroundColor: colors.border }]} />
          <SummaryRow label="Total" value={amount ? formatCurrency(Number(amount)) : formatCurrency(0)} bold valueColor="#4CAF50" />
        </View>

        <TouchableOpacity style={[s.payBtn, { backgroundColor: colors.primary }, (!isFormValid() || loading) && s.payBtnDisabled]} onPress={handlePayNow} disabled={!isFormValid() || loading}>
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="card" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={s.payBtnText}>{!isFormValid() ? "Fill all fields to proceed" : "Pay Now"}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={[s.securityCard, { backgroundColor: colors.card }]}>
          <SecurityBadge icon="shield-checkmark" title="Secure Payment" desc="All transactions are encrypted end-to-end" />
          <SecurityBadge icon="flash" title="Instant Processing" desc="Payments are verified in real-time" />
          <SecurityBadge icon="eye-off" title="Fraud Protection" desc="Advanced security prevents unauthorised transactions" />
        </View>

        <Text style={[s.poweredBy, { color: colors.text }]}>Secured by Mono Payment Gateway</Text>
      </ScrollView>

      <PaymentTypeModal visible={showPaymentTypeModal} selected={paymentType} onSelect={handlePaymentTypeChange} onClose={() => setShowPaymentTypeModal(false)} />
      <LoanSelectorModal visible={showLoanModal} loans={activeLoans} selectedId={loanId} onSelect={setLoanId} onClose={() => setShowLoanModal(false)} />
    </SafeAreaView>
  );
};

export default PaymentFlow;

const s = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 48 },
  backToHome: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 8, paddingVertical: 4,
    borderBottomWidth: 1,
  },
  backToHomeBtn: { flexDirection: "row", alignItems: "center", padding: 8, gap: 4 },
  backToHomeText: { fontSize: 14, fontFamily: "Poppins_400Regular" },
  formHeader: { alignItems: "center", marginBottom: 24, marginTop: 8 },
  formIconWrapper: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "#4CAF50",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  formTitle: { fontSize: 24, fontWeight: "bold", fontFamily: "Poppins_700Bold", marginBottom: 6 },
  encryptionBadge: { flexDirection: "row", alignItems: "center" },
  encryptionText: { fontSize: 12, fontFamily: "Poppins_400Regular" },
  rateLimitBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFF3E0",
    borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 4,
    borderLeftColor: "#FF9800", gap: 8,
  },
  rateLimitText: { flex: 1, fontSize: 13, color: "#E65100", fontFamily: "Poppins_400Regular" },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 8, fontFamily: "Poppins_500Medium" },
  dropdown: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 14,
  },
  dropdownText: { fontSize: 15, fontFamily: "Poppins_400Regular" },
  loansLoading: { flexDirection: "row", alignItems: "center", padding: 16, gap: 10 },
  loansLoadingText: { fontFamily: "Poppins_400Regular" },
  balanceBadge: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#E3F2FD",
    borderRadius: 8, padding: 10, marginTop: 8,
  },
  balanceText: { fontSize: 13, color: "#1565C0", fontFamily: "Poppins_500Medium" },
  noLoansBox: { borderRadius: 10, padding: 16, alignItems: "center" },
  noLoansText: { fontFamily: "Poppins_400Regular" },
  input: {
    borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, fontFamily: "Poppins_400Regular",
  },
  inputHint: { fontSize: 12, marginTop: 6, fontFamily: "Poppins_400Regular" },
  quickLabel: { fontSize: 13, marginBottom: 10, fontFamily: "Poppins_400Regular" },
  quickAmounts: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickBtn: {
    borderRadius: 20, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 8,
  },
  quickBtnText: { fontSize: 13, fontFamily: "Poppins_400Regular" },
  summaryBox: {
    borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: "#666", fontFamily: "Poppins_400Regular" },
  summaryLabelBold: { fontFamily: "Poppins_600SemiBold", color: "#1a1a1a", fontSize: 16 },
  summaryValue: { fontSize: 14, color: "#333", fontFamily: "Poppins_500Medium" },
  summaryValueBold: { fontFamily: "Poppins_700Bold", fontSize: 16 },
  summaryDivider: { height: 1, marginVertical: 8 },
  payBtn: {
    borderRadius: 12, paddingVertical: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginBottom: 20, minHeight: 54,
  },
  payBtnDisabled: { opacity: 0.5 },
  payBtnText: { color: "white", fontSize: 16, fontFamily: "Poppins_600SemiBold" },
  securityCard: {
    borderRadius: 12, padding: 16, borderLeftWidth: 4,
    borderLeftColor: "#4CAF50", marginBottom: 16, gap: 14,
  },
  badgeRow: { flexDirection: "row", alignItems: "flex-start" },
  badgeTitle: { fontSize: 13, fontFamily: "Poppins_600SemiBold", color: "#333" },
  badgeDesc: { fontSize: 12, color: "#666", fontFamily: "Poppins_400Regular", marginTop: 2 },
  poweredBy: { textAlign: "center", fontSize: 12, fontFamily: "Poppins_400Regular" },
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center",
    alignItems: "center", padding: 20,
  },
  dropdownModal: {
    borderRadius: 16, padding: 8, width: "100%", maxWidth: 340,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  dropdownModalTitle: {
    fontSize: 14, fontFamily: "Poppins_500Medium",
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
  },
  dropdownItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  dropdownItemText: { fontSize: 15, fontFamily: "Poppins_400Regular" },
  dropdownItemSub: { fontSize: 12, fontFamily: "Poppins_400Regular", marginTop: 2 },
  webviewHeader: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16,
    paddingVertical: 12, borderBottomWidth: 1,
  },
  webviewBack: { padding: 4, marginRight: 12 },
  webviewTitle: { flex: 1, fontSize: 16, fontFamily: "Poppins_600SemiBold" },
  webviewLock: { backgroundColor: "#E8F5E9", borderRadius: 12, padding: 6 },
  webviewLoading: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", alignItems: "center",
  },
  webviewLoadingText: { marginTop: 12, fontFamily: "Poppins_400Regular" },
  centeredScreen: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  statusCard: {
    borderRadius: 20, padding: 28, alignItems: "center",
    width: "100%", maxWidth: 360,
    shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12, elevation: 4,
  },
  statusTitle: { fontSize: 22, fontFamily: "Poppins_700Bold", marginBottom: 8, textAlign: "center" },
  statusSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 20, fontFamily: "Poppins_400Regular" },
  attemptText: { fontSize: 13, marginBottom: 16, fontFamily: "Poppins_400Regular" },
  secureRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  secureText: { fontSize: 12, fontFamily: "Poppins_400Regular" },
  successCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: "#4CAF50",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
    shadowColor: "#4CAF50", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  failedCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: "#EF4444",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
  },
  detailsBox: { borderRadius: 12, padding: 16, width: "100%", marginBottom: 20 },
  loanCompletedBadge: { backgroundColor: "#E8F5E9", borderRadius: 8, padding: 10, marginTop: 8 },
  loanCompletedText: { color: "#2E7D32", fontSize: 13, fontFamily: "Poppins_500Medium" },
  errorBox: {
    flexDirection: "row", alignItems: "flex-start",
    borderRadius: 10, padding: 12, marginBottom: 16, width: "100%", gap: 8,
  },
  errorText: { flex: 1, fontSize: 13, fontFamily: "Poppins_400Regular" },
  warningBox: {
    borderRadius: 10, padding: 14, width: "100%",
    marginBottom: 16, borderLeftWidth: 3,
  },
  warningTitle: { fontSize: 13, fontFamily: "Poppins_600SemiBold", color: "#7B6000", marginBottom: 6 },
  warningItem: { fontSize: 12, color: "#7B6000", lineHeight: 20, fontFamily: "Poppins_400Regular" },
  referenceBox: { borderRadius: 10, padding: 12, width: "100%", marginBottom: 16 },
  referenceLabel: { fontSize: 12, fontFamily: "Poppins_400Regular", marginBottom: 4 },
  referenceValue: { fontSize: 12, fontFamily: "Poppins_500Medium" },
  buttonRow: { flexDirection: "row", width: "100%" },
  primaryBtn: {
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20,
    alignItems: "center", justifyContent: "center", minHeight: 50,
  },
  primaryBtnText: { color: "white", fontSize: 15, fontFamily: "Poppins_600SemiBold" },
  outlineBtn: {
    borderWidth: 1.5, borderRadius: 12, paddingVertical: 14,
    alignItems: "center", justifyContent: "center",
  },
  outlineBtnText: { fontSize: 15, fontFamily: "Poppins_500Medium" },
});
