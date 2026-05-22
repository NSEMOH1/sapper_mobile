import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getInitials } from "@/constants/data";
import { useAuthStore } from "@/hooks/useAuth";

export default function Profile() {
  const router = useRouter();
  const { user } = useAuthStore()

  const links = [
    { id: 1, title: "Edit Profile", route: "/profile/edit" },
    { id: 2, title: "Edit Next of Kin", route: "/profile/next-of-kin" },
    { id: 3, title: "Termination", route: "/profile/termination" },
    { id: 4, title: "Request Refund", route: "/profile/refund" },
    { id: 5, title: "Change Password", route: "/profile/change-password" },
    { id: 6, title: "Account Statement", route: "/profile/account-statement" },
    { id: 7, title: "Contact Us", route: "/profile/contact-us" },
    { id: 8, title: "Logout", route: "/auth/login" },
  ];

  const handlePress = (link: any) => {
    if (link.title === "Logout") {
      router.replace(link.route);
    } else {
      router.push(link.route);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.avatarText}>
            {getInitials(user?.first_name || "")}
          </Text>
          <Ionicons
            name="notifications"
            size={24}
            color="#333"
            style={{ marginLeft: 10 }}
          />
        </View>
      </View>

      <View style={styles.menu}>
        {links.map((link) => (
          <TouchableOpacity
            key={link.id}
            style={styles.menuItem}
            onPress={() => handlePress(link)}
          >
            <Text style={styles.menuText}>{link.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  headerRight: { flexDirection: "row", alignItems: "center" },
  menu: { padding: 20 },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: { fontSize: 18, color: "#333", fontFamily: "Poppins_400Regular" },
});
