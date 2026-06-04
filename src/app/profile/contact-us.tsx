import React from "react";
import { 
  SafeAreaView, 
  Text, 
  StyleSheet, 
  View, 
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert
} from "react-native";
import { useTheme } from "@/hooks/use-theme";

const ContactUs = () => {
  const { colors } = useTheme();

  const handleCallUs = () => {
    Linking.openURL('tel:+2348012345678').catch((err) => {
      Alert.alert("Error", "Unable to make call");
    });
  };

  const handleWhatsApp = () => {
    const whatsappUrl = "whatsapp://send?phone=2348012345678&text=Hello, I need assistance";
    Linking.openURL(whatsappUrl).catch(() => {
      Linking.openURL('https://wa.me/2348012345678?text=Hello, I need assistance');
    });
  };

  const handleFAQ = () => {
    console.log("Navigate to FAQ screen");
  };

  const handleContinue = () => {
    console.log("Continue pressed");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, { color: colors.text }]}>Contact us</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Call or Chat with us and we will answer any question.
        </Text>

        <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.backgroundElement }]} onPress={handleCallUs}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📞</Text>
          </View>
          <Text style={[styles.contactText, { color: colors.primary }]}>Call us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.backgroundElement }]} onPress={handleWhatsApp}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💬</Text>
          </View>
          <Text style={[styles.contactText, { color: colors.primary }]}>Get on Whatsapp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.backgroundElement }]} onPress={handleFAQ}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>❓</Text>
          </View>
          <Text style={[styles.contactText, { color: colors.primary }]}>FAQ</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={[styles.continueButton, { backgroundColor: colors.primary }]} onPress={handleContinue}>
        <Text style={[styles.continueButtonText, { color: colors.onPrimary }]}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ContactUs

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 40,
    fontFamily: 'Poppins_400Regular',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: 'Poppins_400Regular',
  },
  contactButton: {
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  contactText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: 'Poppins_400Regular',
  },
  continueButton: {
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: 'Poppins_400Regular',
  },
});
