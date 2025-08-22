import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { X, Check, ArrowLeft, Upload, User } from "lucide-react-native";

interface LoanEnrollmentFlowProps {
  visible: boolean;
  onClose: () => void;
}

interface FormData {
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

interface UploadedFiles {
  recommendation: boolean;
  nonIndebtedness: boolean;
  application: boolean;
  personnelId: boolean;
}

const LoanEnrollmentFlow: React.FC<LoanEnrollmentFlowProps> = ({
  visible,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    servicingLoan: "",
    totalSavings: "150,000",
    monthlyDeduction: "25,000",
    authorizedSignature: "John Doe Signature",
    bankName: "",
    accountNumber: "",
    accountName: "",
    amount: "",
    rank: "",
    tenure: "12",
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    recommendation: false,
    nonIndebtedness: false,
    application: false,
    personnelId: true, // Already uploaded during registration
  });
  const [otp, setOtp] = useState(["", "", "", ""]);

  const getInterestRate = (selectedTenure: string): number => {
    switch (selectedTenure) {
      case "12":
        return 5;
      case "24":
        return 7;
      default:
        return 5;
    }
  };

  const interestRate = getInterestRate(formData.tenure);
  const loanAmount = parseFloat(formData.amount) || 0;
  const interestAmount =
    ((loanAmount * interestRate) / 100) * parseInt(formData.tenure);
  const totalAmount = loanAmount + interestAmount;
  const monthlyPayment = totalAmount / parseInt(formData.tenure);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (fileType: keyof UploadedFiles) => {
    setUploadedFiles((prev) => ({ ...prev, [fileType]: true }));
    Alert.alert("Success", "File uploaded successfully");
  };

  const validateStep1 = (): boolean => {
    return !!(
      formData.servicingLoan &&
      formData.bankName &&
      formData.accountNumber &&
      formData.accountName
    );
  };

  const validateStep2 = (): boolean => {
    return (
      uploadedFiles.recommendation &&
      uploadedFiles.nonIndebtedness &&
      uploadedFiles.application
    );
  };

  const validateStep3 = (): boolean => {
    return !!(
      formData.amount &&
      formData.rank &&
      !isNaN(loanAmount) &&
      loanAmount > 0
    );
  };

  const handleProceed = () => {
    let canProceed = false;
    let errorMessage = "";

    switch (step) {
      case 1:
        canProceed = validateStep1();
        errorMessage = "Please fill in all required fields";
        break;
      case 2:
        canProceed = validateStep2();
        errorMessage = "Please upload all required documents";
        break;
      case 3:
        canProceed = validateStep3();
        errorMessage = "Please enter valid loan amount and rank";
        break;
      case 4:
      case 5:
        canProceed = true;
        break;
      default:
        canProceed = true;
    }

    if (!canProceed) {
      Alert.alert("Error", errorMessage);
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = () => {
    if (step === 5 && otp.some((digit) => !digit)) {
      Alert.alert("Error", "Please enter complete OTP");
      return;
    }
    setStep(step + 1);
  };

  const resetFlow = () => {
    setStep(1);
    setFormData({
      servicingLoan: "",
      totalSavings: "150,000",
      monthlyDeduction: "25,000",
      authorizedSignature: "John Doe Signature",
      bankName: "",
      accountNumber: "",
      accountName: "",
      amount: "",
      rank: "",
      tenure: "12",
    });
    setUploadedFiles({
      recommendation: false,
      nonIndebtedness: false,
      application: false,
      personnelId: true,
    });
    setOtp(["", "", "", ""]);
    onClose();
  };

  const tenureOptions = [
    { value: "6", label: "6 months", disabled: true },
    { value: "9", label: "9 months", disabled: true },
    { value: "12", label: "12 months", disabled: false },
    { value: "24", label: "24 months", disabled: false },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            {step !== 6 && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowLeft size={24} color="#333" />
              </TouchableOpacity>
            )}
            {step !== 6 && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          {/* Step 1: Form Questions */}
          {step === 1 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Loan Application Form</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Are you currently servicing a loan?
                </Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.servicingLoan === "yes" && styles.selectedRadio,
                    ]}
                    onPress={() => handleInputChange("servicingLoan", "yes")}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.servicingLoan === "yes" &&
                          styles.selectedRadioText,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.servicingLoan === "no" && styles.selectedRadio,
                    ]}
                    onPress={() => handleInputChange("servicingLoan", "no")}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.servicingLoan === "no" &&
                          styles.selectedRadioText,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Total Savings (₦)</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={formData.totalSavings}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Monthly Deduction (₦)</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={formData.monthlyDeduction}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Authorized Signature</Text>
                <View style={styles.signatureContainer}>
                  <Text style={styles.signatureText}>
                    {formData.authorizedSignature}
                  </Text>
                  <TouchableOpacity
                    style={styles.changeSignatureButton}
                    onPress={() =>
                      Alert.alert(
                        "Info",
                        "Signature change functionality to be implemented"
                      )
                    }
                  >
                    <Text style={styles.changeSignatureText}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.sectionSubTitle}>Bank Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bank Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter bank name"
                  value={formData.bankName}
                  onChangeText={(value) => handleInputChange("bankName", value)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Number</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChangeText={(value) =>
                    handleInputChange("accountNumber", value)
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter account name"
                  value={formData.accountName}
                  onChangeText={(value) =>
                    handleInputChange("accountName", value)
                  }
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleProceed}
              >
                <Text style={styles.primaryButtonText}>Proceed</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Step 2: Document Upload */}
          {step === 2 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Upload Documents</Text>

              <View style={styles.uploadSection}>
                <TouchableOpacity
                  style={[
                    styles.uploadBox,
                    uploadedFiles.recommendation && styles.uploadedBox,
                  ]}
                  onPress={() => handleFileUpload("recommendation")}
                >
                  <Upload
                    size={24}
                    color={uploadedFiles.recommendation ? "#4CAF50" : "#666"}
                  />
                  <Text style={styles.uploadTitle}>
                    FMN/Unit Commander Recommendation
                  </Text>
                  <Text style={styles.uploadSubtitle}>
                    {uploadedFiles.recommendation
                      ? "Uploaded"
                      : "Tap to upload"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.uploadBox,
                    uploadedFiles.nonIndebtedness && styles.uploadedBox,
                  ]}
                  onPress={() => handleFileUpload("nonIndebtedness")}
                >
                  <Upload
                    size={24}
                    color={uploadedFiles.nonIndebtedness ? "#4CAF50" : "#666"}
                  />
                  <Text style={styles.uploadTitle}>
                    Letter of Non-Indebtedness from Salary Account
                  </Text>
                  <Text style={styles.uploadSubtitle}>
                    {uploadedFiles.nonIndebtedness
                      ? "Uploaded"
                      : "Tap to upload"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.uploadBox,
                    uploadedFiles.application && styles.uploadedBox,
                  ]}
                  onPress={() => handleFileUpload("application")}
                >
                  <Upload
                    size={24}
                    color={uploadedFiles.application ? "#4CAF50" : "#666"}
                  />
                  <Text style={styles.uploadTitle}>
                    Copy of Self Written Application
                  </Text>
                  <Text style={styles.uploadSubtitle}>
                    {uploadedFiles.application ? "Uploaded" : "Tap to upload"}
                  </Text>
                </TouchableOpacity>

                <View style={[styles.uploadBox, styles.uploadedBox]}>
                  <User size={24} color="#4CAF50" />
                  <Text style={styles.uploadTitle}>Personnel ID Card</Text>
                  <Text style={styles.uploadSubtitle}>
                    Already uploaded during registration
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleProceed}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Step 3: Loan Details */}
          {step === 3 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Loan Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Loan Amount (₦)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChangeText={(value) => handleInputChange("amount", value)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Rank</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your rank"
                  value={formData.rank}
                  onChangeText={(value) => handleInputChange("rank", value)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Interest Rate</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={`${interestRate}%`}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tenure (months)</Text>
                <View style={styles.tenureOptions}>
                  {tenureOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.tenureButton,
                        formData.tenure === option.value &&
                          styles.selectedTenure,
                        option.disabled && styles.disabledTenure,
                      ]}
                      onPress={() =>
                        !option.disabled &&
                        handleInputChange("tenure", option.value)
                      }
                      disabled={option.disabled}
                    >
                      <Text
                        style={[
                          formData.tenure === option.value
                            ? styles.selectedTenureText
                            : styles.tenureText,
                          option.disabled && styles.disabledTenureText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Monthly Repayment (₦)</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={
                    isNaN(monthlyPayment)
                      ? "0"
                      : monthlyPayment.toLocaleString()
                  }
                  editable={false}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleProceed}
              >
                <Text style={styles.primaryButtonText}>Proceed</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Step 4: Loan Summary */}
          {step === 4 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>Loan Summary</Text>

              <View style={styles.previewBox}>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Applicant:</Text>
                  <Text style={styles.previewValue}>{formData.rank}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Loan Amount:</Text>
                  <Text style={styles.previewValue}>
                    ₦{loanAmount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Tenure:</Text>
                  <Text style={styles.previewValue}>
                    {formData.tenure} months
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Interest Rate:</Text>
                  <Text style={styles.previewValue}>{interestRate}%</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Total Interest:</Text>
                  <Text style={styles.previewValue}>
                    ₦{interestAmount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Total Payable:</Text>
                  <Text style={[styles.previewValue, styles.totalValue]}>
                    ₦{totalAmount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Monthly Payment:</Text>
                  <Text style={styles.previewValue}>
                    ₦{monthlyPayment.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Bank Details:</Text>
                  <Text style={styles.previewValue}>{formData.bankName}</Text>
                </View>
              </View>

              <Text style={styles.noteText}>
                By proceeding, you agree to our terms and conditions. The loan
                will be disbursed to your registered account.
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleProceed}
              >
                <Text style={styles.primaryButtonText}>Confirm & Proceed</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Step 5: OTP Verification */}
          {step === 5 && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionTitle}>OTP Verification</Text>
              <Text style={styles.subTitle}>
                Enter the 4-digit OTP sent to your phone number
              </Text>

              <View style={styles.otpContainer}>
                {[0, 1, 2, 3].map((index) => (
                  <TextInput
                    key={index}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.resendButton}>
                <Text style={styles.resendText}>
                  Didn't receive code? Resend
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSubmit}
                disabled={otp.some((digit) => !digit)}
              >
                <Text style={styles.primaryButtonText}>Verify OTP</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Step 6: Success */}
          {step === 6 && (
            <View style={styles.successContent}>
              <View style={styles.successIcon}>
                <Check size={48} color="#4CAF50" />
              </View>
              <Text style={styles.successTitle}>Success!</Text>
              <Text style={styles.successMessage}>
                Dear Customer, Your loan request will be disbursed in 72 hours
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={resetFlow}
              >
                <Text style={styles.primaryButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  closeButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  sectionSubTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#888",
  },
  radioGroup: {
    flexDirection: "row",
    gap: 15,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  selectedRadio: {
    borderColor: "#6A7814",
    backgroundColor: "#6A7814",
  },
  radioText: {
    color: "#333",
    fontSize: 14,
  },
  selectedRadioText: {
    color: "#fff",
  },
  signatureContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signatureText: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
  },
  changeSignatureButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  changeSignatureText: {
    color: "#6A7814",
    fontSize: 14,
    fontWeight: "500",
  },
  uploadSection: {
    marginBottom: 30,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    minHeight: 100,
    justifyContent: "center",
  },
  uploadedBox: {
    borderColor: "#4CAF50",
    backgroundColor: "#f8fff8",
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  tenureOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tenureButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    minWidth: 100,
    alignItems: "center",
  },
  selectedTenure: {
    borderColor: "#6A7814",
    backgroundColor: "#6A7814",
  },
  disabledTenure: {
    borderColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
  },
  tenureText: {
    textAlign: "center",
    color: "#333",
    fontSize: 14,
  },
  selectedTenureText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  disabledTenureText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },
  previewBox: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 14,
    color: "#666",
  },
  previewValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  totalValue: {
    fontWeight: "bold",
    color: "#6A7814",
  },
  noteText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 18,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
  },
  resendButton: {
    alignSelf: "center",
    marginBottom: 30,
  },
  resendText: {
    color: "#6A7814",
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#6A7814",
    borderRadius: 8,
    padding: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successContent: {
    padding: 30,
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
});

export default LoanEnrollmentFlow;
