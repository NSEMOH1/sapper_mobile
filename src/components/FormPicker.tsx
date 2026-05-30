import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import RNPickerSelect, { type Item } from "react-native-picker-select";

interface FormPickerProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onValueChange: (value: string) => void;
  items: Item[];
  placeholder?: string;
  error?: string;
}

export function FormPicker({
  label,
  icon: Icon,
  value,
  onValueChange,
  items,
  placeholder = "Select",
  error,
}: FormPickerProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={labelStyle}>{label}</Text>
      <View style={[inputContainerStyle, !!error && inputErrorStyle]}>
        <Icon size={18} color="black" />
        <RNPickerSelect
          value={value}
          onValueChange={onValueChange}
          placeholder={{ label: placeholder, value: "" }}
          items={items}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
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

const errorStyle = {
  color: "#dc2626",
  fontSize: 11,
  marginTop: 2,
  fontFamily: "Poppins_400Regular",
};

const pickerSelectStyles = {
  inputIOS: {
    flex: 1,
    paddingVertical: 8,
    color: "#000",
    fontFamily: "Poppins_400Regular",
  },
  inputAndroid: {
    flex: 1,
    paddingVertical: 8,
    color: "#000",
    fontFamily: "Poppins_400Regular",
  },
};
