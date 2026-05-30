import { router } from "expo-router";
import {
  Building, Calendar, ChevronLeft, CreditCard, Home, Key, Mail,
  MapPinCheckInside, MapPinHouse, MessageCircleQuestion, MessageSquare,
  Phone, ShieldUser, Smile, User, UsersRound, VenusAndMars,
} from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { states } from "@/constants/data";
import { Gender, Ranks, Relationship, securityQuestions } from "@/data/auth-data";
import { useRegister } from "@/hooks/useAuth";
import { DatePickerField } from "@/components/DatePickerField";
import { DocumentUpload, type Document } from "@/components/DocumentUpload";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";

const basicInfoSchema = z.object({
  serviceNumber: z.string().min(1, "Service number is required"),
  rank: z.string().min(1, "Rank is required"),
  unit: z.string().min(1, "Unit is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Surname is required"),
  otherName: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
});

const contactInfoSchema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  transactionPin: z.string().length(4, "PIN must be exactly 4 digits"),
});

const financialInfoSchema = z.object({
  stateOrigin: z.string().min(1, "State of origin is required"),
  lga: z.string().min(1, "LGA is required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountName: z.string().min(1, "Account name is required"),
  monthlyDeduction: z.string().min(1, "Monthly deduction is required"),
});

const kinBasicSchema = z.object({
  kinFirstName: z.string().min(1, "First name is required"),
  kinLastName: z.string().min(1, "Last name is required"),
  kinGender: z.string().min(1, "Gender is required"),
  relationship: z.string().min(1, "Relationship is required"),
});

const kinContactSchema = z.object({
  kinPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  kinEmail: z.string().email("Invalid email address"),
  kinAddress: z.string().min(1, "Address is required"),
});

const securitySchema = z.object({
  securityQuestion: z.string().min(1, "Security question is required"),
  securityAnswer: z.string().min(1, "Security answer is required"),
});

const registrationSchema = z.object({
  ...basicInfoSchema.shape,
  ...contactInfoSchema.shape,
  ...financialInfoSchema.shape,
  ...kinBasicSchema.shape,
  ...kinContactSchema.shape,
  ...securitySchema.shape,
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const steps = [
  { label: "Personal Info", substeps: 3 },
  { label: "Next of Kin", substeps: 2 },
  { label: "Upload Docs", substeps: 1 },
  { label: "Security", substeps: 1 },
];

const stepFields: Record<string, (keyof RegistrationFormValues)[]> = {
  "1-1": ["serviceNumber", "rank", "unit", "firstName", "lastName", "otherName", "gender"],
  "1-2": ["dob", "phone", "email", "address", "transactionPin"],
  "1-3": ["stateOrigin", "lga", "bankName", "accountNumber", "accountName", "monthlyDeduction"],
  "2-1": ["kinFirstName", "kinLastName", "kinGender", "relationship"],
  "2-2": ["kinPhone", "kinEmail", "kinAddress"],
  "4-1": ["securityQuestion", "securityAnswer"],
};

function StepHeader({ title, subtitle, onBack, backColor }: { title: string; subtitle: string; onBack: () => void; backColor?: string }) {
  return (
    <View style={s.headerWithBack}>
      <TouchableOpacity onPress={onBack} style={s.backButton}>
        <ChevronLeft size={24} color={backColor ?? "black"} />
      </TouchableOpacity>
      <Text style={s.title}>{title}</Text>
    </View>
  );
}

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profilePicture, setProfilePicture] = useState<Document | null>(null);
  const [ninDocument, setNinDocument] = useState<Document | null>(null);
  const [idDocument, setIdDocument] = useState<Document | null>(null);
  const [personnelId, setPersonnelId] = useState<Document | null>(null);
  const { mutateAsync: register, isPending } = useRegister();

  const { control, handleSubmit, trigger, getValues, reset, watch, setValue } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      serviceNumber: "", rank: "", unit: "", firstName: "", lastName: "", otherName: "", gender: "",
      dob: "", phone: "", email: "", address: "", transactionPin: "",
      stateOrigin: "", lga: "", bankName: "", accountNumber: "", accountName: "", monthlyDeduction: "",
      kinFirstName: "", kinLastName: "", kinGender: "", relationship: "",
      kinPhone: "", kinEmail: "", kinAddress: "",
      securityQuestion: "", securityAnswer: "",
    },
  });

  const currentKey = `${step}-${step === 3 ? 1 : subStep}`;
  const fieldsToValidate = stepFields[currentKey] ?? [];

  const validateStep = async () => {
    if (currentKey === "3-1") {
      if (!profilePicture || !ninDocument || !idDocument || !personnelId) {
        Alert.alert("Error", "Please upload all required documents");
        return false;
      }
      return true;
    }
    const valid = await trigger(fieldsToValidate);
    if (!valid) Alert.alert("Error", "Please fix the highlighted fields");
    return valid;
  };

  const nextStep = async () => {
    if (!(await validateStep())) return;

    if (step === 1 && subStep < 3) {
      setSubStep((s) => s + 1);
    } else if (step === 1 && subStep === 3) {
      setStep(2);
      setSubStep(1);
    } else if (step === 2 && subStep < 2) {
      setSubStep((s) => s + 1);
    } else if (step === 2 && subStep === 2) {
      setStep(3);
    } else if (step === 4) {
      handleSubmit(handleRegister)();
    } else {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const prevStep = () => {
    if (step === 1 && subStep > 1) setSubStep((s) => s - 1);
    else if (step === 2 && subStep > 1) setSubStep((s) => s - 1);
    else if (step === 2 && subStep === 1) { setStep(1); setSubStep(3); }
    else if (step === 3) { setStep(2); setSubStep(2); }
    else setStep((s) => Math.max(s - 1, 1));
  };

  const createFormData = () => {
    const v = getValues();
    const formData = new FormData();
    const payload = {
      service_number: v.serviceNumber, rank: v.rank, unit: v.unit,
      first_name: v.firstName, other_name: v.otherName, last_name: v.lastName,
      gender: v.gender, date_of_birth: new Date(v.dob),
      phone: v.phone, email: v.email, address: v.address,
      pin: v.transactionPin, state_of_origin: v.stateOrigin, lga: v.lga,
      account_name: v.accountName, account_number: v.accountNumber,
      bankName: v.bankName, monthlyDeduction: v.monthlyDeduction,
      kinFirstName: v.kinFirstName, kinLastName: v.kinLastName,
      kinGender: v.kinGender, kinPhone: v.kinPhone, kinAddress: v.kinAddress,
      kinEmail: v.kinEmail, relationship: v.relationship,
      securityQuestion: v.securityQuestion, securityAnswer: v.securityAnswer,
    };

    formData.append("data", JSON.stringify(payload));

    const appendFile = (key: string, file: Document | null) => {
      if (file) {
        formData.append(key, { uri: file.uri, type: file.type || "application/octet-stream", name: file.name } as any);
      }
    };

    appendFile("profile_picture", profilePicture);
    appendFile("identification", ninDocument);
    appendFile("signature", idDocument);
    appendFile("id_card", personnelId);

    return formData;
  };

  const handleRegister = async () => {
    try {
      const formData = createFormData();
      await register(formData);
      setShowSuccess(true);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.request ? "Network error. Please check your internet connection." : error.message) ||
        "Registration failed. Please try again.";
      Alert.alert("Registration Error", message);
    }
  };

  const handleLogin = () => {
    router.push("/auth/login");
    setShowSuccess(false);
    setStep(1);
    setSubStep(1);
    reset();
    setProfilePicture(null);
    setNinDocument(null);
    setIdDocument(null);
    setPersonnelId(null);
  };

  if (showSuccess) {
    return (
      <SafeAreaView style={s.safeArea}>
        <ImageBackground source={require("@/assets/images/chief.jpg")} resizeMode="cover" style={s.backgroundImage}>
          <View style={s.successOverlay}>
            <View style={s.successContainer}>
              <View style={s.logo}>
                <Image source={require("@/assets/images/sappper-logo.png")} style={s.logoImage} />
              </View>
              <View style={s.successCard}>
                <Text style={s.successTitle}>Your Account Has been{"\n"}Created Successfully</Text>
                <View style={s.successIconContainer}>
                  {[{ bg: "#82B921", w: 8, h: 8, t: 20, l: 30 }, { bg: "#FF6B35", w: 6, h: 6, t: 40, r: 40 }, { bg: "transparent", w: 16, h: 16, t: 80, l: 60, bw: 2, bc: "#DDD" }].map((c, i) => (
                    <View key={i} style={[s.decorativeCircle, c.bw ? { borderWidth: c.bw, borderColor: c.bc } : {}, { backgroundColor: c.bg, width: c.w, height: c.h, top: c.t, left: c.l, right: (c as any).r }]} />
                  ))}
                  <View style={s.successIcon}>
                    <Text style={s.checkmark}>✓</Text>
                  </View>
                </View>
                <TouchableOpacity style={s.loginButton} onPress={handleLogin}>
                  <Text style={s.loginButtonText}>Login</Text>
                  <Text style={s.loginArrow}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView contentContainerStyle={s.container}>
        <View style={s.logo}>
          <Image source={require("@/assets/images/sappper-logo.png")} style={s.logoImage} />
        </View>

        <View style={s.form}>
          <View style={s.stepper}>
            {steps.map(({ label }, i) => (
              <View key={i} style={s.stepItem}>
                <View style={[s.circle, step === i + 1 && s.activeCircle]}>
                  <Text style={s.circleText}>{i + 1}</Text>
                </View>
                <Text style={[s.stepLabel, step === i + 1 && s.activeStepLabel]}>{label}</Text>
              </View>
            ))}
          </View>

          {step === 1 && subStep === 1 && (
            <View>
              <Text style={s.title}>Create Profile</Text>
              <Text style={s.subtitle}>Enter Your Basic Information</Text>
              <Controller control={control} name="serviceNumber" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Service Number *" icon={ShieldUser} placeholder="Enter service number" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="rank" render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormPicker label="Rank *" icon={VenusAndMars} items={Ranks} value={value} onValueChange={onChange} error={error?.message} />
              )} />
              <Controller control={control} name="unit" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Unit *" icon={UsersRound} placeholder="Enter unit" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="firstName" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="First Name *" icon={User} placeholder="Enter first name" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="otherName" render={({ field: { onChange, onBlur, value } }) => (
                <FormInput label="Other Name" icon={User} placeholder="Enter other name" value={value} onChangeText={onChange} onBlur={onBlur} />
              )} />
              <Controller control={control} name="lastName" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Surname *" icon={User} placeholder="Enter surname" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="gender" render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormPicker label="Gender *" icon={VenusAndMars} items={Gender} value={value} onValueChange={onChange} error={error?.message} />
              )} />
            </View>
          )}

          {step === 1 && subStep === 2 && (
            <View>
              <StepHeader title="Create Profile" subtitle="Enter Your Contact Information" onBack={prevStep} />
              <Controller control={control} name="dob" render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DatePickerField label="Date of Birth *" icon={Calendar} value={value} onChange={onChange} error={error?.message} />
              )} />
              <Controller control={control} name="phone" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Phone Number *" icon={Phone} placeholder="Enter phone number" keyboardType="phone-pad" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="email" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Email Address *" icon={Mail} placeholder="Enter email address" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="address" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Home Address *" icon={Home} placeholder="Enter home address" multiline numberOfLines={2} value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="transactionPin" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Transaction Pin *" icon={Key} placeholder="Enter 4-digit transaction pin" secureTextEntry keyboardType="numeric" maxLength={4} value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
            </View>
          )}

          {step === 1 && subStep === 3 && (
            <View>
              <StepHeader title="Create Profile" subtitle="Enter Your Financial Information" onBack={prevStep} backColor="#82B921" />
              <Controller control={control} name="stateOrigin" render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormPicker label="State of Origin *" icon={MapPinHouse}
                  items={Object.keys(states).map((s) => ({ label: s, value: s }))}
                  value={value}
                  onValueChange={(v) => { onChange(v); if (getValues("lga")) setValue("lga", ""); }}
                  error={error?.message} />
              )} />
              <Controller control={control} name="lga" render={({ field: { onChange, value }, fieldState: { error } }) => {
                const origin = watch("stateOrigin");
                const lgas: string[] = origin ? (states as Record<string, string[]>)[origin] ?? [] : [];
                return (
                  <FormPicker label="LGA *" icon={MapPinCheckInside}
                    items={lgas.map((l) => ({ label: l, value: l }))}
                    value={value}
                    onValueChange={onChange}
                    error={error?.message} />
                );
              }} />
              <Controller control={control} name="bankName" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Bank Name *" icon={Building} placeholder="Enter bank name" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="accountNumber" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Account Number *" icon={CreditCard} placeholder="Enter account number" keyboardType="numeric" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="accountName" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Account Name *" icon={CreditCard} placeholder="Enter account name" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="monthlyDeduction" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Monthly Deduction Amount *" icon={CreditCard} placeholder="Enter amount" keyboardType="numeric" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
            </View>
          )}

          {step === 2 && subStep === 1 && (
            <View>
              <StepHeader title="Next Of Kin" subtitle="Enter Basic Information" onBack={prevStep} />
              <Controller control={control} name="kinFirstName" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="First Name *" icon={User} placeholder="Enter first name" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="kinLastName" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Last Name *" icon={User} placeholder="Enter last name" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="kinGender" render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormPicker label="Gender *" icon={VenusAndMars} items={Gender} value={value} onValueChange={onChange} error={error?.message} />
              )} />
              <Controller control={control} name="relationship" render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormPicker label="Relationship *" icon={Smile} items={Relationship} value={value} onValueChange={onChange} error={error?.message} />
              )} />
            </View>
          )}

          {step === 2 && subStep === 2 && (
            <View>
              <StepHeader title="Next of Kin" subtitle="Enter Contact Information" onBack={prevStep} />
              <Controller control={control} name="kinPhone" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Phone Number *" icon={Phone} placeholder="Enter phone number" keyboardType="phone-pad" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="kinEmail" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Email Address *" icon={Mail} placeholder="Enter email address" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
              <Controller control={control} name="kinAddress" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Address *" icon={Home} placeholder="Enter home address" multiline numberOfLines={2} value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
            </View>
          )}

          {step === 3 && (
            <View>
              <StepHeader title="Upload Document" subtitle="Please provide your credentials to signup to the platform." onBack={prevStep} />
              <DocumentUpload label="Upload your picture *" value={profilePicture} onChange={setProfilePicture} isImage />
              <DocumentUpload label="NIN of Next of kin *" value={ninDocument} onChange={setNinDocument} />
              <DocumentUpload label="Valid means of ID (NIN, Drivers License, International Passport) *" value={idDocument} onChange={setIdDocument} />
              <DocumentUpload label="Personnel ID Card *" value={personnelId} onChange={setPersonnelId} />
            </View>
          )}

          {step === 4 && (
            <View>
              <StepHeader title="Security Question" subtitle="Setup your security question for account recovery" onBack={prevStep} />
              <Controller control={control} name="securityQuestion" render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormPicker label="Security Question *" icon={MessageCircleQuestion} items={securityQuestions} placeholder="Select Security Question" value={value} onValueChange={onChange} error={error?.message} />
              )} />
              <Controller control={control} name="securityAnswer" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Security Answer *" icon={MessageSquare} placeholder="Enter security answer" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
            </View>
          )}
        </View>

        <TouchableOpacity style={[s.buttonPrimary, isPending && s.buttonDisabled]} onPress={nextStep} disabled={isPending}>
          <Text style={s.buttonText}>
            {isPending ? "Submitting..." : step === 4 ? "Submit" : "Proceed"}
            {!isPending && " →"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1 },
  backgroundImage: { flex: 1 },
  container: { padding: 20, paddingTop: 30 },
  logo: { justifyContent: "center", alignItems: "center", marginBottom: 15, marginTop: 10 },
  logoImage: { width: 60, height: 80, resizeMode: "contain" },
  form: { backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 12, padding: 15, borderWidth: 1, borderColor: "#ddd", marginBottom: 20 },
  stepper: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderColor: "#eee" },
  stepItem: { alignItems: "center", flex: 1 },
  circle: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" },
  activeCircle: { backgroundColor: "#82B921" },
  circleText: { color: "#fff", fontWeight: "bold", fontFamily: "Poppins_400Regular" },
  stepLabel: { fontSize: 10, marginTop: 4, color: "#666", textAlign: "center", fontFamily: "Poppins_400Regular" },
  activeStepLabel: { color: "#82B921", fontWeight: "bold" },
  headerWithBack: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10, position: "relative" },
  backButton: { position: "absolute", left: 0, padding: 5 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#82B921", fontFamily: "Poppins_400Regular" },
  subtitle: { fontSize: 12, textAlign: "center", marginBottom: 20, color: "#666", fontFamily: "Poppins_400Regular" },
  buttonPrimary: { backgroundColor: "#213400", padding: 14, borderRadius: 8, alignItems: "center", width: "100%", marginBottom: 20 },
  buttonDisabled: { backgroundColor: "#ccc", opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "bold", fontFamily: "Poppins_400Regular" },
  successOverlay: { flex: 1, backgroundColor: "rgba(2, 21, 2, 0.9)" },
  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  successCard: { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 12, padding: 40, alignItems: "center", width: "100%", maxWidth: 350, position: "relative" },
  successTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", color: "#333", marginBottom: 40, lineHeight: 24, fontFamily: "Poppins_400Regular" },
  successIconContainer: { position: "relative", width: 200, height: 200, justifyContent: "center", alignItems: "center", marginBottom: 40 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#82B921", justifyContent: "center", alignItems: "center", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  checkmark: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  decorativeCircle: { position: "absolute", borderRadius: 50 },
  loginButton: { backgroundColor: "#213400", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%" },
  loginButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginRight: 10, fontFamily: "Poppins_400Regular" },
  loginArrow: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
