import React from "react";
import { SafeAreaView, Text, TextInput, StyleSheet, View } from "react-native";

export default function NextOfKin() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Next of Kin</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value="Jane Doe" editable={false} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Relationship</Text>
        <TextInput style={styles.input} value="Sister" editable={false} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value="+0987654321" editable={false} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    color: "#555",
  },
});
