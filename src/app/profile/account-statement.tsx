import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { useTheme } from "@/hooks/use-theme";

const AccountStatement = () => {
  const { colors } = useTheme();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedType, setSelectedType] = useState("loans");
  const [showDropdown, setShowDropdown] = useState(false);

  const statementTypes = [
    { label: "Loans", value: "loans" },
    { label: "Savings", value: "savings" },
  ];

  const handleSubmit = () => {
    if (!fromDate || !toDate) {
      Alert.alert("Error", "Please select both from and to dates");
      return;
    }

    console.log("Account Statement Request:", {
      fromDate,
      toDate,
      selectedType,
    });
    Alert.alert(
      "Success",
      "Account statement will be generated and sent to your email"
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Account Statement</Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>From Date</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={fromDate}
          onChangeText={setFromDate}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>To Date</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={toDate}
          onChangeText={setToDate}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Statement Type</Text>
        <TouchableOpacity
          style={[styles.dropdown, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={[styles.dropdownText, { color: colors.text }]}>
            {statementTypes.find((type) => type.value === selectedType)?.label}
          </Text>
          <Text style={[styles.dropdownArrow, { color: colors.textSecondary }]}>▼</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Generate Statement</Text>
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={[styles.dropdownModal, { backgroundColor: colors.card }]}>
            {statementTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[styles.dropdownItem, { borderBottomColor: colors.borderLight }]}
                onPress={() => {
                  setSelectedType(type.value);
                  setShowDropdown(false);
                }}
              >
                <Text style={[styles.dropdownItemText, { color: colors.text }]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default AccountStatement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  dropdownArrow: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    borderRadius: 8,
    padding: 10,
    minWidth: 200,
    maxWidth: 300,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
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
    fontFamily: "Poppins_400Regular",
  },
});
