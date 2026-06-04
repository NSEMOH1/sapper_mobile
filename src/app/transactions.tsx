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
import { useTheme } from "@/hooks/use-theme";

export default function TransactionsPage() {
  const { colors } = useTheme();
  const { transactions, loading, error, refetch } = useTransactionsData();

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[s.title, { color: colors.text }]}>Transactions</Text>

        <TouchableOpacity onPress={refetch} style={s.refreshBtn}>
          <Ionicons name="refresh-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {loading ? (
          <View style={s.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={s.centerBox}>
            <Ionicons name="cloud-offline-outline" size={48} color={colors.textSecondary} />
            <Text style={[s.errorText, { color: colors.error }]}>{error}</Text>
            <TouchableOpacity style={[s.retryBtn, { backgroundColor: colors.primary }]} onPress={refetch}>
              <Text style={[s.retryText, { color: colors.onPrimary }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : transactions.length === 0 ? (
          <View style={s.centerBox}>
            <Ionicons name="receipt-outline" size={48} color={colors.textSecondary} />
            <Text style={[s.emptyText, { color: colors.textSecondary }]}>No transactions yet</Text>
            <Text style={[s.emptySub, { color: colors.textSecondary }]}>Your transaction history will appear here</Text>
          </View>
        ) : (
          <View style={[s.list, { backgroundColor: colors.card }]}>
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} color={colors} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { 
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
   },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  refreshBtn: { padding: 6 },
  list: {
    marginHorizontal: 16,
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
    marginTop: 12,
    marginBottom: 16,
  },
  retryBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    marginTop: 6,
    textAlign: "center",
  },
});
