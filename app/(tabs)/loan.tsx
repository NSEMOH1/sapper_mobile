import React, { JSX, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import LoanEnrollmentFlow from "@/features/loan-enrollment";

interface LoanRecord {
  type: string;
  amount: string;
  percentage: number;
  current: string;
  total: string;
}

interface LoanCategory {
  title: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
}

export default function Loan() {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const loanRecords: LoanRecord[] = [
    {
      type: "Regular Loan",
      amount: "₦1,000,175.00",
      percentage: 75,
      current: "3,000,525.00",
      total: "100%",
    },
    {
      type: "Emergency Loan",
      amount: "Coming Soon",
      percentage: 0,
      current: "3,000,525.00",
      total: "100%",
    },
    {
      type: "Commodity Loan",
      amount: "Coming Soon",
      percentage: 0,
      current: "3,000,525.00",
      total: "100%",
    },
    {
      type: "Emergency Loan",
      amount: "Coming Soon",
      percentage: 0,
      current: "3,000,525.00",
      total: "100%",
    },
  ];

  const loanCategories: LoanCategory[] = [
    {
      title: "Regular Loan",
      amount: "200k",
      status: "57% utilized",
      statusColor: "#4CAF50",
      icon: "account-balance-wallet",
      iconColor: "#4CAF50",
      backgroundColor: "#E8F5E8",
    },
    {
      title: "Home Appliance Loan",
      amount: "200k",
      status: "Coming soon",
      statusColor: "#9E9E9E",
      icon: "home",
      iconColor: "#9E9E9E",
      backgroundColor: "#F5F5F5",
    },
    {
      title: "Commodity Loan",
      amount: "200k",
      status: "Coming soon",
      statusColor: "#9E9E9E",
      icon: "shopping-cart",
      iconColor: "#FF9800",
      backgroundColor: "#FFF8E1",
    },
    {
      title: "Housing Loan",
      amount: "200k",
      status: "Coming soon",
      statusColor: "#4CAF50",
      icon: "home",
      iconColor: "#4CAF50",
      backgroundColor: "#E8F5E8",
    },
  ];

  const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    size = 80,
  }) => {
    const radius = (size - 10) / 2;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Create multiple small circles to simulate progress arc
    const createProgressCircles = () => {
      const circles = [];
      const totalDots = 20;
      const filledDots = Math.round((percentage / 100) * totalDots);

      for (let i = 0; i < totalDots; i++) {
        const angle = (i / totalDots) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * normalizedRadius;
        const y = Math.sin(angle) * normalizedRadius;

        circles.push(
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                left: size / 2 + x - 3,
                top: size / 2 + y - 3,
                backgroundColor: i < filledDots ? "#4CAF50" : "#E0E0E0",
              },
            ]}
          />
        );
      }
      return circles;
    };

    return (
      <View style={[styles.progressContainer, { width: size, height: size }]}>
        {/* Background circle */}
        <View
          style={[
            styles.progressBackground,
            {
              width: size - strokeWidth,
              height: size - strokeWidth,
              borderRadius: (size - strokeWidth) / 2,
              borderWidth: strokeWidth / 4,
            },
          ]}
        />

        {createProgressCircles()}

        <View
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={styles.progressPercentage}>{percentage}%</Text>
        </View>
      </View>
    );
  };

  const renderLoanRecord = (loan: LoanRecord, index: number): JSX.Element => (
    <View key={index} style={styles.loanRecordCard}>
      <View style={styles.loanRecordHeader}>
        <Text style={styles.loanRecordType}>{loan.type}</Text>
        <Text style={styles.loanRecordAmount}>{loan.amount}</Text>
      </View>
      <View style={styles.progressInfoContainer}>
        <CircularProgress percentage={loan.percentage} />
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>0%</Text>
          <Text style={styles.progressSubtext}>{loan.current}</Text>
          <Text style={styles.progressTotal}>{loan.total}</Text>
        </View>
      </View>
    </View>
  );

  const renderLoanCategory = (
    category: LoanCategory,
    index: number
  ): JSX.Element => (
    <TouchableOpacity key={index} style={styles.categoryCard} onPress={() => setShowLoanModal(true)}>
      <Text style={styles.categoryTitle}>{category.title}</Text>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: category.backgroundColor },
        ]}
      >
        <MaterialIcons
          name={category.icon}
          size={24}
          color={category.iconColor}
        />
      </View>
      <Text style={styles.categoryAmount}>{category.amount}</Text>
      <Text style={[styles.categoryStatus, { color: category.statusColor }]}>
        {category.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="menu" size={24} color="#333" />
          <Ionicons
            name="search"
            size={24}
            color="#333"
            style={{ marginLeft: 20 }}
          />
        </View>
        <View style={styles.headerRight}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JA</Text>
          </View>
          <Ionicons
            name="notifications"
            size={24}
            color="#333"
            style={{ marginLeft: 10 }}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Good afternoon <Text style={styles.name}>James</Text> 👋
          </Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Loan Balance</Text>
          <Text style={styles.balanceAmount}>₦ 5,000,000</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.payButton}>
              <Ionicons name="card" size={16} color="#fff" />
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.payOffButton}>
              <Ionicons name="download" size={16} color="#fff" />
              <Text style={styles.payOffButtonText}>Pay Off</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loan Records Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Records</Text>
          <View style={styles.loanRecordsGrid}>
            {loanRecords.map((loan, index) => renderLoanRecord(loan, index))}
          </View>
        </View>

        {/* Loan Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Category</Text>
          <View style={styles.categoriesGrid}>
            {loanCategories.map((category, index) =>
              renderLoanCategory(category, index)
            )}
          </View>
        </View>
      </ScrollView>
      <LoanEnrollmentFlow
        visible={showLoanModal}
        onClose={() => setShowLoanModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  },
  scrollView: {
    flex: 1,
  },
  greetingContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    color: "#333",
  },
  name: {
    fontWeight: "bold",
  },
  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: "#6B8E23",
    borderRadius: 45,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
    gap: 12,
  },
  payButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  payOffButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  payOffButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  loanRecordsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  loanRecordCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loanRecordHeader: {
    marginBottom: 16,
  },
  loanRecordType: {
    fontSize: 17,
    color: "#333",
    marginBottom: 4,
    fontWeight: "bold",
  },
  loanRecordAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  progressInfoContainer: {
    alignItems: "center",
  },
  progressContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBackground: {
    borderColor: "#E0E0E0",
    position: "absolute",
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  progressInfo: {
    alignItems: "center",
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  progressSubtext: {
    fontSize: 10,
    color: "#999",
  },
  progressTotal: {
    fontSize: 10,
    color: "#999",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  categoryAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  categoryStatus: {
    fontSize: 12,
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: "#999",
  },
});
