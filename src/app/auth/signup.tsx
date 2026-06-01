import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Building, Calendar, CreditCard, Home, Key, Mail,
  MapPin, MapPinHouse, MessageCircleQuestion, MessageSquare,
  Phone, ShieldUser, Smile, User, UsersRound, VenusAndMars,
} from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

const ACCENT = "#213400";

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

  // ── Progress ──────────────────────────────────────────
  const totalSubSteps = steps.reduce((acc, s) => acc + s.substeps, 0);
  const completedSubSteps = (() => {
    let count = 0;
    for (let i = 0; i < step - 1; i++) count += steps[i].substeps;
    count += subStep - 1;
    return count;
  })();
  const progressPct = totalSubSteps > 0 ? (completedSubSteps / totalSubSteps) * 100 : 0;

  // ── Success Screen ──────────────────────────────────────
  if (showSuccess) {
    return (
      <SafeAreaView style={s.safeArea}>
        <View style={s.successOverlay}>
          <View style={s.successContainer}>
            <View style={s.successIconLarge}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            <Text style={s.successTitle}>Account Created{'\n'}Successfully</Text>
            <Text style={s.successSub}>
              Your registration has been submitted for approval. You'll be notified once your account is activated.
            </Text>
            <TouchableOpacity style={s.successBtn} onPress={handleLogin}>
              <LinearGradient
                colors={[ACCENT, "#2E4A0B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.successBtnGrad}
              >
                <Text style={s.successBtnText}>Proceed to Login</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Progress Bar ──────────────────────────── */}
        <View style={s.progressHeader}>
          <TouchableOpacity onPress={prevStep} style={s.backCircle}>
            <Ionicons name="arrow-back" size={22} color="#1A1A2E" />
          </TouchableOpacity>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={s.progressLabel}>{Math.round(progressPct)}%</Text>
        </View>

        {/* ── Stepper ───────────────────────────────── */}
        <View style={s.stepper}>
          {steps.map(({ label }, i) => {
            const idx = i + 1;
            const isActive = step === idx;
            const isDone = step > idx;
            return (
              <View key={i} style={s.stepItem}>
                <View style={[s.stepCircle, isActive && s.stepCircleActive, isDone && s.stepCircleDone]}>
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : (
                    <Text style={[s.stepNum, isActive && s.stepNumActive]}>{idx}</Text>
                  )}
                </View>
                <Text style={[s.stepLabel, isActive && s.stepLabelActive, isDone && s.stepLabelDone]}>
                  {label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── Form Card ─────────────────────────────── */}
        <View style={s.formCard}>
          {step === 1 && subStep === 1 && (
            <View>
              <Text style={s.formTitle}>Personal Information</Text>
              <Text style={s.formSub}>Basic details about you</Text>
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
              <Text style={s.formTitle}>Contact Information</Text>
              <Text style={s.formSub}>How to reach you</Text>
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
                <FormInput label="Transaction Pin *" icon={Key} placeholder="Enter 4-digit pin" secureTextEntry keyboardType="numeric" maxLength={4} value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
            </View>
          )}

          {step === 1 && subStep === 3 && (
            <View>
              <Text style={s.formTitle}>Financial Information</Text>
              <Text style={s.formSub}>Your banking details</Text>
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
                  <FormPicker label="LGA *" icon={MapPin}
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
                <FormInput label="Monthly Deduction *" icon={CreditCard} placeholder="Enter amount" keyboardType="numeric" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
            </View>
          )}

          {step === 2 && subStep === 1 && (
            <View>
              <Text style={s.formTitle}>Next of Kin</Text>
              <Text style={s.formSub}>Basic information</Text>
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
              <Text style={s.formTitle}>Next of Kin</Text>
              <Text style={s.formSub}>Contact information</Text>
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
              <Text style={s.formTitle}>Upload Documents</Text>
              <Text style={s.formSub}>Provide your credentials to complete registration</Text>
              <DocumentUpload label="Upload your picture *" value={profilePicture} onChange={setProfilePicture} isImage />
              <DocumentUpload label="NIN of Next of Kin *" value={ninDocument} onChange={setNinDocument} />
              <DocumentUpload label="Valid means of ID *" value={idDocument} onChange={setIdDocument} />
              <DocumentUpload label="Personnel ID Card *" value={personnelId} onChange={setPersonnelId} />
            </View>
          )}

          {step === 4 && (
            <View>
              <Text style={s.formTitle}>Security Question</Text>
              <Text style={s.formSub}>Setup account recovery</Text>
              <Controller control={control} name="securityQuestion" render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormPicker label="Security Question *" icon={MessageCircleQuestion} items={securityQuestions} placeholder="Select Security Question" value={value} onValueChange={onChange} error={error?.message} />
              )} />
              <Controller control={control} name="securityAnswer" render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormInput label="Security Answer *" icon={MessageSquare} placeholder="Enter security answer" value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
              )} />
            </View>
          )}

          {/* ── Navigation ──────────────────────────── */}
          <TouchableOpacity
            style={[s.proceedBtn, isPending && s.proceedBtnDisabled]}
            onPress={nextStep}
            disabled={isPending}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isPending ? ["#9CA3AF", "#9CA3AF"] : [ACCENT, "#2E4A0B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.proceedGrad}
            >
              <Text style={s.proceedText}>
                {isPending ? "Submitting..." : step === 4 ? "Submit" : "Continue"}
              </Text>
              {!isPending && <Ionicons name="arrow-forward" size={20} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F7FA" },
  container: { padding: 20, paddingTop: 12, paddingBottom: 40 },

  // ── Progress Header ──────────────────────────────────
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: ACCENT,
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: ACCENT,
    minWidth: 36,
    textAlign: "right",
  },

  // ── Stepper ──────────────────────────────────────────
  stepper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  stepItem: { alignItems: "center", flex: 1 },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepCircleDone: {
    backgroundColor: "#4CAF50",
  },
  stepNum: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#9CA3AF",
  },
  stepNumActive: { color: "#fff" },
  stepLabel: {
    fontSize: 9,
    fontFamily: "Poppins_500Medium",
    color: "#9CA3AF",
    textAlign: "center",
  },
  stepLabelActive: { color: ACCENT, fontFamily: "Poppins_600SemiBold" },
  stepLabelDone: { color: "#4CAF50" },

  // ── Form Card ────────────────────────────────────────
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 4,
  },
  formSub: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },

  // ── Proceed Button ───────────────────────────────────
  proceedBtn: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  proceedBtnDisabled: { opacity: 0.6 },
  proceedGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  proceedText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },

  // ── Success ─────────────────────────────────────────
  successOverlay: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  successContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 36,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  successIconLarge: { marginBottom: 20 },
  successTitle: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 30,
  },
  successSub: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  successBtn: {
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  successBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  successBtnText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },
});
