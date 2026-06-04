import { useAuthStore } from "@/hooks/useAuth";
import { useMember } from "@/hooks/useMember";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    bank_name: "",
    account_number: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuthStore();

  const { data: member } = useMember(user?.id);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      setErrorMessage("First name is required");
      return false;
    }

    if (!formData.last_name.trim()) {
      setErrorMessage("Last name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    if (formData.phone.trim() && !/^\d+$/.test(formData.phone.trim())) {
      setErrorMessage("Phone number should contain only digits");
      return false;
    }

    if (
      formData.account_number.trim() &&
      !/^\d+$/.test(formData.account_number.trim())
    ) {
      setErrorMessage("Account number should contain only digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const updatePayload: Record<string, string> = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
      };

      if (formData.phone.trim()) {
        updatePayload.phone = formData.phone.trim();
      }

      if (formData.address.trim()) {
        updatePayload.address = formData.address.trim();
      }
      if (formData.bank_name.trim() || formData.account_number.trim()) {
        console.log("Bank details to update:", {
          bank_name: formData.bank_name,
          account_number: formData.account_number,
        });
      }

      if (user?.id) {
        logout();
        router.push("/auth/login");
      }

    //   const response = await updateMember(updatePayload);

      Alert.alert("Success", "Profile updated successfully", [{
        text: "OK",
        onPress: () => router.push("/(tabs)"),
      },
      ]);
    } catch (error: any) {
      console.error("Update error:", error);

      let errorMsg = "Update failed. Please try again.";

      if (error.response) {
        if (error.response.status === 400) {
          errorMsg = error.response.data?.message || "Invalid data provided";
        } else if (error.response.status === 401) {
          errorMsg = "Session expired. Please login again.";
          router.push("/auth/login");
        } else if (error.response.status === 404) {
          errorMsg = "User not found";
        } else if (error.response.data?.error) {
          errorMsg = error.response.data.error;
        }
      } else if (error.request) {
        errorMsg = "Network error. Please check your connection.";
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {errorMessage ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.error + '15', borderColor: colors.error }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={[styles.formSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.borderLight }]}>Personal Information</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>First Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={formData.first_name}
              onChangeText={(text) => updateFormData("first_name", text)}
              placeholder={member?.user?.first_name}
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Last Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={formData.last_name}
              onChangeText={(text) => updateFormData("last_name", text)}
              placeholder={member?.user?.last_name}
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text)}
              placeholder={member?.user?.email}
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={formData.phone}
              onChangeText={(text) => updateFormData("phone", text)}
              placeholder={member?.user?.phone}
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              maxLength={15}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={formData.address}
              onChangeText={(text) => updateFormData("address", text)}
              placeholder={member?.user?.address}
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>
        </View>

        <View style={[styles.formSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.borderLight }]}>Bank Details (Optional)</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Bank Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={formData.bank_name}
              onChangeText={(text) => updateFormData("bank_name", text)}
              placeholder={member?.user?.bank[0]?.name}
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Account Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              value={formData.account_number}
              onChangeText={(text) => updateFormData("account_number", text)}
              placeholder={member?.user?.bank[0]?.account_number}
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              maxLength={20}
              editable={!loading}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Update Profile</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.border }]}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
  },
  formSection: {
    marginBottom: 30,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: "Poppins_600SemiBold",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  button: {
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
  cancelButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },
});
