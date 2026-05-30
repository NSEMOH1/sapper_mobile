import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { FileText, Upload, X } from "lucide-react-native";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

export interface Document {
  uri: string;
  name: string;
  type?: string;
}

interface DocumentUploadProps {
  label: string;
  value: Document | null;
  onChange: (doc: Document | null) => void;
  isImage?: boolean;
  error?: string;
}

export function DocumentUpload({ label, value, onChange, isImage, error }: DocumentUploadProps) {
  const pickFile = async () => {
    try {
      if (isImage) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

        if (!result.canceled && result.assets[0]) {
          const asset = result.assets[0];
          onChange({
            uri: asset.uri,
            name: asset.fileName || `profile_${Date.now()}.jpg`,
            type: asset.mimeType || "image/jpeg",
          });
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: "*/*",
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets?.[0]) {
          const asset = result.assets[0];
          onChange({
            uri: asset.uri,
            name: asset.name || `document_${Date.now()}`,
            type: asset.mimeType || "application/pdf",
          });
        }
      }
    } catch {
      Alert.alert("Error", "Failed to select file");
    }
  };

  const isImageFile =
    value?.name?.match(/\.(jpg|jpeg|png|gif)$/i) ||
    value?.type?.startsWith("image/");

  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={labelStyle}>{label}</Text>

      {value ? (
        <View style={previewContainerStyle}>
          <View style={previewStyle}>
            {isImageFile ? (
              <Image source={{ uri: value.uri }} style={previewImageStyle} resizeMode="contain" />
            ) : (
              <FileText size={24} color="#666" />
            )}
            <Text style={previewTextStyle} numberOfLines={1}>
              {value.name}
            </Text>
          </View>
          <TouchableOpacity style={removeButtonStyle} onPress={() => onChange(null)}>
            <X size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={uploadBoxStyle} onPress={pickFile}>
          <Upload size={24} color="#666" />
          <Text style={uploadTextStyle}>Tap to select file</Text>
        </TouchableOpacity>
      )}

      {error ? <Text style={errorStyle}>{error}</Text> : null}
    </View>
  );
}

const labelStyle = {
  fontSize: 12,
  color: "#666",
  marginBottom: 5,
  fontFamily: "Poppins_400Regular",
} as const;

const uploadBoxStyle = {
  borderWidth: 2,
  borderColor: "#000",
  borderStyle: "dashed" as const,
  borderRadius: 8,
  padding: 20,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  backgroundColor: "#f9f9f9",
};

const uploadTextStyle = {
  marginTop: 8,
  color: "#666",
  fontSize: 12,
  textAlign: "center" as const,
  fontFamily: "Poppins_400Regular",
};

const previewContainerStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  backgroundColor: "#f0f0f0",
  padding: 10,
  borderRadius: 8,
};

const previewStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  flex: 1,
};

const previewImageStyle = {
  width: 40,
  height: 40,
  marginRight: 10,
  borderRadius: 4,
};

const previewTextStyle = {
  flex: 1,
  fontSize: 12,
  color: "#666",
  fontFamily: "Poppins_400Regular",
};

const removeButtonStyle = {
  backgroundColor: "#ff4444",
  width: 24,
  height: 24,
  borderRadius: 12,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  marginLeft: 10,
};

const errorStyle = {
  color: "#dc2626",
  fontSize: 11,
  marginTop: 2,
  fontFamily: "Poppins_400Regular",
};
