import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, StyleSheet, View, TouchableOpacity } from "react-native";

export default function Refund() {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    console.log("Refund Request:", { amount, reason });
    // API call here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Request Refund</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Reason</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={reason}
          onChangeText={setReason}
          placeholder="Enter reason"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#213400",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
