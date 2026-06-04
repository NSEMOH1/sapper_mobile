import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchTransactions } from "@/services/api.service";
import type { TransactionResponseItem } from "@/services/api.service";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColor } from "@/constants/theme";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  title: string;
  category: string;
  amount: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
}

export const TransactionIcon = ({ type }: { type: "credit" | "debit" }) => {
  return (
    <View
      style={[
        styles.iconContainer,
        type === "credit" ? styles.creditIcon : styles.debitIcon,
      ]}
    >
      <Ionicons
        name={type === "credit" ? "arrow-down" : "arrow-up"}
        size={20}
        color={type === "credit" ? "#10B981" : "#EF4444"}
      />
    </View>
  );
};

export const TransactionItem = ({ transaction, color }: { transaction: Transaction, color?: any }) => (
  <TouchableOpacity style={styles.transactionItem}>
    <TransactionIcon type={transaction.type} />

    <View style={styles.transactionDetails}>
      <Text style={[styles.transactionTitle, { color: color.text }]}>{transaction.title}</Text>
      <Text style={styles.transactionCategory}>{transaction.category}</Text>
    </View>

    <View style={styles.transactionRight}>
      <Text
        style={[
          styles.transactionAmount,
          transaction.type === "credit"
            ? styles.creditAmount
            : styles.debitAmount,
        ]}
      >
        {transaction.type === "credit" ? "+" : "-"}
        {transaction.amount}
      </Text>
      <View style={styles.transactionMeta}>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
        <Text style={styles.transactionTime}> • {transaction.time}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export function useTransactionsData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions();
      const mapped = data.map(
        (transaction: TransactionResponseItem) => ({
          id: transaction.id,
          type: transaction.type as "credit" | "debit",
          title: transaction.description,
          category: transaction.reference || "General",
          amount: transaction.amount.toString(),
          date: new Date(transaction.createdAt).toLocaleDateString(),
          time: new Date(transaction.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: transaction.status as "completed" | "pending" | "failed",
        })
      );
      setTransactions(mapped);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { transactions, loading, error, refetch: load };
}

interface TransactionsModuleProps {
  onViewAll?: () => void;
  limit?: number;
}

export const TransactionsModule = ({ onViewAll, limit }: TransactionsModuleProps) => {

  const { colors } = useTheme();
    
  const { transactions, loading, error } = useTransactionsData();
  const displayed = limit ? transactions.slice(0, limit) : transactions;

  if (loading) {
    return (
      <View style={styles.section}>
        <ActivityIndicator size="small" color="#213400" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.section}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {limit ? "Recent Transactions" : "Transactions"}
        </Text>
        {onViewAll && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {displayed.length === 0 ? (
        <View style={styles.emptyTransactions}>
          <Ionicons name="receipt-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No recent transactions</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Your transaction history will appear here
          </Text>
        </View>
      ) : (
        <View style={[styles.transactionsList, { backgroundColor: colors.card }]}>
          {displayed.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} color={colors} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Poppins_700Bold",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
  },
  transactionsList: {
    borderRadius: 16,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    // backgroundColor: "#FFFFFF",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  creditIcon: {
    backgroundColor: "#D1FAE5",
  },
  debitIcon: {
    backgroundColor: "#FEE2E2",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 15,
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  creditAmount: {
    color: "#10B981",
  },
  debitAmount: {
    color: "#EF4444",
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
  },
  transactionTime: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
  },
  emptyTransactions: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
    // backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#EF4444",
    textAlign: "center",
    padding: 24,
  },
});

export default TransactionsModule;
