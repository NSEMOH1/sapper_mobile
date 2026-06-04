import {
    ForgotPasswordFlowProps,
    ForgotPasswordFormData,
    ForgotPasswordFormErrors,
} from "@/types";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
    otp: "",
    securityAnswer: "",
    transactionPin: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { colors } = useTheme();

  const securityQuestion: string = "What is your mother's maiden name?";

  const updateFormData = (
    field: keyof ForgotPasswordFormData,
    value: string
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ForgotPasswordFormErrors = {};

    switch (step) {
      case 1:
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        break;

      case 2:
        if (!formData.otp.trim()) {
          newErrors.otp = "OTP is required";
        } else if (formData.otp.length !== 6) {
          newErrors.otp = "OTP must be 6 digits";
        }
        break;

      case 3:
        if (!formData.securityAnswer.trim()) {
          newErrors.securityAnswer = "Security answer is required";
        }
        break;

      case 4:
        if (!formData.transactionPin.trim()) {
          newErrors.transactionPin = "Transaction PIN is required";
        } else if (formData.transactionPin.length !== 4) {
          newErrors.transactionPin = "PIN must be 4 digits";
        }
        break;

      case 5:
        if (!formData.newPassword.trim()) {
          newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 6) {
          newErrors.newPassword = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (): Promise<void> => {
    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      switch (currentStep) {
        case 1:
          console.log("Sending OTP to:", formData.email);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;

        case 2:
          console.log("Verifying OTP:", formData.otp);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;

        case 3:
          console.log("Verifying security answer:", formData.securityAnswer);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;

        case 4:
          console.log("Verifying transaction PIN:", formData.transactionPin);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;

        case 5:
          console.log("Resetting password");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;
      }

      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResendOTP = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log("Resending OTP to:", formData.email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("Success", "OTP has been resent to your email");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const renderLogo = (): React.JSX.Element => (
    <View style={styles.logoContainer}>
      <Image
        source={require("@/assets/images/sappper-logo.png")}
        style={styles.logo}
      />
    </View>
  );

  const renderStepContent = (): React.JSX.Element => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={[styles.title, { color: colors.text }]}>Enter Your Email</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              We'll send an OTP to verify your identity
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.email && styles.inputError]}
              placeholder="Enter your email address"
              placeholderTextColor={colors.textSecondary}
              value={formData.email}
              onChangeText={(text: string) => updateFormData("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {errors.email && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>
            )}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={[styles.title, { color: colors.text }]}>Enter OTP</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter the 6-digit code sent to {formData.email}
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.otpInput,
                { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
                errors.otp && styles.inputError,
              ]}
              placeholder="000000"
              placeholderTextColor={colors.textSecondary}
              value={formData.otp}
              onChangeText={(text: string) =>
                updateFormData("otp", text.replace(/\D/g, ""))
              }
              keyboardType="numeric"
              maxLength={6}
              textAlign="center"
            />
            {errors.otp && <Text style={[styles.errorText, { color: colors.error }]}>{errors.otp}</Text>}

            <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Didn't receive OTP? Resend</Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={[styles.title, { color: colors.text }]}>Security Question</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Please answer your security question
            </Text>

            <Text style={[styles.questionText, {
              color: colors.text,
              backgroundColor: colors.card,
              borderColor: colors.border,
            }]}>{securityQuestion}</Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.securityAnswer && styles.inputError]}
              placeholder="Enter your answer"
              placeholderTextColor={colors.textSecondary}
              value={formData.securityAnswer}
              onChangeText={(text: string) =>
                updateFormData("securityAnswer", text)
              }
              autoCapitalize="words"
            />
            {errors.securityAnswer && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.securityAnswer}</Text>
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={[styles.title, { color: colors.text }]}>Transaction PIN</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter your 4-digit transaction PIN
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.pinInput,
                { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
                errors.transactionPin && styles.inputError,
              ]}
              placeholder="0000"
              placeholderTextColor={colors.textSecondary}
              value={formData.transactionPin}
              onChangeText={(text: string) =>
                updateFormData("transactionPin", text.replace(/\D/g, ""))
              }
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              textAlign="center"
            />
            {errors.transactionPin && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.transactionPin}</Text>
            )}
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={[styles.title, { color: colors.text }]}>Create New Password</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter your new password</Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.newPassword && styles.inputError]}
              placeholder="New password"
              placeholderTextColor={colors.textSecondary}
              value={formData.newPassword}
              onChangeText={(text: string) =>
                updateFormData("newPassword", text)
              }
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.newPassword && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.newPassword}</Text>
            )}

            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textSecondary}
              value={formData.confirmPassword}
              onChangeText={(text: string) =>
                updateFormData("confirmPassword", text)
              }
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.confirmPassword && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirmPassword}</Text>
            )}
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            {renderLogo()}
            <Text style={[styles.successTitle, { color: colors.success }]}>
              Password Changed Successfully!
            </Text>
            <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
              Your password has been successfully reset. You can now login with
              your new password.
            </Text>

            <TouchableOpacity
              style={[styles.successButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={styles.successButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return <View />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderStepContent()}

          {currentStep < 6 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: colors.primary }, loading && { backgroundColor: colors.textSecondary }]}
                onPress={handleNext}
                disabled={loading}
              >
                <Text style={styles.nextButtonText}>
                  {loading
                    ? "Please wait..."
                    : currentStep === 5
                    ? "Reset Password"
                    : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 80,
    resizeMode: "contain",
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Poppins_400Regular",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    fontFamily: "Poppins_400Regular",
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  otpInput: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 8,
    fontFamily: "Poppins_400Regular",
  },
  pinInput: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 4,
    fontFamily: "Poppins_400Regular",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    fontFamily: "Poppins_400Regular",
  },
  errorText: {
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  linkText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
    fontFamily: "Poppins_400Regular",
  },
  buttonContainer: {
    marginTop: 30,
  },
  nextButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
  successTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Poppins_400Regular",
  },
  successSubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
    fontFamily: "Poppins_400Regular",
  },
  successButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  successButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins_400Regular",
  },
});

export default ForgotPasswordFlow;
