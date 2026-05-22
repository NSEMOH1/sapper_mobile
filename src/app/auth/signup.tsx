import api from "@/constants/api";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
    Building,
    Calendar,
    ChevronLeft,
    CreditCard,
    FileText,
    Home,
    Key,
    Mail,
    MapPinCheckInside,
    MapPinHouse,
    MessageCircleQuestion,
    MessageSquare,
    Phone,
    ShieldUser,
    Smile,
    Upload,
    User,
    UsersRound,
    VenusAndMars,
    X
} from "lucide-react-native";
import React, { useState } from "react";
import {
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import { states } from "../../constants/data";
import { Gender, Ranks, Relationship, securityQuestions } from "../../data/auth-data";

interface Document {
  uri: string;
  name: string;
  type?: string;
}

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dob, setDob] = useState("");
  const [unit, setUnit] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [gender, setGender] = useState("");
  const [rank, setRank] = useState("");
  const [kinFirstName, setKinFirstName] = useState("");
  const [kinLastName, setKinLastName] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  const [kinGender, setKinGender] = useState("");
  const [kinEmail, setKinEmail] = useState("");
  const [stateOrigin, setStateOrigin] = useState("");
  const [lga, setLga] = useState("");
  const [kinAddress, setKinAddress] = useState("");
  const [relationship, setRelationship] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [serviceNumber, setServiceNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [monthlyDeduction, setMonthlyDeduction] = useState("");
  const [profilePicture, setProfilePicture] = useState<Document | null>(null);
  const [ninDocument, setNinDocument] = useState<Document | null>(null);
  const [idDocument, setIdDocument] = useState<Document | null>(null);
  const [personnelId, setPersonnelId] = useState<Document | null>(null);

  const validateCurrentStep = () => {
    if (step === 1) {
      if (subStep === 1) {
        if (
          !serviceNumber ||
          !rank ||
          !unit ||
          !firstName ||
          !lastName ||
          !gender
        ) {
          Alert.alert("Error", "Please fill in all required fields");
          return false;
        }
      } else if (subStep === 2) {
        if (!dob || !phone || !email || !address || !transactionPin) {
          Alert.alert("Error", "Please fill in all required fields");
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Alert.alert("Error", "Please enter a valid email address");
          return false;
        }
        if (phone.length < 10) {
          Alert.alert("Error", "Please enter a valid phone number");
          return false;
        }
      } else if (subStep === 3) {
        if (
          !stateOrigin ||
          !lga ||
          !bankName ||
          !accountNumber ||
          !accountName ||
          !monthlyDeduction
        ) {
          Alert.alert("Error", "Please fill in all required fields");
          return false;
        }
      }
    } else if (step === 2) {
      if (subStep === 1) {
        if (!kinFirstName || !kinLastName || !kinGender || !relationship) {
          Alert.alert(
            "Error",
            "Please fill in all next of kin basic information"
          );
          return false;
        }
      } else if (subStep === 2) {
        if (!kinPhone || !kinEmail || !kinAddress) {
          Alert.alert(
            "Error",
            "Please fill in all next of kin contact information"
          );
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(kinEmail)) {
          Alert.alert(
            "Error",
            "Please enter a valid email address for next of kin"
          );
          return false;
        }
      }
    } else if (step === 3) {
      if (!profilePicture || !ninDocument || !idDocument || !personnelId) {
        Alert.alert("Error", "Please upload all required documents");
        return false;
      }
    } else if (step === 4) {
      if (!securityQuestion || !securityAnswer) {
        Alert.alert(
          "Error",
          "Please select a security question and provide an answer"
        );
        return false;
      }
    }
    return true;
  };

  const createFormData = () => {
    const formData = new FormData();
    const payload = {
      service_number: serviceNumber,
      rank: rank,
      unit: unit,
      first_name: firstName,
      other_name: otherName,
      last_name: lastName,
      gender: gender,
      date_of_birth: new Date(dob),
      phone: phone,
      email: email,
      address: address,
      pin: transactionPin,
      state_of_origin: stateOrigin,
      lga: lga,
      account_name: accountName,
      account_number: accountNumber,
      bankName: bankName,
      monthlyDeduction: monthlyDeduction,
      kinFirstName: kinFirstName,
      kinLastName: kinLastName,
      kinGender: kinGender,
      kinPhone: kinPhone,
      kinAddress: kinAddress,
      kinEmail: kinEmail,
      relationship: relationship,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
    };

    formData.append("data", JSON.stringify(payload));
    if (profilePicture) {
      console.log("Profile Picture:", profilePicture);
      formData.append("profile_picture", {
        uri: profilePicture.uri,
        type: profilePicture.type || "image/jpeg",
        name: profilePicture.name,
      } as any);
    }

    if (ninDocument) {
      formData.append("identification", {
        uri: ninDocument.uri,
        type: ninDocument.type || "application/pdf",
        name: ninDocument.name,
      } as any);
    }

    if (idDocument) {
      formData.append("signature", {
        uri: idDocument.uri,
        type: idDocument.type || "application/pdf",
        name: idDocument.name,
      } as any);
    }

    if (personnelId) {
      formData.append("id_card", {
        uri: personnelId.uri,
        type: personnelId.type || "application/pdf",
        name: personnelId.name,
      } as any);
    }

    return formData;
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      if (!validateCurrentStep()) {
        setIsLoading(false);
        return;
      }

      const formData = createFormData();
      const response = await api.post("/api/auth/member/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });
      console.log("Registration response:", response.data);

      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
      } else {
        throw new Error(response.data?.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (step === 1 && subStep < 3) {
      setSubStep((prev) => prev + 1);
    } else if (step === 1 && subStep === 3) {
      setStep(2);
      setSubStep(1);
    } else if (step === 2 && subStep < 2) {
      setSubStep((prev) => prev + 1);
    } else if (step === 2 && subStep === 2) {
      setStep(3);
    } else if (step === 4) {
      handleRegister();
    } else {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    if (step === 1 && subStep > 1) {
      setSubStep((prev) => prev - 1);
    } else if (step === 2 && subStep > 1) {
      setSubStep((prev) => prev - 1);
    } else if (step === 2 && subStep === 1) {
      setStep(1);
      setSubStep(3);
    } else if (step === 3) {
      setStep(2);
      setSubStep(2);
    } else {
      setStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    setDob(date.toISOString().split("T")[0]);
    hideDatePicker();
  };

  const handleLogin = () => {
    router.push("/auth/login");
    setShowSuccess(false);
    setStep(1);
    setSubStep(1);
    resetForm();
  };

  const resetForm = () => {
    setServiceNumber("");
    setRank("");
    setUnit("");
    setFirstName("");
    setOtherName("");
    setLastName("");
    setGender("");
    setDob("");
    setPhone("");
    setEmail("");
    setAddress("");
    setTransactionPin("");
    setStateOrigin("");
    setLga("");
    setAccountName("");
    setAccountNumber("");
    setBankName("");
    setMonthlyDeduction("");
    setKinFirstName("");
    setKinLastName("");
    setKinGender("");
    setKinPhone("");
    setKinAddress("");
    setKinEmail("");
    setRelationship("");
    setSecurityQuestion("");
    setSecurityAnswer("");
    setProfilePicture(null);
    setNinDocument(null);
    setIdDocument(null);
    setPersonnelId(null);
  };

  const pickProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setProfilePicture({
          uri: asset.uri,
          name: asset.fileName || `profile_${Date.now()}.jpg`,
          type: asset.mimeType || "image/jpeg",
        });
        Alert.alert("Success", "Profile picture selected");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickDocument = async (
    setDocumentFunction: (doc: Document | null) => void
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setDocumentFunction({
          uri: asset.uri,
          name: asset.name || `document_${Date.now()}`,
          type: asset.mimeType || "application/pdf",
        });
        Alert.alert("Success", "Document selected");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const removeDocument = (
    setDocumentFunction: (doc: Document | null) => void
  ) => {
    setDocumentFunction(null);
  };

  const renderDocumentPreview = (
    document: Document | null,
    setDocumentFunction: (doc: Document | null) => void
  ) => {
    if (!document) return null;

    const isImage =
      document.name?.match(/\.(jpg|jpeg|png|gif)$/i) ||
      document.type?.startsWith("image/");

    return (
      <View style={styles.previewContainer}>
        <View style={styles.preview}>
          {isImage ? (
            <Image
              source={{ uri: document.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <FileText size={24} color="#666" />
          )}
          <Text style={styles.previewText} numberOfLines={1}>
            {document.name}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeDocument(setDocumentFunction)}
        >
          <X size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          source={require("@/assets/images/chief.jpg")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <View style={styles.successOverlay}>
            <View style={styles.successContainer}>
              <View style={styles.logo}>
                <Image
                  source={require("@/assets/images/sappper-logo.png")}
                  style={styles.logoImage}
                />
              </View>
              <View style={styles.successCard}>
                <Text style={styles.successTitle}>
                  Your Account Has been{"\n"}Created Successfully
                </Text>

                <View style={styles.successIconContainer}>
                  <View
                    style={[
                      styles.decorativeCircle,
                      {
                        backgroundColor: "#82B921",
                        width: 8,
                        height: 8,
                        top: 20,
                        left: 30,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.decorativeCircle,
                      {
                        backgroundColor: "#FF6B35",
                        width: 6,
                        height: 6,
                        top: 40,
                        right: 40,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.decorativeLine,
                      {
                        backgroundColor: "#FF6B35",
                        top: 60,
                        right: 20,
                        transform: [{ rotate: "45deg" }],
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.decorativeLine,
                      {
                        backgroundColor: "#FFD700",
                        bottom: 80,
                        left: 20,
                        transform: [{ rotate: "-30deg" }],
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.decorativeLine,
                      {
                        backgroundColor: "#6B73FF",
                        bottom: 40,
                        left: 40,
                        transform: [{ rotate: "60deg" }],
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.decorativeCircle,
                      {
                        backgroundColor: "#E6E6FA",
                        width: 12,
                        height: 12,
                        bottom: 60,
                        right: 30,
                        borderWidth: 1,
                        borderColor: "#DDD",
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.decorativeCircle,
                      {
                        backgroundColor: "#98FB98",
                        width: 6,
                        height: 6,
                        bottom: 20,
                        left: 60,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.decorativeCircle,
                      {
                        backgroundColor: "#FF1493",
                        width: 8,
                        height: 8,
                        bottom: 30,
                        right: 60,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.decorativeCircle,
                      {
                        backgroundColor: "transparent",
                        width: 16,
                        height: 16,
                        top: 80,
                        left: 60,
                        borderWidth: 2,
                        borderColor: "#DDD",
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.decorativeCircle,
                      {
                        backgroundColor: "transparent",
                        width: 20,
                        height: 20,
                        bottom: 100,
                        right: 50,
                        borderWidth: 2,
                        borderColor: "#E6E6FA",
                      },
                    ]}
                  />
                  <View style={styles.successIcon}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                  <Text style={styles.loginArrow}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logo}>
          <Image
            source={require("@/assets/images/sappper-logo.png")}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.form}>
          <View style={styles.stepper}>
            {[
              "Personal Info",
              "Next of Kin",
              "Upload Docs",
              "Security Question",
            ].map((label, index) => {
              const stepNumber = index + 1;
              const isActive = step === stepNumber;
              return (
                <View key={index} style={styles.stepItem}>
                  <View
                    style={[styles.circle, isActive && styles.activeCircle]}
                  >
                    <Text style={styles.circleText}>{stepNumber}</Text>
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive && styles.activeStepLabel,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>

          {step === 1 && subStep === 1 && (
            <View>
              <Text style={styles.title}>Create Profile</Text>
              <Text style={styles.subtitle}>Enter Your Basic Information</Text>

              <Text style={styles.inputLabel}>Service Number *</Text>
              <View style={styles.inputIcon}>
                <ShieldUser size={18} color="black" />
                <TextInput
                  value={serviceNumber}
                  placeholder="Enter service number"
                  style={styles.inputFlex}
                  onChangeText={setServiceNumber}
                />
              </View>

              <Text style={styles.inputLabel}>Rank *</Text>
              <View style={styles.inputIcon}>
                <VenusAndMars size={18} color="black" />
                <RNPickerSelect
                  onValueChange={(value) => setRank(value)}
                  placeholder={{ label: "Select rank", value: "" }}
                  items={Ranks}
                  value={rank}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <Text style={styles.inputLabel}>Unit *</Text>
              <View style={styles.inputIcon}>
                <UsersRound size={18} color="black" />
                <TextInput
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="Enter unit"
                  style={styles.inputFlex}
                />
              </View>

              <Text style={styles.inputLabel}>First Name *</Text>
              <View style={styles.inputIcon}>
                <User size={18} color="black" />
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  style={styles.inputFlex}
                />
              </View>

              <Text style={styles.inputLabel}>Other Name</Text>
              <View style={styles.inputIcon}>
                <User size={18} color="black" />
                <TextInput
                  value={otherName}
                  onChangeText={setOtherName}
                  placeholder="Enter other name"
                  style={styles.inputFlex}
                />
              </View>

              <Text style={styles.inputLabel}>Surname *</Text>
              <View style={styles.inputIcon}>
                <User size={18} color="black" />
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter surname"
                  style={styles.inputFlex}
                />
              </View>

              <Text style={styles.inputLabel}>Gender *</Text>
              <View style={styles.inputIcon}>
                <VenusAndMars size={18} color="black" />
                <RNPickerSelect
                  onValueChange={(value) => setGender(value)}
                  placeholder={{ label: "Select gender", value: "" }}
                  items={Gender}
                  value={gender}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            </View>
          )}

          {step === 1 && subStep === 2 && (
            <View>
              <View style={styles.headerWithBack}>
                <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                  <ChevronLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Create Profile</Text>
              </View>
              <Text style={styles.subtitle}>
                Enter Your Contact Information
              </Text>

              <Text style={styles.inputLabel}>Date of Birth *</Text>
              <TouchableOpacity
                style={styles.inputIcon}
                onPress={showDatePicker}
              >
                <Calendar size={18} color="black" />
                <Text style={[styles.inputFlex, styles.dobText]}>
                  {dob || "Select date of birth"}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                maximumDate={new Date()}
              />

              <Text style={styles.inputLabel}>Phone Number *</Text>
              <View style={styles.inputIcon}>
                <Phone size={18} color="black" />
                <TextInput
                  value={phone}
                  placeholder="Enter phone number"
                  style={styles.inputFlex}
                  keyboardType="phone-pad"
                  onChangeText={setPhone}
                />
              </View>

              <Text style={styles.inputLabel}>Email Address *</Text>
              <View style={styles.inputIcon}>
                <Mail size={18} color="black" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  style={styles.inputFlex}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.inputLabel}>Home Address *</Text>
              <View style={styles.inputIcon}>
                <Home size={18} color="black" />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter home address"
                  style={styles.inputFlex}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>

              <Text style={styles.inputLabel}>Transaction Pin *</Text>
              <View style={styles.inputIcon}>
                <Key size={18} color="black" />
                <TextInput
                  value={transactionPin}
                  placeholder="Enter 4-digit transaction pin"
                  style={styles.inputFlex}
                  onChangeText={setTransactionPin}
                  secureTextEntry={true}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>
          )}

          {step === 1 && subStep === 3 && (
            <View>
              <View style={styles.headerWithBack}>
                <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                  <ChevronLeft size={24} color="#82B921" />
                </TouchableOpacity>
                <Text style={styles.title}>Create Profile</Text>
              </View>
              <Text style={styles.subtitle}>
                Enter Your Financial Information
              </Text>

              <Text style={styles.inputLabel}>State of Origin *</Text>
              <View style={styles.inputIcon}>
                <MapPinHouse size={18} color="black" />
                <RNPickerSelect
                  onValueChange={(value) => {
                    setStateOrigin(value);
                    setLga("");
                  }}
                  placeholder={{ label: "Select state of origin", value: "" }}
                  items={Object.keys(states).map((state) => ({
                    label: state,
                    value: state,
                  }))}
                  value={stateOrigin}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <Text style={styles.inputLabel}>LGA *</Text>
              <View style={styles.inputIcon}>
                <MapPinCheckInside size={18} color="black" />
                <RNPickerSelect
                  onValueChange={(value) => setLga(value)}
                  placeholder={{ label: "Select LGA", value: "" }}
                  items={
                    stateOrigin
                      ? (states as Record<string, string[]>)[stateOrigin]?.map(
                          (lgaItem: string) => ({
                            label: lgaItem,
                            value: lgaItem,
                          })
                        ) || []
                      : []
                  }
                  value={lga}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <Text style={styles.inputLabel}>Bank Name *</Text>
              <View style={styles.inputIcon}>
                <Building size={18} color="black" />
                <TextInput
                  value={bankName}
                  placeholder="Enter bank name"
                  style={styles.inputFlex}
                  onChangeText={setBankName}
                />
              </View>

              <Text style={styles.inputLabel}>Account Number *</Text>
              <View style={styles.inputIcon}>
                <CreditCard size={18} color="black" />
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="Enter account number"
                  style={styles.inputFlex}
                  keyboardType="numeric"
                />
              </View>

              <Text style={styles.inputLabel}>Account Name *</Text>
              <View style={styles.inputIcon}>
                <CreditCard size={18} color="black" />
                <TextInput
                  value={accountName}
                  onChangeText={setAccountName}
                  placeholder="Enter account name"
                  style={styles.inputFlex}
                />
              </View>

              <Text style={styles.inputLabel}>Monthly Deduction Amount *</Text>
              <View style={styles.inputIcon}>
                <CreditCard size={18} color="black" />
                <TextInput
                  value={monthlyDeduction}
                  placeholder="Enter amount"
                  style={styles.inputFlex}
                  keyboardType="numeric"
                  onChangeText={setMonthlyDeduction}
                />
              </View>
            </View>
          )}

          {/* Step 2 - Next of Kin - Substep 1: Basic Information */}
          {step === 2 && subStep === 1 && (
            <View>
              <View style={styles.headerWithBack}>
                <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                  <ChevronLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Next Of Kin</Text>
              </View>
              <Text style={styles.subtitle}>Enter Basic Information</Text>

              <Text style={styles.inputLabel}>First Name *</Text>
              <View style={styles.inputIcon}>
                <User size={18} color="black" />
                <TextInput
                  value={kinFirstName}
                  onChangeText={setKinFirstName}
                  placeholder="Enter first name"
                  style={styles.inputFlex}
                />
              </View>

              <Text style={styles.inputLabel}>Last Name *</Text>
              <View style={styles.inputIcon}>
                <User size={18} color="black" />
                <TextInput
                  value={kinLastName}
                  onChangeText={setKinLastName}
                  placeholder="Enter last name"
                  style={styles.inputFlex}
                />
              </View>

              <Text style={styles.inputLabel}>Gender *</Text>
              <View style={styles.inputIcon}>
                <VenusAndMars size={18} color="black" />
                <RNPickerSelect
                  onValueChange={(value) => setKinGender(value)}
                  placeholder={{ label: "Select gender", value: "" }}
                  items={Gender}
                  value={kinGender}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <Text style={styles.inputLabel}>Relationship *</Text>
              <View style={styles.inputIcon}>
                <Smile size={18} color="black" />
                <RNPickerSelect
                  onValueChange={(value) => setRelationship(value)}
                  placeholder={{ label: "Select relationship", value: "" }}
                  items={Relationship}
                  value={relationship}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            </View>
          )}

          {/* Step 2 - Next of Kin - Substep 2: Contact Information */}
          {step === 2 && subStep === 2 && (
            <View>
              <View style={styles.headerWithBack}>
                <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                  <ChevronLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Next of Kin</Text>
              </View>
              <Text style={styles.subtitle}>Enter Contact Information</Text>

              <Text style={styles.inputLabel}>Phone Number *</Text>
              <View style={styles.inputIcon}>
                <Phone size={18} color="black" />
                <TextInput
                  value={kinPhone}
                  onChangeText={setKinPhone}
                  placeholder="Enter phone number"
                  style={styles.inputFlex}
                  keyboardType="phone-pad"
                />
              </View>

              <Text style={styles.inputLabel}>Email Address *</Text>
              <View style={styles.inputIcon}>
                <Mail size={18} color="black" />
                <TextInput
                  value={kinEmail}
                  onChangeText={setKinEmail}
                  placeholder="Enter email address"
                  style={styles.inputFlex}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.inputLabel}>Address *</Text>
              <View style={styles.inputIcon}>
                <Home size={18} color="black" />
                <TextInput
                  value={kinAddress}
                  onChangeText={setKinAddress}
                  placeholder="Enter home address"
                  style={styles.inputFlex}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <View style={styles.headerWithBack}>
                <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                  <ChevronLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Upload Document</Text>
              </View>
              <Text style={styles.subtitle}>
                Please provide your credentials to signup to the platform.
              </Text>

              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>Upload your picture *</Text>
                {renderDocumentPreview(profilePicture, setProfilePicture)}
                {!profilePicture && (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={pickProfilePicture}
                  >
                    <Upload size={24} color="#666" />
                    <Text style={styles.uploadText}>
                      Tap to select profile picture
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>NIN of Next of kin *</Text>
                {renderDocumentPreview(ninDocument, setNinDocument)}
                {!ninDocument && (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => pickDocument(setNinDocument)}
                  >
                    <Upload size={24} color="#666" />
                    <Text style={styles.uploadText}>
                      Tap to select NIN document
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>
                  Valid means of ID (NIN, Drivers License, International
                  Passport) *
                </Text>
                {renderDocumentPreview(idDocument, setIdDocument)}
                {!idDocument && (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => pickDocument(setIdDocument)}
                  >
                    <Upload size={24} color="#666" />
                    <Text style={styles.uploadText}>
                      Tap to select ID document
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>Personnel ID Card *</Text>
                {renderDocumentPreview(personnelId, setPersonnelId)}
                {!personnelId && (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => pickDocument(setPersonnelId)}
                  >
                    <Upload size={24} color="#666" />
                    <Text style={styles.uploadText}>
                      Tap to select Personnel ID
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {step === 4 && (
            <View>
              <View style={styles.headerWithBack}>
                <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                  <ChevronLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Security Question</Text>
              </View>
              <Text style={styles.subtitle}>
                Setup your security question for account recovery
              </Text>

              <Text style={styles.inputLabel}>Security Question *</Text>
              <View style={styles.inputIcon}>
                <MessageCircleQuestion size={18} color="black" />
                <RNPickerSelect
                  onValueChange={(value) => setSecurityQuestion(value)}
                  placeholder={{
                    label: "Select Security Question",
                    value: "",
                  }}
                  items={securityQuestions}
                  value={securityQuestion}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              <Text style={styles.inputLabel}>Security Answer *</Text>
              <View style={styles.inputIcon}>
                <MessageSquare size={18} color="black" />
                <TextInput
                  value={securityAnswer}
                  onChangeText={setSecurityAnswer}
                  placeholder="Enter security answer"
                  style={styles.inputFlex}
                />
              </View>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.buttonPrimary, isLoading && styles.buttonDisabled]}
            onPress={nextStep}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Submitting..." : step === 4 ? "Submit" : "Proceed"}
              {!isLoading && " →"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationForm;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 30,
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  logoImage: {
    width: 60,
    height: 80,
    resizeMode: "contain",
  },
  form: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  activeCircle: {
    backgroundColor: "#82B921",
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  stepLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  activeStepLabel: {
    color: "#82B921",
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  headerWithBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#82B921",
    fontFamily: "Poppins_400Regular",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
  inputLabel: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
    fontFamily: "Poppins_400Regular",
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    minHeight: 40,
  },
  inputFlex: {
    flex: 1,
    padding: 8,
  },
  dobText: {
    paddingVertical: 10,
    color: "#999",
  },
  uploadSection: {
    marginBottom: 15,
  },
  uploadLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    fontFamily: "Poppins_400Regular",
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    marginTop: 8,
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  previewImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 4,
  },
  previewText: {
    flex: 1,
    fontSize: 12,
    color: "#666",
    fontFamily: "Poppins_400Regular",
  },
  removeButton: {
    backgroundColor: "#ff4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 21, 2, 0.9)",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: "#213400",
    padding: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  buttonSecondary: {
    backgroundColor: "#ccc",
    padding: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  // Success page styles
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    position: "relative",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 40,
    lineHeight: 24,
    fontFamily: "Poppins_400Regular",
  },
  successIconContainer: {
    position: "relative",
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#82B921",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  checkmark: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 50,
  },
  decorativeLine: {
    position: "absolute",
    width: 30,
    height: 3,
    borderRadius: 2,
  },
  loginButton: {
    backgroundColor: "#213400",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
    fontFamily: "Poppins_400Regular",
  },
  loginArrow: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
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
