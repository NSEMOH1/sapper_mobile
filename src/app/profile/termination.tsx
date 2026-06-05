import api from "@/constants/api";
import { useSavingsBalance } from "@/hooks/useSavings";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Termination() {
  const { colors } = useTheme();
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { data: balance } = useSavingsBalance();

  const handleTerminate = () => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please enter a reason for termination");
      return;
    }
    setShowModal(true);
  };

  const payload = {
    reason,
  };

  const handleProceed = async () => {
    setShowModal(false);
    try {
      await api.post("/api/termination", payload);
      Alert.alert(
        "Success",
        "Your account termination request has been submitted"
      );
      router.push("/(tabs)/profile")
    } catch (e: any) {
      console.error(e);
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Request failed. Please try again.";
      Alert.alert("Error", msg);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Terminate Account</Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Reason for Termination</Text>
        <TextInput
          style={[styles.input, { height: 100, backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={reason}
          onChangeText={setReason}
          placeholder="Enter reason"
          placeholderTextColor={colors.textSecondary}
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.error }]}
        onPress={handleTerminate}
      >
        <Text style={[styles.buttonText, { color: colors.onError }]}>Terminate Account</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={[modalStyles.overlay, { backgroundColor: colors.overlay }]}>
          <View style={[modalStyles.modalContainer, { backgroundColor: colors.card }]}>
            <View style={modalStyles.iconContainer}>
              <View style={[modalStyles.warningIcon, { borderColor: colors.error, backgroundColor: colors.card }]}>
                <Text style={[modalStyles.exclamationMark, { color: colors.error }]}>!</Text>
              </View>
            </View>

            <Text style={[modalStyles.title, { color: colors.text }]}>Account Balance Remaining</Text>

            <Text style={[modalStyles.description, { color: colors.textSecondary }]}>
              You still have a total of{" "}
              <Text style={[modalStyles.amount, { color: colors.text }]}>
                ₦ {balance?.cooperativeSavings.toString()}
              </Text>
              {"\n"}in your Cooperative account.
            </Text>

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.proceedButton, { backgroundColor: colors.error }]}
                onPress={handleProceed}
              >
                <Text style={[modalStyles.proceedButtonText, { color: colors.onError }]}>Proceed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.cancelButton, { borderColor: colors.border }]}
                onPress={handleCancel}
              >
                <Text style={[modalStyles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: 'Poppins_400Regular',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
  },
  iconContainer: {
    marginBottom: 20,
  },
  warningIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  exclamationMark: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: 'Poppins_400Regular',
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: 'Poppins_400Regular',
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  amount: {
    fontWeight: "600",
    fontFamily: 'Poppins_400Regular',
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  proceedButton: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: 'Poppins_400Regular',
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: 'Poppins_400Regular',
  },
});
