import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface FormData {
  serviceNumber: string;
  rank: string;
  corpsUnit: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  salaryAccountName: string;
  salaryAccountNumber: string;
  bankName: string;
  branch: string;
  amount: number
}

const WithdrawalApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showRankDropdown, setShowRankDropdown] = useState(false);
  const [showCorpsDropdown, setShowCorpsDropdown] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    serviceNumber: "",
    rank: "",
    corpsUnit: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    salaryAccountName: "",
    salaryAccountNumber: "",
    bankName: "",
    branch: "",
    amount: 0
  });

  const ranks = [
    "Major",
    "Captain",
    "Lieutenant",
    "Colonel",
    "Brigadier",
    "General",
  ];
  const corpsUnits = [
    "Infantry",
    "Artillery",
    "Engineers",
    "Signals",
    "Intelligence",
    "Medical",
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRankSelect = (rank: string) => {
    handleInputChange("rank", rank);
    setShowRankDropdown(false);
  };

  const handleCorpsSelect = (corps: string) => {
    handleInputChange("corpsUnit", corps);
    setShowCorpsDropdown(false);
  };

  const handleProceed = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Submit form without validation
      Alert.alert("Success", "Withdrawal application submitted successfully", [
        {
          text: "OK",
          onPress: () => {
            router.push("/savings");
          },
        },
      ]);
      console.log("Withdrawal Application Data:", formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderDropdownModal = (
    visible: boolean,
    onClose: () => void,
    items: string[],
    onSelect: (item: string) => void,
    selectedItem: string
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdownModal}>
          {items.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.dropdownItem,
                selectedItem === item && styles.selectedDropdownItem,
              ]}
              onPress={() => onSelect(item)}
              disabled={true}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedItem === item && styles.selectedDropdownItemText,
                  styles.disabledText,
                ]}
              >
                {item}
              </Text>
              {selectedItem === item && (
                <Ionicons name="checkmark" size={20} color="#ccc" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Number</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="81NA/45758"
            value={formData.serviceNumber}
            onChangeText={(value) => handleInputChange("serviceNumber", value)}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rank</Text>
          <TouchableOpacity
            style={[styles.dropdown, styles.disabledInput]}
            onPress={() => {}} // Disabled
            disabled={true}
          >
            <Text
              style={[
                styles.dropdownText,
                !formData.rank && styles.placeholderText,
                styles.disabledText,
              ]}
            >
              {formData.rank || "Select Rank"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Corps/Unit</Text>
          <TouchableOpacity
            style={[styles.dropdown, styles.disabledInput]}
            onPress={() => {}} // Disabled
            disabled={true}
          >
            <Text
              style={[
                styles.dropdownText,
                !formData.corpsUnit && styles.placeholderText,
                styles.disabledText,
              ]}
            >
              {formData.corpsUnit || "Select Corps/Unit"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="Oluyede"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange("firstName", value)}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="Olufemi"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange("lastName", value)}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="10/02/1993"
            value={formData.dateOfBirth}
            onChangeText={(value) => handleInputChange("dateOfBirth", value)}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="07033450714"
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange("phoneNumber", value)}
            editable={false}
          />
        </View>

        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>Proceed</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.formContainer}>
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Verify your account details. If you notice an anomaly, contact Admin
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Salary Account Name</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="Oluyede Olufemi"
            value={formData.salaryAccountName}
            onChangeText={(value) =>
              handleInputChange("salaryAccountName", value)
            }
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Salary Account Number</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="0051717189"
            keyboardType="numeric"
            value={formData.salaryAccountNumber}
            onChangeText={(value) =>
              handleInputChange("salaryAccountNumber", value)
            }
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bank Name</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="Access Bank"
            value={formData.bankName}
            onChangeText={(value) => handleInputChange("bankName", value)}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Branch</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="Island"
            value={formData.branch}
            onChangeText={(value) => handleInputChange("branch", value)}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.branch}
            onChangeText={(value) => handleInputChange("amount", value)}
          />
        </View>

        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>Submit Application</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/chief.jpg")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <View style={styles.logoCircle}>
                <Image
                  source={require("../../assets/images/sappper-logo.png")}
                />
              </View>
            </View>
          </View>

          <View style={styles.contentContainer}>
            {currentStep === 1 ? (
              <>
                <Text style={styles.subtitle}>Time to Pull Out?</Text>
                {renderStep1()}
              </>
            ) : (
              renderStep2()
            )}
          </View>

          {/* Dropdown Modals - Disabled */}
          {renderDropdownModal(
            showRankDropdown,
            () => setShowRankDropdown(false),
            ranks,
            handleRankSelect,
            formData.rank
          )}

          {renderDropdownModal(
            showCorpsDropdown,
            () => setShowCorpsDropdown(false),
            corpsUnits,
            handleCorpsSelect,
            formData.corpsUnit
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WithdrawalApplication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    marginBottom: 10,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 24,
  },
  personnelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: 20,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    paddingBottom: 30,
  },
  warningContainer: {
    backgroundColor: "#FFF3CD",
    borderColor: "#FFEAA7",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
    color: "#999",
  },
  disabledText: {
    color: "#999",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dropdownModal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    minWidth: 250,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedDropdownItem: {
    backgroundColor: "#f8f9fa",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  selectedDropdownItemText: {
    color: "#2F4F2F",
    fontWeight: "600",
  },
  proceedButton: {
    backgroundColor: "#2F4F2F",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Made full width
    marginTop: 20,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
