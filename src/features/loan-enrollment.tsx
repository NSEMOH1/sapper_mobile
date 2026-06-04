import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { X, ArrowLeft, Upload, CheckCircle } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LoanEnrollmentFlowProps } from "@/types";
import { OtpInput } from "react-native-otp-entry";
import { useSavingsBalance } from "@/hooks/useSavings";
import { useAuthStore } from "@/hooks/useAuth";
import SuccessScreen from "@/components/Success";
import { useBalances } from "@/hooks/useBalances";
import { applyForLoan, verifyLoanOTP } from "@/services/api.service";
import { useMember } from "@/hooks/useMember";
import { useTheme } from "@/hooks/use-theme";

interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

interface UploadedFiles {
  recommendation: UploadedFile | null;
  nonIndebtedness: UploadedFile | null;
  application: UploadedFile | null;
  personnelId: UploadedFile | null;
}

const LoanEnrollmentFlow: React.FC<LoanEnrollmentFlowProps> = ({
  visible,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [servicingLoan, setServicingLoan] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [category, setCategory] = useState("REGULAR");
  const { colors, isDark } = useTheme();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    recommendation: null,
    nonIndebtedness: null,
    application: null,
    personnelId: null,
  });
  const [otp, setOtp] = useState("");
  const [loanId, setLoanId] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: savingsBalance } = useSavingsBalance();
  const balance = useBalances();
  const { user } = useAuthStore();

  const { data: member, isLoading } = useMember(user?.id);

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

  const interestRate = getInterestRate(tenure);
  const loanAmount = parseFloat(amount) || 0;
  const interestAmount = (loanAmount * interestRate) / 100;
  const totalAmount = loanAmount + interestAmount;
  const monthlyPayment = totalAmount / parseInt(tenure);

  const handleFileUpload = async (fileType: keyof UploadedFiles) => {
    try {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      Alert.alert(
        "Choose Upload Method",
        "How would you like to upload the document?",
        [
          {
            text: "Take Photo",
            onPress: () => takePhoto(fileType),
          },
          {
            text: "Choose from Gallery",
            onPress: () => pickImage(fileType),
          },
          {
            text: "Choose Document",
            onPress: () => pickDocument(fileType),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert("Error", "Failed to request permissions");
    }
  };

  const takePhoto = async (fileType: keyof UploadedFiles) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            uri: asset.uri,
            name: `${fileType}_${Date.now()}.jpg`,
            type: "image/jpeg",
            size: asset.fileSize,
          },
        }));
        Alert.alert("Success", "Photo captured successfully");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickImage = async (fileType: keyof UploadedFiles) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            uri: asset.uri,
            name: asset.fileName || `${fileType}_${Date.now()}.jpg`,
            type: "image/jpeg",
            size: asset.fileSize,
          },
        }));
        Alert.alert("Success", "Image selected successfully");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const pickDocument = async (fileType: keyof UploadedFiles) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: {
            uri: asset.uri,
            name: asset.name,
            type: asset.mimeType || "application/pdf",
            size: asset.size,
          },
        }));
        Alert.alert("Success", "Document selected successfully");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select document");
    }
  };

  const validateStep1 = (): boolean => {
    return !!servicingLoan;
  };

  const validateStep2 = (): boolean => {
    return !!(
      uploadedFiles.recommendation &&
      uploadedFiles.nonIndebtedness &&
      uploadedFiles.application
    );
  };

  const validateStep3 = (): boolean => {
    return !!(amount && !isNaN(loanAmount) && loanAmount > 0);
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
        errorMessage = "Please enter valid loan amount";
        break;
      case 4:
        submitLoanApplication();
        return;
      default:
        canProceed = true;
    }

    if (!canProceed) {
      Alert.alert("Error", errorMessage);
      return;
    }
    setStep(step + 1);
  };

  const createFormData = () => {
    try {
      const formData = new FormData();

      const loanAmountValue = parseFloat(amount);
      const tenureValue = parseInt(tenure);

      const payload = {
        category: category,
        amount: loanAmountValue,
        durationMonths: tenureValue,
        servicingLoan: servicingLoan,
      };

      console.log("Payload:", payload);
      formData.append("data", JSON.stringify(payload));

      if (uploadedFiles.recommendation) {
        console.log("Adding recommendation file");
        formData.append("recommendation", {
          uri: uploadedFiles.recommendation.uri,
          type: uploadedFiles.recommendation.type,
          name: uploadedFiles.recommendation.name,
        } as any);
      }

      if (uploadedFiles.nonIndebtedness) {
        console.log("Adding nonIndebtedness file");
        formData.append("nonIndebtedness", {
          uri: uploadedFiles.nonIndebtedness.uri,
          type: uploadedFiles.nonIndebtedness.type,
          name: uploadedFiles.nonIndebtedness.name,
        } as any);
      }

      if (uploadedFiles.application) {
        console.log("Adding application file");
        formData.append("application", {
          uri: uploadedFiles.application.uri,
          type: uploadedFiles.application.type,
          name: uploadedFiles.application.name,
        } as any);
      }

      return formData;
    } catch (error) {
      console.error("Error creating FormData:", error);
      throw new Error("Failed to prepare loan application data");
    }
  };

  const submitLoanApplication = async () => {
    setLoading(true);
    try {
      const formData = createFormData();
      const response = await applyForLoan(formData);

      if (response.success) {
        setLoanId(response.loan.id);
        console.log("otp", response.otp);
        Alert.alert("Success", response.message);
        setStep(5);
      }
    } catch (error: any) {
      console.error("Error submitting loan:", error);

      const statusCode = error?.response?.status;
      const serverData = error?.response?.data;

      console.log("Status:", statusCode);
      console.log("Response data:", JSON.stringify(serverData, null, 2));

      let errorMessage = "Failed to submit loan application. Please try again.";

      if (!error?.response) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (statusCode === 500) {
        errorMessage =
          "Something went wrong on our end. This may be because:\n\n" +
          "• You already have an active or pending loan\n" +
          "• The loan category is inactive\n" +
          "• Your session has expired — try logging out and back in";
      } else if (statusCode === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (statusCode === 400) {
        errorMessage =
          serverData?.message ||
          serverData?.error ||
          "Invalid loan application. Please check your details.";
      }

      Alert.alert("Application Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert("Error", "Please enter complete OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await verifyLoanOTP(loanId, otp);

      if (response.success) {
        onClose();
        setShowSuccess(true);
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const resetFlow = () => {
    setStep(1);
    setAmount("");
    setServicingLoan("");
    setTenure("");
    setCategory("");
    setUploadedFiles({
      recommendation: null,
      nonIndebtedness: null,
      application: null,
      personnelId: null,
    });
    setOtp("");
    setLoanId("");
    setShowSuccess(false);
    onClose();
  };

  const tenureOptions = [
    { value: "6", label: "6 months", disabled: true },
    { value: "9", label: "9 months", disabled: true },
    { value: "12", label: "12 months", disabled: false },
    { value: "24", label: "24 months", disabled: false },
  ];

  const renderFileUploadBox = (
    fileType: keyof UploadedFiles,
    title: string
  ) => {
    const file = uploadedFiles[fileType];
    const isUploaded = !!file;

    return (
      <TouchableOpacity
        style={[
          styles.uploadBox,
          { borderColor: isUploaded ? colors.success : colors.border, backgroundColor: isUploaded ? (isDark ? '#1A2E1A' : '#f8fff8') : 'transparent' },
        ]}
        onPress={() => handleFileUpload(fileType)}
      >
        {isUploaded ? (
          <CheckCircle size={24} color={colors.success} />
        ) : (
          <Upload size={24} color={colors.textSecondary} />
        )}
        <Text style={[styles.uploadTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
          {isUploaded ? file.name : "Tap to upload"}
        </Text>
        {isUploaded && file.size && (
          <Text style={{ color: colors.textSecondary }}>{(file.size / 1024 / 1024).toFixed(2)} MB</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent statusBarTranslucent={true}>
        <View style={[styles.modalContainer, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {step === 1 && (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Loan Application Form</Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Are you currently servicing a loan? *
                  </Text>
                  <View style={styles.radioGroup}>
                    <TouchableOpacity
                      style={[
                        styles.radioButton,
                        { borderColor: colors.border },
                        servicingLoan === "yes" && { borderColor: colors.primary, backgroundColor: colors.primary },
                      ]}
                      onPress={() => setServicingLoan("yes")}
                    >
                      <Text
                        style={[
                          styles.radioText,
                          { color: colors.text },
                          servicingLoan === "yes" && { color: colors.onPrimary },
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.radioButton,
                        { borderColor: colors.border },
                        servicingLoan === "no" && { borderColor: colors.primary, backgroundColor: colors.primary },
                      ]}
                      onPress={() => setServicingLoan("no")}
                    >
                      <Text
                        style={[
                          styles.radioText,
                          { color: colors.text },
                          servicingLoan === "no" && { color: colors.onPrimary },
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Total Savings (₦)</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
                    value={`₦${balance.data?.savings_balance || 0}`}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Monthly Deduction (₦)</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
                    value={`₦${savingsBalance?.monthlyDeduction || 0}`}
                    editable={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Authorized Signature</Text>
                  <View style={[styles.signatureContainer, { borderColor: colors.border }]}>
                    <Text style={[styles.signatureText, { color: colors.text }]}>
                      {member?.user.first_name} {member?.user?.last_name}
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
                      <Text style={[styles.changeSignatureText, { color: colors.primary }]}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={[styles.sectionSubTitle, { color: colors.text }]}>Bank Details</Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Bank Name *</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
                    value={member?.user?.bank[0]?.name || ""}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Account Number *</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
                    value={member?.user?.bank?.[0]?.account_number || ""}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Account Name *</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
                    value={member?.user?.bank?.[0]?.account_name || ""}
                    editable={false}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleProceed}
                >
                  <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>Proceed</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {step === 2 && (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload Documents</Text>
                <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
                  Upload clear photos or PDFs of the required documents
                </Text>

                <View style={styles.uploadSection}>
                  {renderFileUploadBox(
                    "recommendation",
                    "FMN/Unit Commander Recommendation"
                  )}
                  {renderFileUploadBox(
                    "nonIndebtedness",
                    "Letter of Non-Indebtedness"
                  )}
                  {renderFileUploadBox("application", "Self Written Application")}
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleProceed}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.onPrimary} />
                  ) : (
                    <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>Continue</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}

            {step === 3 && (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Loan Details</Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Loan Amount (₦)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                    keyboardType="numeric"
                    placeholder="Enter amount"
                    placeholderTextColor={colors.textSecondary}
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Rank</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                    value={member?.user.rank}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Interest Rate</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
                    value={`${interestRate}%`}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Tenure (months)</Text>
                  <View style={styles.tenureOptions}>
                    {tenureOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.tenureButton,
                          { borderColor: colors.border },
                          tenure === option.value && { borderColor: colors.primary, backgroundColor: colors.primary },
                          option.disabled && { borderColor: colors.borderLight, backgroundColor: colors.inputBackground, opacity: 0.6 },
                        ]}
                        onPress={() =>
                          !option.disabled && setTenure(option.value)
                        }
                        disabled={option.disabled}
                      >
                        <Text
                          style={[
                            styles.tenureText,
                            { color: colors.text },
                            tenure === option.value && { color: colors.onPrimary },
                            option.disabled && { color: colors.textSecondary },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Monthly Repayment (₦)</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
                    value={
                      isNaN(monthlyPayment)
                        ? "0"
                        : monthlyPayment.toLocaleString()
                    }
                    editable={false}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleProceed}
                >
                  <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>Proceed</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {step === 4 && (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Loan Summary</Text>

                <View style={[styles.previewBox, { borderColor: colors.border }]}>
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Applicant:</Text>
                    <Text style={[styles.previewValue, { color: colors.text }]}>
                      {member?.user.first_name} {member?.user.last_name}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Loan Amount:</Text>
                    <Text style={[styles.previewValue, { color: colors.text }]}>
                      ₦{loanAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Tenure:</Text>
                    <Text style={[styles.previewValue, { color: colors.text }]}>{tenure} months</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Interest Rate:</Text>
                    <Text style={[styles.previewValue, { color: colors.text }]}>{interestRate}%</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Total Interest:</Text>
                    <Text style={[styles.previewValue, { color: colors.text }]}>
                      ₦{interestAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Total Payable:</Text>
                    <Text style={[styles.previewValue, styles.totalValue, { color: colors.primary }]}>
                      ₦{totalAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Monthly Payment:</Text>
                    <Text style={[styles.previewValue, { color: colors.text }]}>
                      ₦{monthlyPayment.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Bank Details:</Text>
                    <Text style={[styles.previewValue, { color: colors.text }]}>
                      {member?.user.bank[0].name} -{" "}
                      {member?.user.bank[0].account_number}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.noteText, { color: colors.textSecondary }]}>
                  By proceeding, you agree to our terms and conditions. The loan
                  will be disbursed to your registered account.
                </Text>

                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleProceed}
                  disabled={loading}
                >
                  <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>
                    {loading ? "Please wait..." : "Confirm & Proceed"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {step === 5 && (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>OTP Verification</Text>
                <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
                  Enter the 6-digit OTP sent to your phone number
                </Text>

                <View style={styles.otpContainer}>
                  <OtpInput
                    numberOfDigits={6}
                    onTextChange={setOtp}
                    placeholder="******"
                    blurOnFilled={true}
                    disabled={loading}
                    type="numeric"
                    focusStickBlinkingDuration={500}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.onPrimary} />
                  ) : (
                    <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>Verify OTP</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}

          </View>
        </View>
      </Modal>

      <SuccessScreen
        visible={showSuccess}
        message="Dear Customer, Your loan request will be disbursed in 72 hours"
        onClose={resetFlow}
      />
    </>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
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
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  sectionSubTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 15,
    fontFamily: "Poppins_400Regular",
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  disabledInput: {},
  radioGroup: {
    flexDirection: "row",
    gap: 15,
  },
  radioButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  radioText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  signatureContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signatureText: {
    fontSize: 16,
    fontStyle: "italic",
    fontFamily: "Poppins_400Regular",
  },
  changeSignatureButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  changeSignatureText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  uploadSection: {
    marginBottom: 30,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    minHeight: 100,
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Poppins_400Regular",
  },
  uploadSubtitle: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  tenureOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tenureButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    minWidth: 100,
    alignItems: "center",
  },
  tenureText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  previewBox: {
    borderWidth: 1,
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
    fontFamily: "Poppins_400Regular",
  },
  previewValue: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  totalValue: {
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  noteText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 18,
    fontFamily: "Poppins_400Regular",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  primaryButton: {
    borderRadius: 8,
    padding: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
});

export default LoanEnrollmentFlow;
