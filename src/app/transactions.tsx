import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTransactionsData, TransactionItem } from "@/features/transaction";

const BG = "#F5F7FA";

export default function TransactionsPage() {
  const { transactions, loading, error, refetch } = useTransactionsData();

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={s.title}>Transactions</Text>
        <TouchableOpacity onPress={refetch} style={s.refreshBtn}>
          <Ionicons name="refresh-outline" size={20} color="#213400" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {loading ? (
          <View style={s.centerBox}>
            <ActivityIndicator size="large" color="#213400" />
          </View>
        ) : error ? (
          <View style={s.centerBox}>
            <Ionicons name="cloud-offline-outline" size={48} color="#9CA3AF" />
            <Text style={s.errorText}>{error}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={refetch}>
              <Text style={s.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : transactions.length === 0 ? (
          <View style={s.centerBox}>
            <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
            <Text style={s.emptyText}>No transactions yet</Text>
            <Text style={s.emptySub}>Your transaction history will appear here</Text>
          </View>
        ) : (
          <View style={s.list}>
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { paddingBottom: 32 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#1A1A2E",
  },
  refreshBtn: { padding: 6 },

  list: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  centerBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#EF4444",
    marginTop: 12,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: "#213400",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center",
  },
});
