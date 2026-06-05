import api from "@/constants/api";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Refund() {
  const { colors } = useTheme();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const payload = {
    amount,
    reason,
  };

  const handleSubmit = async () => {
    try {
      await api.post("/api/requests", payload);
      Alert.alert("Success", "Your request has been submitted");
      router.push("/(tabs)/profile");
    } catch (e: any) {
      console.error(e);
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Request failed. Please try again.";
      Alert.alert("Error", msg);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Request Refund</Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Reason</Text>
        <TextInput
          style={[styles.input, { height: 100, backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={reason}
          onChangeText={setReason}
          placeholder="Enter reason"
          placeholderTextColor={colors.textSecondary}
          multiline
        />
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Submit Request</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 20, fontFamily: 'Poppins_400Regular' },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, fontFamily: 'Poppins_400Regular' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "600", fontFamily: 'Poppins_400Regular' },
});
