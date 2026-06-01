import React, { useState, useCallback, useRef } from "react";
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

const PRIMARY = "#982323";
const QUICK_AMOUNTS = [5000, 10000, 15000, 20000, 30000];
const PAYMENT_TYPES = [
  { label: "Loan Repayment", value: "LOAN_REPAYMENT" },
  { label: "Quick Savings Deposit", value: "SAVINGS_DEPOSIT" },
];

const formatAmount = (v: string | number) =>
  v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <View style={s.dropdownModal}>
          <Text style={s.dropdownModalTitle}>Payment Type</Text>
          {PAYMENT_TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[s.dropdownItem, selected === t.value && s.dropdownItemActive]}
              onPress={() => {
                onSelect(t.value);
                onClose();
              }}
            >
              <Text
                style={[
                  s.dropdownItemText,
                  selected === t.value && s.dropdownItemTextActive,
                ]}
              >
                {t.label}
              </Text>
              {selected === t.value && (
                <Ionicons name="checkmark" size={18} color={PRIMARY} />
              )}
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
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <View style={s.dropdownModal}>
          <Text style={s.dropdownModalTitle}>Select Loan</Text>
          {loans.map((loan) => (
            <TouchableOpacity
              key={loan.id}
              style={[s.dropdownItem, selectedId === loan.id && s.dropdownItemActive]}
              onPress={() => {
                onSelect(loan.id);
                onClose();
              }}
            >
              <View>
                <Text style={s.dropdownItemText}>{loan.reference}</Text>
                <Text style={s.dropdownItemSub}>
                  ₦{Number(loan.approvedAmount).toLocaleString()}
                </Text>
              </View>
              {selectedId === loan.id && (
                <Ionicons name="checkmark" size={18} color={PRIMARY} />
              )}
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

  const { data: activeLoans = [], isLoading: loadingLoans } = useActiveLoans(
    paymentType === "LOAN_REPAYMENT",
  );
  const { data: memberLoanBalance = 0 } = useMemberLoanBalance(
    paymentType === "LOAN_REPAYMENT",
  );

  const selectedLoanBalance = loanId ? memberLoanBalance : 0;

  const [loading, setLoading] = useState(false);
  const [monoUrl, setMonoUrl] = useState("");
  const [pendingReference, setPendingReference] = useState("");
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [result, setResult] = useState<MonoVerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [rateLimitError, setRateLimitError] = useState("");

  const queryClient = useQueryClient();
  const fetchSavingsBalance = useSavingsBalanceStore(
    (state) => state.fetchSavingsBalance,
  );

  const validateAmount = useCallback((): string | null => {
    const n = Number(amount);
    if (!n || n < 100) return "Minimum payment amount is ₦100";
    if (n > 10_000_000) return "Maximum payment amount is ₦10,000,000";
    if (!Number.isInteger(n * 100)) return "Amount can have at most 2 decimal places";
    if (paymentType === "LOAN_REPAYMENT" && selectedLoanBalance > 0 && n > selectedLoanBalance) {
      return `Amount cannot exceed outstanding balance of ₦${selectedLoanBalance.toLocaleString()}`;
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
    if (err) {
      Alert.alert("Invalid Amount", err);
      return;
    }

    setLoading(true);
    try {
      const { monoUrl: url } = await initializeMonoPayment({
        paymentType,
        amount: Number(amount),
        loanId,
      });
      setMonoUrl(url);

      console.log("Initialized Mono payment:", { paymentType, amount, loanId, url });

      setScreen("webview");
    } catch (error: any) {
      const status = error.response?.status;
      const msg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Failed to initialize payment.";

      if (status === 429) {
        const retryAfter = error.response?.headers["retry-after"] || "60";
        setRateLimitError(`Too many attempts. Please try again in ${retryAfter} seconds.`);
      } else {
        Alert.alert(status === 400 ? "Validation Error" : "Payment Error", msg);
      }
    } finally {
      setLoading(false);
    }
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
    } catch {
      // Refetch is best-effort; don't block navigation
    }
  }, [fetchSavingsBalance, queryClient]);

  const handleVerify = useCallback(async (reference: string, retryCount = 0) => {
    setVerificationAttempts(retryCount + 1);
    setScreen("verifying");

    try {
      const data = await verifyMonoPayment(reference);
      // API-level success means payment was verified — no nested success field
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
        status === 404
          ? "Payment not found. Contact support if you were charged."
          : status === 429
            ? "Too many verification attempts. Please wait and retry."
            : status === 402
              ? error.response?.data?.error?.message || "Payment verification failed."
              : error.response?.data?.error?.message ||
              error.response?.data?.message ||
              "Failed to verify payment. Please contact support.";

      setErrorMessage(msg);
      setScreen("failed");
    }
  }, [refetchData]);

  const handleWebViewNavChange = useCallback(
    (navState: { url: string }) => {
      const { url } = navState;
      try {
        const urlObj = new URL(url);
        // Only intercept the success redirect path (fallback if onShouldStartLoadWithRequest is missed)
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
      } catch {
        // URL parsing failed; ignore
      }
    },

    [handleVerify],
  );

  const isVerifyingOrDone = useRef(false);

  const handleShouldStartLoad = useCallback(
    (request: { url: string }) => {
      const { url } = request;
      try {
        const urlObj = new URL(url);
        // Intercept any URL whose path ends with /payments/mono-success
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
          return false; // STOP the WebView from navigating
        }
      } catch {
        // ignore parse errors
      }
      return true;
    },
    [handleVerify],
  );


  const handleRetry = useCallback(() => {
    setErrorMessage("");
    isVerifyingOrDone.current = false;
    handleVerify(pendingReference);
  }, [handleVerify, pendingReference]);

  const navigateAfterSuccess = useCallback(() => {
    if (!result) {
      router.replace("/(tabs)");
      return;
    }
    const txnType = result.paymentType || result.transaction?.type;
    if (txnType === "SAVINGS_DEPOSIT") {
      router.replace("/(tabs)/savings");
    } else if (txnType === "LOAN_REPAYMENT") {
      router.replace("/(tabs)/loan");
    } else {
      router.replace("/(tabs)");
    }
  }, [result]);

  const handlePaymentTypeChange = useCallback((value: string) => {
    setPaymentType(value);
    setLoanId(undefined);
  }, []);

  const handleAmountChange = useCallback((v: string) => {
    if (/^\d*\.?\d{0,2}$/.test(v)) setAmount(v);
  }, []);

  // ── Screens ─────────────────────────────────────────────────────────────

  if (screen === "webview") {
    return (
      <SafeAreaView style={s.safeArea}>
        <View style={s.webviewHeader}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Cancel Payment", "Are you sure you want to cancel this payment?", [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: () => { isVerifyingOrDone.current = false; setScreen("form"); } },
              ])
            }
            style={s.webviewBack}
          >
            <Ionicons name="close" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={s.webviewTitle}>Mono Payment</Text>
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
            <View style={s.webviewLoading}>
              <ActivityIndicator size="large" color={PRIMARY} />
              <Text style={s.webviewLoadingText}>Loading secure payment page...</Text>
            </View>
          )}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }

  if (screen === "verifying") {
    return (
      <SafeAreaView style={s.safeArea}>
        <View style={s.centeredScreen}>
          <View style={s.statusCard}>
            <ActivityIndicator size="large" color={PRIMARY} style={{ marginBottom: 20 }} />
            <Text style={s.statusTitle}>Verifying Payment</Text>
            <Text style={s.statusSubtitle}>
              Please wait while we securely confirm your payment...
            </Text>
            {verificationAttempts > 1 && (
              <Text style={s.attemptText}>Attempt {verificationAttempts} of 4</Text>
            )}
            <View style={s.secureRow}>
              <Ionicons name="lock-closed" size={14} color="#999" />
              <Text style={s.secureText}> Secure verification in progress</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "success" && result) {
    return (
      <SafeAreaView style={s.safeArea}>
        <View style={s.centeredScreen}>
          <View style={s.statusCard}>
            <View style={s.successCircle}>
              <Ionicons name="checkmark" size={44} color="white" />
            </View>
            <Text style={s.statusTitle}>
              {result.loanCompleted ? "Loan Completed!" : "Payment Successful!"}
            </Text>
            <Text style={s.statusSubtitle}>
              {result.alreadyProcessed
                ? "This payment has already been processed."
                : result.message || "Your payment has been processed successfully."}
            </Text>

            {result.transaction && (
              <View style={s.detailsBox}>
                <SummaryRow
                  label="Amount"
                  value={`₦${Number(result.transaction.amount).toLocaleString()}`}
                />
                <SummaryRow label="Reference" value={result.transaction.reference} />
                <SummaryRow label="Status" value="Completed" valueColor="#4CAF50" />
                {result.loanCompleted && (
                  <View style={s.loanCompletedBadge}>
                    <Text style={s.loanCompletedText}>Your loan has been fully repaid!</Text>
                  </View>
                )}
                {result.remainingBalance !== undefined && result.remainingBalance > 0 && (
                  <SummaryRow
                    label="Remaining Balance"
                    value={`₦${result.remainingBalance.toLocaleString()}`}
                  />
                )}
              </View>
            )}

            <TouchableOpacity style={s.primaryBtn} onPress={navigateAfterSuccess}>
              <Text style={s.primaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "failed") {
    return (
      <SafeAreaView style={s.safeArea}>
        <View style={s.centeredScreen}>
          <View style={s.statusCard}>
            <View style={s.failedCircle}>
              <Ionicons name="close" size={44} color="white" />
            </View>
            <Text style={s.statusTitle}>Payment Failed</Text>

            <View style={s.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={PRIMARY} />
              <Text style={s.errorText}>{errorMessage || "Unable to process your payment."}</Text>
            </View>

            <View style={s.warningBox}>
              <Text style={s.warningTitle}>What to do next:</Text>
              <Text style={s.warningItem}>• Check your email for payment confirmation</Text>
              <Text style={s.warningItem}>• Contact support with your payment reference</Text>
              <Text style={s.warningItem}>• Your payment may still be processing</Text>
            </View>

            {pendingReference ? (
              <View style={s.referenceBox}>
                <Text style={s.referenceLabel}>Payment Reference:</Text>
                <Text style={s.referenceValue}>{pendingReference}</Text>
              </View>
            ) : null}

            <View style={s.buttonRow}>
              {verificationAttempts < 4 && (
                <TouchableOpacity
                  style={[s.primaryBtn, { flex: 1, marginRight: 8 }]}
                  onPress={handleRetry}
                >
                  <Text style={s.primaryBtnText}>Retry</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[s.outlineBtn, { flex: 1 }]}
                onPress={() => { isVerifyingOrDone.current = false; setScreen("form"); }}
              >
                <Text style={s.outlineBtnText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Payment Form ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.formHeader}>
          <View style={s.formIconWrapper}>
            <Ionicons name="card-outline" size={30} color="white" />
          </View>
          <Text style={s.formTitle}>Make Payment</Text>
          <View style={s.encryptionBadge}>
            <Ionicons name="lock-closed" size={12} color="#666" />
            <Text style={s.encryptionText}> 256-bit encryption</Text>
          </View>
        </View>

        {!!rateLimitError && (
          <View style={s.rateLimitBox}>
            <Ionicons name="time-outline" size={16} color="#E65100" />
            <Text style={s.rateLimitText}>{rateLimitError}</Text>
          </View>
        )}

        {/* Payment Type */}
        <View style={s.section}>
          <Text style={s.label}>Payment Type *</Text>
          <TouchableOpacity
            style={s.dropdown}
            onPress={() => setShowPaymentTypeModal(true)}
            disabled={loading}
          >
            <Text style={[s.dropdownText, !paymentType && s.placeholder]}>
              {PAYMENT_TYPES.find((t) => t.value === paymentType)?.label || "Select payment type"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Loan selector */}
        {paymentType === "LOAN_REPAYMENT" && (
          <View style={s.section}>
            <Text style={s.label}>Select Loan *</Text>
            {loadingLoans ? (
              <View style={s.loansLoading}>
                <ActivityIndicator size="small" color={PRIMARY} />
                <Text style={s.loansLoadingText}>Loading loans...</Text>
              </View>
            ) : activeLoans.length > 0 ? (
              <>
                <TouchableOpacity
                  style={s.dropdown}
                  onPress={() => setShowLoanModal(true)}
                  disabled={loading}
                >
                  <Text style={[s.dropdownText, !loanId && s.placeholder]}>
                    {loanId
                      ? `${activeLoans.find((l) => l.id === loanId)?.reference} — ₦${Number(
                        activeLoans.find((l) => l.id === loanId)?.approvedAmount,
                      ).toLocaleString()}`
                      : "Select loan to repay"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                {selectedLoanBalance > 0 && (
                  <View style={s.balanceBadge}>
                    <Ionicons name="information-circle-outline" size={14} color="#1565C0" />
                    <Text style={s.balanceText}>
                      {" "}Outstanding Balance: ₦{selectedLoanBalance.toLocaleString()}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={s.noLoansBox}>
                <Text style={s.noLoansText}>No active loans found</Text>
              </View>
            )}
          </View>
        )}

        {/* Amount */}
        <View style={s.section}>
          <Text style={s.label}>Amount (NGN) *</Text>
          <TextInput
            style={s.input}
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            editable={!loading}
          />
          <Text style={s.inputHint}>Min: ₦100 | Max: ₦10,000,000</Text>
        </View>

        {/* Quick amounts */}
        <View style={s.section}>
          <Text style={s.quickLabel}>Quick amounts</Text>
          <View style={s.quickAmounts}>
            {QUICK_AMOUNTS.map((qa) => (
              <TouchableOpacity
                key={qa}
                style={[s.quickBtn, amount === qa.toString() && s.quickBtnActive]}
                onPress={() => setAmount(qa.toString())}
              >
                <Text style={[s.quickBtnText, amount === qa.toString() && s.quickBtnTextActive]}>
                  ₦{formatAmount(qa.toString())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={s.summaryBox}>
          <SummaryRow
            label="Payment Type"
            value={PAYMENT_TYPES.find((t) => t.value === paymentType)?.label || "Not selected"}
          />
          {paymentType === "LOAN_REPAYMENT" && selectedLoanBalance > 0 && (
            <SummaryRow label="Outstanding" value={`₦${selectedLoanBalance.toLocaleString()}`} />
          )}
          <SummaryRow
            label="Amount"
            value={amount ? `₦${formatAmount(amount)}` : "₦0"}
          />
          <View style={s.summaryDivider} />
          <SummaryRow
            label="Total"
            value={amount ? `₦${formatAmount(amount)}` : "₦0"}
            bold
            valueColor="#4CAF50"
          />
        </View>

        {/* Pay button */}
        <TouchableOpacity
          style={[s.payBtn, (!isFormValid() || loading) && s.payBtnDisabled]}
          onPress={handlePayNow}
          disabled={!isFormValid() || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="card" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={s.payBtnText}>
                {!isFormValid() ? "Fill all fields to proceed" : "Pay Now"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Security info */}
        <View style={s.securityCard}>
          <SecurityBadge
            icon="shield-checkmark"
            title="Secure Payment"
            desc="All transactions are encrypted end-to-end"
          />
          <SecurityBadge
            icon="flash"
            title="Instant Processing"
            desc="Payments are verified in real-time"
          />
          <SecurityBadge
            icon="eye-off"
            title="Fraud Protection"
            desc="Advanced security prevents unauthorised transactions"
          />
        </View>

        <Text style={s.poweredBy}>Secured by Mono Payment Gateway</Text>
      </ScrollView>

      <PaymentTypeModal
        visible={showPaymentTypeModal}
        selected={paymentType}
        onSelect={handlePaymentTypeChange}
        onClose={() => setShowPaymentTypeModal(false)}
      />

      <LoanSelectorModal
        visible={showLoanModal}
        loans={activeLoans}
        selectedId={loanId}
        onSelect={setLoanId}
        onClose={() => setShowLoanModal(false)}
      />
    </SafeAreaView>
  );
};

export default PaymentFlow;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContent: { padding: 16, paddingBottom: 48 },

  formHeader: { alignItems: "center", marginBottom: 24, marginTop: 8 },
  formIconWrapper: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "#4CAF50",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  formTitle: {
    fontSize: 24, fontWeight: "bold", color: "#1a1a1a",
    fontFamily: "Poppins_700Bold", marginBottom: 6,
  },
  encryptionBadge: { flexDirection: "row", alignItems: "center" },
  encryptionText: { fontSize: 12, color: "#666", fontFamily: "Poppins_400Regular" },

  rateLimitBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFF3E0",
    borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 4,
    borderLeftColor: "#FF9800", gap: 8,
  },
  rateLimitText: { flex: 1, fontSize: 13, color: "#E65100", fontFamily: "Poppins_400Regular" },

  section: { marginBottom: 20 },
  label: {
    fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8,
    fontFamily: "Poppins_500Medium",
  },

  dropdown: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "white", borderRadius: 12, borderWidth: 1.5,
    borderColor: "#e0e0e0", paddingHorizontal: 16, paddingVertical: 14,
  },
  dropdownText: { fontSize: 15, color: "#333", fontFamily: "Poppins_400Regular" },
  placeholder: { color: "#aaa" },

  loansLoading: { flexDirection: "row", alignItems: "center", padding: 16, gap: 10 },
  loansLoadingText: { color: "#666", fontFamily: "Poppins_400Regular" },
  balanceBadge: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#E3F2FD",
    borderRadius: 8, padding: 10, marginTop: 8,
  },
  balanceText: { fontSize: 13, color: "#1565C0", fontFamily: "Poppins_500Medium" },
  noLoansBox: { backgroundColor: "#f5f5f5", borderRadius: 10, padding: 16, alignItems: "center" },
  noLoansText: { color: "#999", fontFamily: "Poppins_400Regular" },

  input: {
    backgroundColor: "white", borderRadius: 12, borderWidth: 1.5,
    borderColor: "#e0e0e0", paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: "#1a1a1a", fontFamily: "Poppins_400Regular",
  },
  inputHint: { fontSize: 12, color: "#999", marginTop: 6, fontFamily: "Poppins_400Regular" },

  quickLabel: { fontSize: 13, color: "#666", marginBottom: 10, fontFamily: "Poppins_400Regular" },
  quickAmounts: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickBtn: {
    borderRadius: 20, borderWidth: 1.5, borderColor: "#ddd",
    paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "white",
  },
  quickBtnActive: { borderColor: PRIMARY, backgroundColor: "#fff5f5" },
  quickBtnText: { fontSize: 13, color: "#666", fontFamily: "Poppins_400Regular" },
  quickBtnTextActive: { color: PRIMARY, fontFamily: "Poppins_600SemiBold" },

  summaryBox: {
    backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: "#eee",
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: "#666", fontFamily: "Poppins_400Regular" },
  summaryLabelBold: { fontFamily: "Poppins_600SemiBold", color: "#1a1a1a", fontSize: 16 },
  summaryValue: { fontSize: 14, color: "#333", fontFamily: "Poppins_500Medium" },
  summaryValueBold: { fontFamily: "Poppins_700Bold", fontSize: 16 },
  summaryDivider: { height: 1, backgroundColor: "#eee", marginVertical: 8 },

  payBtn: {
    backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginBottom: 20, minHeight: 54,
  },
  payBtnDisabled: { opacity: 0.5 },
  payBtnText: { color: "white", fontSize: 16, fontFamily: "Poppins_600SemiBold" },

  securityCard: {
    backgroundColor: "white", borderRadius: 12, padding: 16, borderLeftWidth: 4,
    borderLeftColor: "#4CAF50", marginBottom: 16, gap: 14,
  },
  badgeRow: { flexDirection: "row", alignItems: "flex-start" },
  badgeTitle: { fontSize: 13, fontFamily: "Poppins_600SemiBold", color: "#333" },
  badgeDesc: { fontSize: 12, color: "#666", fontFamily: "Poppins_400Regular", marginTop: 2 },

  poweredBy: { textAlign: "center", fontSize: 12, color: "#999", fontFamily: "Poppins_400Regular" },

  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center",
    alignItems: "center", padding: 20,
  },
  dropdownModal: {
    backgroundColor: "white", borderRadius: 16, padding: 8, width: "100%",
    maxWidth: 340,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  dropdownModalTitle: {
    fontSize: 14, color: "#999", fontFamily: "Poppins_500Medium",
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  dropdownItemActive: { backgroundColor: "#fff5f5" },
  dropdownItemText: { fontSize: 15, color: "#333", fontFamily: "Poppins_400Regular" },
  dropdownItemTextActive: { color: PRIMARY, fontFamily: "Poppins_600SemiBold" },
  dropdownItemSub: { fontSize: 12, color: "#999", fontFamily: "Poppins_400Regular", marginTop: 2 },

  webviewHeader: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16,
    paddingVertical: 12, backgroundColor: "white", borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  webviewBack: { padding: 4, marginRight: 12 },
  webviewTitle: { flex: 1, fontSize: 16, fontFamily: "Poppins_600SemiBold", color: "#1a1a1a" },
  webviewLock: { backgroundColor: "#E8F5E9", borderRadius: 12, padding: 6 },
  webviewLoading: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5",
  },
  webviewLoadingText: { marginTop: 12, color: "#666", fontFamily: "Poppins_400Regular" },

  centeredScreen: {
    flex: 1, justifyContent: "center", alignItems: "center", padding: 20,
    backgroundColor: "#f5f5f5",
  },
  statusCard: {
    backgroundColor: "white", borderRadius: 20, padding: 28, alignItems: "center",
    width: "100%", maxWidth: 360,
    shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12, elevation: 4,
  },
  statusTitle: {
    fontSize: 22, fontFamily: "Poppins_700Bold", color: "#1a1a1a",
    marginBottom: 8, textAlign: "center",
  },
  statusSubtitle: {
    fontSize: 14, color: "#666", textAlign: "center", lineHeight: 22,
    marginBottom: 20, fontFamily: "Poppins_400Regular",
  },
  attemptText: { fontSize: 13, color: "#999", marginBottom: 16, fontFamily: "Poppins_400Regular" },
  secureRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  secureText: { fontSize: 12, color: "#999", fontFamily: "Poppins_400Regular" },

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
  detailsBox: {
    backgroundColor: "#f9f9f9", borderRadius: 12, padding: 16,
    width: "100%", marginBottom: 20,
  },
  loanCompletedBadge: { backgroundColor: "#E8F5E9", borderRadius: 8, padding: 10, marginTop: 8 },
  loanCompletedText: { color: "#2E7D32", fontSize: 13, fontFamily: "Poppins_500Medium" },

  errorBox: {
    flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff0f0",
    borderRadius: 10, padding: 12, marginBottom: 16, width: "100%", gap: 8,
  },
  errorText: { flex: 1, fontSize: 13, color: PRIMARY, fontFamily: "Poppins_400Regular" },
  warningBox: {
    backgroundColor: "#FFFDE7", borderRadius: 10, padding: 14, width: "100%",
    marginBottom: 16, borderLeftWidth: 3, borderLeftColor: "#FFC107",
  },
  warningTitle: { fontSize: 13, fontFamily: "Poppins_600SemiBold", color: "#7B6000", marginBottom: 6 },
  warningItem: { fontSize: 12, color: "#7B6000", lineHeight: 20, fontFamily: "Poppins_400Regular" },
  referenceBox: {
    backgroundColor: "#f5f5f5", borderRadius: 10, padding: 12,
    width: "100%", marginBottom: 16,
  },
  referenceLabel: { fontSize: 12, color: "#666", fontFamily: "Poppins_400Regular", marginBottom: 4 },
  referenceValue: { fontSize: 12, color: "#333", fontFamily: "Poppins_500Medium" },
  buttonRow: { flexDirection: "row", width: "100%" },
  primaryBtn: {
    backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20,
    alignItems: "center", justifyContent: "center", minHeight: 50,
  },
  primaryBtnText: { color: "white", fontSize: 15, fontFamily: "Poppins_600SemiBold" },
  outlineBtn: {
    borderWidth: 1.5, borderColor: "#ddd", borderRadius: 12, paddingVertical: 14,
    alignItems: "center", justifyContent: "center",
  },
  outlineBtnText: { color: "#555", fontSize: 15, fontFamily: "Poppins_500Medium" },
});
