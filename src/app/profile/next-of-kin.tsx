import { Smile } from "lucide-react-native";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Relationship } from "@/data/auth-data";
import RNPickerSelect from "react-native-picker-select";
import { router } from "expo-router";
import api from "@/constants/api";
import { useAuthStore } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/use-theme";

export default function NextOfKin() {
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuthStore();

  const payload = {
    kinFirstName: firstName,
    kinLastName: lastName,
    kinPhone: phone,
    relationship,
  };

  const handleSubmit = async () => {
    try {
      const res = await api.put(`/api/member/${user?.id}`, payload);
      router.push("/(tabs)");
    } catch (e) {
      console.error(e);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Edit Next of Kin</Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
          value={firstName}
          onChangeText={setFirstName}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
          value={lastName}
          onChangeText={setLastName}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
          value={phone}
          onChangeText={setPhone}
          editable={false}
        />
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Submit</Text>
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
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontFamily: 'Poppins_400Regular',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    flex: 1,
    paddingVertical: 8,
    color: "#000",
  },
  inputAndroid: {
    flex: 1,
    paddingVertical: 8,
    color: "#000",
  },
});
