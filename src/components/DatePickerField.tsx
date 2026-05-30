import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import type { LucideIcon } from "lucide-react-native";

interface DatePickerFieldProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (date: string) => void;
  error?: string;
}

export function DatePickerField({ label, icon: Icon, value, onChange, error }: DatePickerFieldProps) {
  const [visible, setVisible] = useState(false);

  const handleConfirm = (date: Date) => {
    onChange(date.toISOString().split("T")[0]);
    setVisible(false);
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={labelStyle}>{label}</Text>
      <TouchableOpacity
        style={[inputContainerStyle, !!error && inputErrorStyle]}
        onPress={() => setVisible(true)}
      >
        <Icon size={18} color="black" />
        <Text style={[valueStyle, !value && placeholderStyle]}>
          {value || "Select date of birth"}
        </Text>
      </TouchableOpacity>
      {error ? <Text style={errorStyle}>{error}</Text> : null}
      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
        maximumDate={new Date()}
      />
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

const valueStyle = {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 8,
  fontFamily: "Poppins_400Regular",
  color: "#000",
};

const placeholderStyle = {
  color: "#999",
};

const errorStyle = {
  color: "#dc2626",
  fontSize: 11,
  marginTop: 2,
  fontFamily: "Poppins_400Regular",
};
