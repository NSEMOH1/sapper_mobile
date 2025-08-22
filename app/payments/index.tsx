import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const PaymentFlow = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>("Loan Payment");
  const [amount, setAmount] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const quickAmounts = [5000, 10000, 15000, 20000, 30000];
  const paymentTypes = ["Loan Payment", "Savings Deposit"];

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setShowDropdown(false);
  };

  const handlePayNow = async () => {
    if (!amount || parseInt(amount) < 5000) {
      Alert.alert("Error", "Please enter a valid amount (minimum 5000)");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep(2);
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSentMoney = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert("Error", "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const formatAmount = (value: string): string => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const renderDropdownModal = () => (
    <Modal
      visible={showDropdown}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowDropdown(false)}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={() => setShowDropdown(false)}
      >
        <View style={styles.dropdownModal}>
          {paymentTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.dropdownItem,
                selectedType === type && styles.selectedDropdownItem,
              ]}
              onPress={() => handleTypeSelect(type)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedType === type && styles.selectedDropdownItemText,
                ]}
              >
                {type}
              </Text>
              {selectedType === type && (
                <Ionicons name="checkmark" size={20} color="#2F4F2F" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderTransferGateway = () => (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDropdown(true)}
          >
            <Text style={styles.dropdownText}>{selectedType}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="min. 5000"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.quickAmountContainer}>
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickAmountButton}
              onPress={() => handleQuickAmount(quickAmount)}
            >
              <Text style={styles.quickAmountText}>
                +{formatAmount(quickAmount.toString())}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.buttonDisabled]}
          onPress={handlePayNow}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? "Processing..." : "Pay Now"}
          </Text>
        </TouchableOpacity>

        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Payment Steps</Text>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>Step 1</Text>
            <Text style={styles.stepText}>
              Enter the amount you want to deposit and click the "Pay Now"
              button.
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>Step 2</Text>
            <Text style={styles.stepText}>
              You will be given a temporary transfer account (expires after 30
              mins).
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>Step 3</Text>
            <Text style={styles.stepText}>
              Transfer money to the account via your online banking or USSD.
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>Step 4</Text>
            <Text style={styles.stepText}>
              Check your transaction history in Saggers. Bank transfers
              generally credit within 10 minutes. If the deposit doesn't credit
              within 24 hours, please contact your bank.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderPaymentDetails = () => (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.paymentCard}>
          <Text style={styles.cardLabel}>BANK NAME</Text>
          <Text style={styles.cardValue}>Sappers UBA Current Account</Text>

          <Text style={styles.cardLabel}>ACCOUNT NUMBER</Text>
          <View style={styles.accountRow}>
            <Text style={styles.cardValue}>098383837737</Text>
            <TouchableOpacity style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardLabel}>AMOUNT</Text>
          <Text style={styles.cardValue}>₦{formatAmount(amount)}</Text>

          <Text style={styles.cardLabel}>TYPE</Text>
          <Text style={styles.cardValue}>{selectedType}</Text>
        </View>

        <Text style={styles.expiryText}>
          This account is for this transaction only and expires in 20:00
        </Text>

        <TouchableOpacity
          style={[styles.sentButton, loading && styles.buttonDisabled]}
          onPress={handleSentMoney}
          disabled={loading}
        >
          <Text style={styles.sentButtonText}>
            {loading ? "Verifying..." : "I've sent the money."}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setCurrentStep(1)}
        >
          <Text style={styles.cancelButtonText}>✕ Cancel Payment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSuccessModal = () => (
    <Modal visible={showSuccessModal} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={40} color="white" />
          </View>
          <Text style={styles.successTitle}>SUCCESS</Text>
          <Text style={styles.successMessage}>
            {selectedType === "Loan Payment"
              ? "Loan payment"
              : "Savings deposit"}{" "}
            received
          </Text>
          <TouchableOpacity style={styles.okButton} onPress={handleSuccessOk}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentStep === 1 ? renderTransferGateway() : renderPaymentDetails()}
      {renderSuccessModal()}
      {renderDropdownModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dropdownModal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    minWidth: 250,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedDropdownItem: {
    backgroundColor: "#f8f9fa",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  selectedDropdownItemText: {
    color: "#2F4F2F",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  quickAmountContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },
  quickAmountButton: {
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickAmountText: {
    fontSize: 14,
    color: "#666",
  },
  payButton: {
    backgroundColor: "#2F4F2F",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  stepsContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  step: {
    marginBottom: 16,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: "#e8e8e8",
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 16,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  copyButton: {
    padding: 4,
  },
  expiryText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  sentButton: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  sentButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    minWidth: 280,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  okButton: {
    backgroundColor: "#2F4F2F",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentFlow;
