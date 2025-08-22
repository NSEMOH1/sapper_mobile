import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";

export default function Termination() {
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleTerminate = () => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please enter a reason for termination");
      return;
    }
    setShowModal(true);
  };

  const handleProceed = () => {
    console.log("Account Termination Proceeded:", reason);
    setShowModal(false);
    // API call here for termination
    Alert.alert(
      "Success",
      "Your account termination request has been submitted"
    );
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Terminate Account</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Reason for Termination</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={reason}
          onChangeText={setReason}
          placeholder="Enter reason"
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={handleTerminate}
      >
        <Text style={styles.buttonText}>Terminate Account</Text>
      </TouchableOpacity>

      {/* Termination Confirmation Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>
            {/* Warning Icon */}
            <View style={modalStyles.iconContainer}>
              <View style={modalStyles.warningIcon}>
                <Text style={modalStyles.exclamationMark}>!</Text>
              </View>
            </View>

            {/* Modal Content */}
            <Text style={modalStyles.title}>Account Balance Remaining</Text>

            <Text style={modalStyles.description}>
              You still have a total of{" "}
              <Text style={modalStyles.amount}>₦ 5,000,000</Text>
              {"\n"}in your Cooperative account.
            </Text>

            {/* Action Buttons */}
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={modalStyles.proceedButton}
                onPress={handleProceed}
              >
                <Text style={modalStyles.proceedButtonText}>Proceed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={modalStyles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={modalStyles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
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
    borderColor: "#E57373",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  exclamationMark: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E57373",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  amount: {
    fontWeight: "600",
    color: "#333",
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  proceedButton: {
    backgroundColor: "#E57373",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
