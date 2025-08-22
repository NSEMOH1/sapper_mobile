import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LoanEnrollmentFlow from "@/features/loan-enrollment";
import { router } from "expo-router";

export default function HomeScreen() {
  const [showLoanModal, setShowLoanModal] = useState(false);

  const handleSavings = () => {
    router.push("/(tabs)/savings");
  };

  const handleMakePayment = () => {
    router.push("/payments");
  };

  // const financialRecords = [
  //   {
  //     id: 1,
  //     title: "Regular Loan",
  //     amount: "107,265",
  //     status: "active",
  //     color: "white",
  //     bgColor: "#53B175",
  //   },
  //   {
  //     id: 2,
  //     title: "Housing Loan",
  //     status: "Coming Soon",
  //     color: "white",
  //     bgColor: "#444012",
  //   },
  //   {
  //     id: 3,
  //     title: "Commodity Loan",
  //     status: "Coming Soon",
  //     color: "white",
  //     bgColor: "#057392",
  //   },
  //   {
  //     id: 4,
  //     title: "Emergency Loan",
  //     status: "Coming Soon",
  //     color: "white",
  //     bgColor: "#EBB9A1",
  //   },
  //   {
  //     id: 5,
  //     title: "Home Appliance Loan",
  //     status: "Coming Soon",
  //     color: "white",
  //     bgColor: "#060402",
  //   },
  // ];

  const savingsCards = [
    {
      id: 1,
      title: "Total Savings",
      amount: "₦ 3,000,000",
      bgColor: "#6A7814",
    },
    {
      id: 2,
      title: "Loan Balance",
      amount: "₦ 1,500,000",
      bgColor: "#6A1447",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
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

        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            Good afternoon <Text style={styles.nameText}>James</Text> 👋
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carouselContainer}
          pagingEnabled
        >
          {savingsCards.map((card) => (
            <View
              key={card.id}
              style={[styles.savingsCard, { backgroundColor: card.bgColor }]}
            >
              <Text style={styles.savingsTitle}>{card.title}</Text>
              <Text style={styles.savingsAmount}>{card.amount}</Text>
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.viewMoreButton} onPress={handleMakePayment}>
                  <Text style={styles.viewMoreText}>Pay Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewMoreButton} onPress={handleMakePayment}>
                  <Text style={styles.viewMoreText}>Pay Off</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Page Indicator */}
        {/* <View style={styles.pageIndicator}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View> */}

        {/* Quick Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Transactions</Text>
          <View style={styles.quickTransactions}>
            <TouchableOpacity
              style={styles.transactionItem}
              onPress={handleMakePayment}
            >
              <View
                style={[styles.transactionIcon, { backgroundColor: "white" }]}
              >
                <Image source={require("../../assets/images/payment.png")} />
              </View>
              <Text style={styles.transactionText}>Make{"\n"}Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.transactionItem}
              onPress={handleSavings}
            >
              <View
                style={[styles.transactionIcon, { backgroundColor: "white" }]}
              >
                <Image source={require("../../assets/images/file.png")} />
              </View>
              <Text style={styles.transactionText}>
                Savings{"\n"}Adjustment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.transactionItem}
              onPress={() => setShowLoanModal(true)}
            >
              <View
                style={[styles.transactionIcon, { backgroundColor: "white" }]}
              >
                <Image source={require("../../assets/images/pig.png")} />
              </View>
              <Text style={styles.transactionText}>Take a{"\n"}Loan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Financial Record
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Record</Text>
          <View style={styles.financialGrid}>
            {financialRecords.map((record, index) => (
              <TouchableOpacity
                key={record.id}
                style={[
                  styles.financialCard,
                  { backgroundColor: record.bgColor },
                  index === 0 ? styles.largeCard : styles.smallCard,
                ]}
              >
                <View style={styles.financialHeader}>
                  <Text
                    style={[styles.financialTitle, { color: record.color }]}
                  >
                    {record.title}
                  </Text>
                  <TouchableOpacity>
                    <TrendingUp size={16} color={record.color} />
                  </TouchableOpacity>
                </View>

                {record.amount ? (
                  <Text
                    style={[styles.financialAmount, { color: record.color }]}
                  >
                    {record.amount}
                  </Text>
                ) : (
                  <Text
                    style={[styles.financialStatus, { color: record.color }]}
                  >
                    {record.status}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {/* <View style={styles.transactionFilters}>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>May</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>3days</Text>
              </TouchableOpacity>
            </View> */}
          </View>

          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyText}>No recent transactions</Text>
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
    backgroundColor: "#f8f9fa",
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
  greeting: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },
  greetingText: {
    fontSize: 18,
    color: "#333",
  },
  nameText: {
    fontWeight: "bold",
  },
  carouselContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  savingsCard: {
    width: 300,
    marginRight: 10,
    padding: 25,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  savingsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  savingsAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  viewMoreButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
  },
  viewMoreText: {
    color: "#fff",
    fontSize: 14,
  },
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  activeDot: {
    backgroundColor: "#8BC34A",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  quickTransactions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "#fff",
  },
  transactionItem: {
    alignItems: "center",
    flex: 1,
    borderRadius: 15,
    padding: 20,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    lineHeight: 18,
  },
  financialGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  financialCard: {
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  largeCard: {
    width: "48%",
    height: 100,
  },
  smallCard: {
    width: "48%",
    height: 100,
  },
  financialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  financialTitle: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginRight: 5,
  },
  financialAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  financialStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  transactionFilters: {
    flexDirection: "row",
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  emptyTransactions: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});
