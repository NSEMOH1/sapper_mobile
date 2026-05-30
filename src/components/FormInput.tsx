import type { LucideIcon } from "lucide-react-native";
import { type TextInputProps, Text, TextInput, View } from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export function FormInput({ label, icon: Icon, error, ...props }: FormInputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={labelStyle}>{label}</Text>
      <View style={[inputContainerStyle, !!error && inputErrorStyle]}>
        <Icon size={18} color="black" />
        <TextInput
          placeholderTextColor="#999"
          style={inputStyle}
          {...props}
        />
      </View>
      {error ? <Text style={errorStyle}>{error}</Text> : null}
    </View>
  );
}

const labelStyle = {
  fontSize: 12,
  color: "#333",
  marginBottom: 5,
  fontWeight: "500",
  fontFamily: "Poppins_400Regular",
} as const;

const inputContainerStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  borderWidth: 1,
  borderColor: "#000",
  paddingHorizontal: 10,
  borderRadius: 8,
  minHeight: 40,
};

const inputErrorStyle = {
  borderColor: "#dc2626",
};

const inputStyle = {
  flex: 1,
  padding: 8,
  fontFamily: "Poppins_400Regular",
};

const errorStyle = {
  color: "#dc2626",
  fontSize: 11,
  marginTop: 2,
  fontFamily: "Poppins_400Regular",
};
