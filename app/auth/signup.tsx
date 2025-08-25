import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import {
  User,
  Phone,
  Mail,
  Home,
  Building,
  Calendar,
  CreditCard,
  Upload,
  FileText,
  X,
  ShieldUser,
  ShieldHalf,
  UsersRound,
  VenusAndMars,
  MapPinHouse,
  MapPinCheckInside,
  Smile,
  MessageCircleQuestion,
  MessageSquare,
} from "lucide-react-native";
import { router } from "expo-router";
import { states } from "../../constants/data";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

interface Document {
  uri: string;
  name: string;
  type?: string;
}

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dob, setDob] = useState("");
  const [kinDob, setKinDob] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isKinDatePickerVisible, setKinDatePickerVisible] = useState(false);
  const [gender, setGender] = useState("");
  const [kinGender, setKinGender] = useState("");
  const [stateOrigin, setStateOrigin] = useState("");
  const [lga, setLga] = useState("");
  const [kinStateOrigin, setKinStateOrigin] = useState("");
  const [kinLga, setKinLga] = useState("");
  const [title, setTitle] = useState("");
  const [kinTitle, setKinTitle] = useState("");
  const [relationship, setRelationship] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");

  // State for uploaded documents
  const [profilePicture, setProfilePicture] = useState<Document | null>(null);
  const [ninDocument, setNinDocument] = useState<Document | null>(null);
  const [idDocument, setIdDocument] = useState<Document | null>(null);
  const [personnelId, setPersonnelId] = useState<Document | null>(null);

  const nextStep = () => {
    if (step === 1 && subStep < 3) {
      setSubStep((prev) => prev + 1);
    } else if (step === 1 && subStep === 3) {
      setStep(2);
      setSubStep(1);
    } else if (step === 2 && subStep < 3) {
      setSubStep((prev) => prev + 1);
    } else if (step === 2 && subStep === 3) {
      setStep(3);
      setSubStep(1);
    } else if (step === 4) {
      setShowSuccess(true);
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
    } else if (step === 3 && subStep === 1) {
      setStep(2);
      setSubStep(3);
    } else {
      setStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const showKinDatePicker = () => setKinDatePickerVisible(true);
  const hideKinDatePicker = () => setKinDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    setDob(date.toISOString().split("T")[0]);
    hideDatePicker();
  };

  const handleKinConfirm = (date: Date) => {
    setKinDob(date.toISOString().split("T")[0]);
    hideKinDatePicker();
  };

  const handleLogin = () => {
    router.push("/auth/login");
    setShowSuccess(false);
    setStep(1);
    setSubStep(1);
  };

  const pickProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture({
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || "profile.jpg",
        });
        Alert.alert("Success", "Profile picture selected");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickDocument = async (
    setDocumentFunction: (doc: Document | null) => void
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.assets && result.assets[0]) {
        setDocumentFunction({
          uri: result.assets[0].uri,
          name: result.assets[0].name || "document",
          type: result.assets[0].mimeType,
        });
        Alert.alert("Success", "Document selected");
      }
    } catch (error) {
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
          source={require("../../assets/images/chief.jpg")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <View style={styles.successOverlay}>
            <View style={styles.successContainer}>
              <View style={styles.logo}>
                <Image
                  source={require("../../assets/images/sappper-logo.png")}
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
      <ImageBackground
        source={require("../../assets/images/chief.jpg")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Logo */}
          <View style={styles.logo}>
            <Image
              source={require("../../assets/images/sappper-logo.png")}
              style={styles.logoImage}
            />
          </View>

          {/* White Form Container */}
          <View style={styles.form}>
            {/* Stepper */}
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

            {/* Step-specific content */}
            {step === 1 && subStep === 1 && (
              <View>
                <Text style={styles.title}>Create Profile</Text>
                <Text style={styles.subtitle}>
                  Enter Your Basic Information
                </Text>

                <Text style={styles.inputLabel}>Service Number</Text>
                <View style={styles.inputIcon}>
                  <ShieldUser size={18} color="black" />
                  <TextInput
                    placeholder="Enter service number"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Rank</Text>
                <View style={styles.inputIcon}>
                  <ShieldHalf size={18} color="black" />
                  <TextInput
                    placeholder="Enter rank"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Unit</Text>
                <View style={styles.inputIcon}>
                  <UsersRound size={18} color="black" />
                  <TextInput
                    placeholder="Enter unit"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>First Name</Text>
                <View style={styles.inputIcon}>
                  <User size={18} color="black" />
                  <TextInput
                    placeholder="Enter first name"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Other Name</Text>
                <View style={styles.inputIcon}>
                  <User size={18} color="black" />
                  <TextInput
                    placeholder="Enter other name"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Surname</Text>
                <View style={styles.inputIcon}>
                  <User size={18} color="black" />
                  <TextInput
                    placeholder="Enter surname"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.inputIcon}>
                  <VenusAndMars size={18} color="black" />
                  <RNPickerSelect
                    onValueChange={(value) => setGender(value)}
                    placeholder={{ label: "Select gender", value: "" }}
                    items={[
                      { label: "MALE", value: "Male" },
                      { label: "FEMALE", value: "Female" },
                    ]}
                    value={gender}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>
            )}

            {step === 1 && subStep === 2 && (
              <View>
                <Text style={styles.title}>Create Profile</Text>
                <Text style={styles.subtitle}>
                  Enter Your Contact Information
                </Text>

                <Text style={styles.inputLabel}>Date of Birth</Text>
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
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputIcon}>
                  <Phone size={18} color="black" />
                  <TextInput
                    placeholder="Enter phone number"
                    style={styles.inputFlex}
                    keyboardType="phone-pad"
                  />
                </View>

                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputIcon}>
                  <Mail size={18} color="black" />
                  <TextInput
                    placeholder="Enter email address"
                    style={styles.inputFlex}
                    keyboardType="email-address"
                  />
                </View>

                <Text style={styles.inputLabel}>Home Address</Text>
                <View style={styles.inputIcon}>
                  <Home size={18} color="black" />
                  <TextInput
                    placeholder="Enter home address"
                    style={styles.inputFlex}
                  />
                </View>
              </View>
            )}

            {step === 1 && subStep === 3 && (
              <View>
                <Text style={styles.title}>Create Profile</Text>
                <Text style={styles.subtitle}>
                  Enter Your Financial Information
                </Text>

                <Text style={styles.inputLabel}>State of Origin</Text>
                <View style={styles.inputIcon}>
                  <MapPinHouse size={18} color="black" />
                  <RNPickerSelect
                    onValueChange={(value) => {
                      setStateOrigin(value);
                      setLga(""); // reset LGA when state changes
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

                <Text style={styles.inputLabel}>LGA</Text>
                <View style={styles.inputIcon}>
                  <MapPinCheckInside size={18} color="black" />
                  <RNPickerSelect
                    onValueChange={(value) => setLga(value)}
                    placeholder={{ label: "Select LGA", value: "" }}
                    items={
                      stateOrigin
                        ? (states as Record<string, string[]>)[
                            stateOrigin
                          ]?.map((lgaItem: string) => ({
                            label: lgaItem,
                            value: lgaItem,
                          })) || []
                        : []
                    }
                    value={lga}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>

                <Text style={styles.inputLabel}>Bank</Text>
                <View style={styles.inputIcon}>
                  <Building size={18} color="black" />
                  <TextInput
                    placeholder="Enter bank name"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Account Number</Text>
                <View style={styles.inputIcon}>
                  <CreditCard size={18} color="black" />
                  <TextInput
                    placeholder="Enter account number"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Account Name</Text>
                <View style={styles.inputIcon}>
                  <CreditCard size={18} color="black" />
                  <TextInput
                    placeholder="Enter account name"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Amount to be deducted</Text>
                <View style={styles.inputIcon}>
                  <CreditCard size={18} color="black" />
                  <TextInput
                    placeholder="Enter amount"
                    style={styles.inputFlex}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}

            {/* Step 2 - Next of Kin - Substep 1: Basic Information */}
            {step === 2 && subStep === 1 && (
              <View>
                <Text style={styles.title}>Next of Kin</Text>
                <Text style={styles.subtitle}>Enter Basic Information</Text>

                <Text style={styles.inputLabel}>First Name</Text>
                <View style={styles.inputIcon}>
                  <User size={18} color="black" />
                  <TextInput
                    placeholder="Enter first name"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Other Name</Text>
                <View style={styles.inputIcon}>
                  <User size={18} color="black" />
                  <TextInput
                    placeholder="Enter other name"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Surname</Text>
                <View style={styles.inputIcon}>
                  <User size={18} color="black" />
                  <TextInput
                    placeholder="Enter surname"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.inputIcon}>
                  <VenusAndMars size={18} color="black" />
                  <RNPickerSelect
                    onValueChange={(value) => setKinGender(value)}
                    placeholder={{ label: "Select gender", value: "" }}
                    items={[
                      { label: "MALE", value: "Male" },
                      { label: "FEMALE", value: "Female" },
                    ]}
                    value={kinGender}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>

                <Text style={styles.inputLabel}>Relationship</Text>
                <View style={styles.inputIcon}>
                  <Smile size={18} color="black" />
                  <RNPickerSelect
                    onValueChange={(value) => setRelationship(value)}
                    placeholder={{ label: "Select relationship", value: "" }}
                    items={[
                      { label: "Brother", value: "Brother" },
                      { label: "Sister", value: "Sister" },
                      { label: "Father", value: "Father" },
                      { label: "Mother", value: "Mother" },
                      { label: "Son", value: "Son" },
                      { label: "Daughter", value: "Daughter" },
                      { label: "Spouse", value: "Spouse" },
                      { label: "Uncle", value: "Uncle" },
                      { label: "Aunt", value: "Aunt" },
                      { label: "Friend", value: "Friend" },
                    ]}
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
                <Text style={styles.title}>Next of Kin</Text>
                <Text style={styles.subtitle}>Enter Contact Information</Text>

                <Text style={styles.inputLabel}>Date of Birth</Text>
                <TouchableOpacity
                  style={styles.inputIcon}
                  onPress={showKinDatePicker}
                >
                  <Calendar size={18} color="black" />
                  <Text style={[styles.inputFlex, styles.dobText]}>
                    {kinDob || "Select date of birth"}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isKinDatePickerVisible}
                  mode="date"
                  onConfirm={handleKinConfirm}
                  onCancel={hideKinDatePicker}
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputIcon}>
                  <Phone size={18} color="black" />
                  <TextInput
                    placeholder="Enter phone number"
                    style={styles.inputFlex}
                    keyboardType="phone-pad"
                  />
                </View>

                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputIcon}>
                  <Mail size={18} color="black" />
                  <TextInput
                    placeholder="Enter email address"
                    style={styles.inputFlex}
                    keyboardType="email-address"
                  />
                </View>

                <Text style={styles.inputLabel}>Home Address</Text>
                <View style={styles.inputIcon}>
                  <Home size={18} color="black" />
                  <TextInput
                    placeholder="Enter home address"
                    style={styles.inputFlex}
                  />
                </View>
              </View>
            )}

            {/* Step 2 - Next of Kin - Substep 3: Additional Information */}
            {step === 2 && subStep === 3 && (
              <View>
                <Text style={styles.title}>Next of Kin</Text>
                <Text style={styles.subtitle}>
                  Enter Additional Information
                </Text>

                <Text style={styles.inputLabel}>Guarantor Service Number</Text>
                <View style={styles.inputIcon}>
                  <ShieldUser size={18} color="black" />
                  <TextInput
                    placeholder="Enter guarantor service number"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>State of Origin</Text>
                <View style={styles.inputIcon}>
                  <MapPinHouse size={18} color="black" />
                  <RNPickerSelect
                    onValueChange={(value) => {
                      setKinStateOrigin(value);
                      setKinLga("");
                    }}
                    placeholder={{ label: "Select state of origin", value: "" }}
                    items={Object.keys(states).map((state) => ({
                      label: state,
                      value: state,
                    }))}
                    value={kinStateOrigin}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>

                <Text style={styles.inputLabel}>LGA</Text>
                <View style={styles.inputIcon}>
                  <MapPinCheckInside size={18} color="black" />
                  <RNPickerSelect
                    onValueChange={(value) => setKinLga(value)}
                    placeholder={{ label: "Select LGA", value: "" }}
                    items={
                      kinStateOrigin
                        ? (states as Record<string, string[]>)[
                            kinStateOrigin
                          ]?.map((lgaItem: string) => ({
                            label: lgaItem,
                            value: lgaItem,
                          })) || []
                        : []
                    }
                    value={kinLga}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>

                <Text style={styles.inputLabel}>Guarantor's Unit</Text>
                <View style={styles.inputIcon}>
                  <UsersRound size={18} color="black" />
                  <TextInput
                    placeholder="Enter guarantor's unit"
                    style={styles.inputFlex}
                  />
                </View>

                <Text style={styles.inputLabel}>
                  Relationship with Guarantor
                </Text>
                <View style={styles.inputIcon}>
                  <Smile size={18} color="black" />
                  <TextInput
                    placeholder="Enter relationship with guarantor"
                    style={styles.inputFlex}
                  />
                </View>
              </View>
            )}

            {step === 3 && (
              <View>
                <Text style={styles.title}>Upload Document</Text>
                <Text style={styles.subtitle}>
                  Please provide your credentials to Signup to the platform.
                </Text>

                <View style={styles.uploadSection}>
                  <Text style={styles.uploadLabel}>Upload your picture</Text>
                  {renderDocumentPreview(profilePicture, setProfilePicture)}
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={pickProfilePicture}
                  >
                    <Upload size={24} color="#666" />
                    <Text style={styles.uploadText}>
                      {profilePicture
                        ? "Change Picture"
                        : "Drop file here/Choose file"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.uploadSection}>
                  <Text style={styles.uploadLabel}>
                    NIN of Next of kin (Optional)
                  </Text>
                  {renderDocumentPreview(ninDocument, setNinDocument)}
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => pickDocument(setNinDocument)}
                  >
                    <Upload size={24} color="#666" />
                    <Text style={styles.uploadText}>
                      {ninDocument
                        ? "Change Document"
                        : "Drop file here/Choose file"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.uploadSection}>
                  <Text style={styles.uploadLabel}>
                    Valid means of ID (NIN, Drivers License, International
                    Passport)
                  </Text>
                  {renderDocumentPreview(idDocument, setIdDocument)}
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => pickDocument(setIdDocument)}
                  >
                    <Upload size={24} color="#666" />
                    <Text style={styles.uploadText}>
                      {idDocument
                        ? "Change Document"
                        : "Drop file here/Choose file"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.uploadSection}>
                  <Text style={styles.uploadLabel}>Personnel ID Card</Text>
                  {renderDocumentPreview(personnelId, setPersonnelId)}
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => pickDocument(setPersonnelId)}
                  >
                    <Upload size={24} color="#666" />
                    <Text style={styles.uploadText}>
                      {personnelId
                        ? "Change Document"
                        : "Drop file here/Choose file"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 4 && (
              <View>
                <Text style={styles.title}>Security Question</Text>
                <Text style={styles.subtitle}>
                  Enter Your Current Information
                </Text>

                <Text style={styles.inputLabel}>Security Question</Text>
                <View style={styles.inputIcon}>
                  <MessageCircleQuestion size={18} color="black" />
                  <RNPickerSelect
                    onValueChange={(value) => setSecurityQuestion(value)}
                    placeholder={{
                      label: "Select Security Question",
                      value: "",
                    }}
                    items={[
                      {
                        label: "What is your mother's maiden name?",
                        value: "mother_maiden",
                      },
                      {
                        label: "What was the name of your first pet?",
                        value: "first_pet",
                      },
                      {
                        label: "What city were you born in?",
                        value: "birth_city",
                      },
                      {
                        label: "What is your favorite food?",
                        value: "favorite_food",
                      },
                      {
                        label: "What was your first school?",
                        value: "first_school",
                      },
                    ]}
                    value={securityQuestion}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>

                <Text style={styles.inputLabel}>Security Answer</Text>
                <View style={styles.inputIcon}>
                  <MessageSquare size={18} color="black" />
                  <TextInput
                    placeholder="Enter security answer"
                    style={styles.inputFlex}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={nextStep}>
              <Text style={styles.buttonText}>
                {step === 4 ? "Submit" : "Proceed"} →
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
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
  },
  stepLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "#666",
    textAlign: "center",
  },
  activeStepLabel: {
    color: "#82B921",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#82B921",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  inputLabel: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000", // Changed to black
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  inputFlex: {
    flex: 1,
    padding: 8,
  },
  dobText: {
    paddingVertical: 10,
  },
  uploadSection: {
    marginBottom: 15,
  },
  uploadLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: "#000", // Changed to black
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
  },
  loginArrow: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
