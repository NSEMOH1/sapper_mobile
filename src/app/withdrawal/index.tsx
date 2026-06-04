import { submitWithdrawal } from "@/services/api.service";
import { useAuthStore } from "@/hooks/useAuth";
import { useMember } from "@/hooks/useMember";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WithdrawalApplication() {
  const { colors, isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const { data: member, isLoading: isMemberLoading } = useMember(user?.id);


  if (isMemberLoading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  const payload = {
    amount: amount,
    category_name: "QUICK",
    pin: pin,
  };

  const handleWithdrawal = async () => {
    setLoading(true);
    try {
      await submitWithdrawal(payload);
      Alert.alert("Success", "Withdrawal application submitted successfully", [
        {
          text: "OK",
          onPress: () => {
            router.push("/savings");
          },
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      Alert.alert("Success", "Withdrawal application submitted successfully", [
        {
          text: "OK",
          onPress: () => {
            router.push("/savings");
          },
        },
      ]);
    }
  };

  const renderStep1 = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Service Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
            value={member?.user?.service_number}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Rank</Text>
          <TouchableOpacity
            style={[styles.dropdown, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
            onPress={() => {}}
            disabled={true}
          >
            <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>
              {member?.user.rank}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Unit</Text>
          <TouchableOpacity
            style={[styles.dropdown, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
            onPress={() => {}}
            disabled={true}
          >
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
              value={member?.user.unit}
              editable={false}
            />
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
            value={member?.user.first_name}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
            value={member?.user.last_name}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Date of Birth</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
            placeholder="10/02/1993"
            value={member?.user.date_of_birth}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
            keyboardType="phone-pad"
            value={member?.user.phone}
            editable={false}
          />
        </View>

        <TouchableOpacity style={[styles.proceedButton, { backgroundColor: colors.primary }]} onPress={handleProceed}>
          <Text style={[styles.proceedButtonText, { color: colors.onPrimary }]}>Proceed</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.formContainer}>
        <View style={[styles.warningContainer, { backgroundColor: isDark ? '#3A3A00' : '#FFF3CD', borderColor: isDark ? '#5C5C00' : '#FFEAA7' }]}>
          <Text style={[styles.warningText, { color: isDark ? '#FFEAA7' : '#856404' }]}>
            Verify your account details. If you notice an anomaly, contact Admin
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Salary Account Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
            value={member?.user.bank[0].account_name}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Salary Account Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
            keyboardType="numeric"
            value={member?.user.bank[0].account_number}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Bank Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textSecondary }]}
            value={member?.user.bank[0].name}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Pin</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
            value={pin}
            onChangeText={setPin}
          />
        </View>

        <TouchableOpacity
          style={[styles.proceedButton, { backgroundColor: colors.primary }]}
          onPress={handleWithdrawal}
          disabled={isLoading}
        >
          <Text style={[styles.proceedButtonText, { color: colors.onPrimary }]}>
            {isLoading ? "Submitting" : "Submit Application"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/chief.jpg")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(41, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <View style={[styles.logoCircle, { backgroundColor: colors.background }]}>
                <Image
                  source={require("@/assets/images/sappper-logo.png")}
                />
              </View>
            </View>
          </View>

          <View style={[styles.contentContainer, { backgroundColor: isDark ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' }]}>
            {currentStep === 1 ? (
              <>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Time to Pull Out?</Text>
                {renderStep1()}
              </>
            ) : (
              renderStep2()
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
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
    letterSpacing: 2,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
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
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 14,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
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
  },
  selectedDropdownItemText: {
    color: "#2F4F2F",
    fontWeight: "600",
  },
  proceedButton: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
