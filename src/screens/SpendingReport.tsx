import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

// Base design dimensions for consistent layout scaling
const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

export default function SpendingReport({ navigation }: any) {
  const { width, height } = useWindowDimensions();

  // Responsive scaling factors
  const widthScale = width / BASE_SCREEN_WIDTH;
  const heightScale = height / BASE_SCREEN_HEIGHT;
  const sizeScale = width / BASE_SCREEN_WIDTH;

  // Selected date state (defaults to Tuesday the 23rd)
  const [selectedDate, setSelectedDate] = useState(23);

  // Calendar dates mock data
  const calendarDays = [
    { dayName: "일", date: 21, hasLabel: true, labelAmount: "- 00,000" },
    { dayName: "월", date: 22, hasLabel: false },
    { dayName: "화", date: 23, hasLabel: true, labelAmount: "- 00,000" },
    { dayName: "수", date: 24, hasLabel: false },
    { dayName: "목", date: 25, hasLabel: false },
    { dayName: "금", date: 26, hasLabel: false },
    { dayName: "토", date: 27, hasLabel: false },
  ];

  // Transactions mock data (matching SpendAlert data for consistency)
  const transactions = [
    {
      date: "4월 23일 화요일",
      items: [
        { name: "요기요", time: "20:10", amount: "- 12,000원" },
        { name: "배달의민족", time: "08:38", amount: "- 9,000원" },
      ],
    },
  ];

  // Category spending donut chart data configuration
  const donutRadius = 38;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const categoryData = [
    { name: "식비", percentage: 55, color: "#014C43" }, // Dark Forest Green
    { name: "주거 · 통신", percentage: 20, color: "#00B395" }, // Teal
    { name: "교통 · 자동차", percentage: 12, color: "#00E676" }, // Bright Mint Green
    { name: "의료", percentage: 8, color: "#A7F3D0" }, // Lighter Mint
    { name: "그 외 n개 카테고리", percentage: 5, color: "#CBD5E1" }, // Light Grey
  ];

  // Bar chart monthly comparison data
  const barChartData = [
    { month: "10월", value: 30, amount: "00,000", isCurrent: false },
    { month: "11월", value: 72, amount: "00,000", isCurrent: false },
    { month: "12월", value: 45, amount: "00,000", isCurrent: false },
    { month: "1월", value: 60, amount: "00,000", isCurrent: false },
    { month: "2월", value: 92, amount: "00,000", isCurrent: false },
    { month: "3월", value: 20, amount: "00,000", isCurrent: false },
    { month: "이번 달", value: 50, amount: "00,000", isCurrent: true },
  ];

  // Cumulative offset calculator for donut slices
  let accumulatedPercent = 0;

  // Responsive dynamic styles calculated dynamically
  const dynamicStyles = StyleSheet.create({
    contentContainer: {
      paddingBottom: 80 * heightScale, // Extra padding at the bottom for tab bar
    },
    header: {
      paddingTop: 16 * heightScale,
      paddingBottom: 12 * heightScale,
      paddingHorizontal: 24 * sizeScale,
    },
    logo: {
      fontSize: 16 * sizeScale,
    },
    monthSelectorContainer: {
      paddingHorizontal: 24 * sizeScale,
      marginTop: 8 * heightScale,
      marginBottom: 16 * heightScale,
    },
    monthText: {
      fontSize: 24 * sizeScale,
      marginRight: 6 * sizeScale,
    },
    amountText: {
      fontSize: 28 * sizeScale,
      marginTop: 4 * heightScale,
    },
    calendarContainer: {
      paddingHorizontal: 24 * sizeScale,
      paddingVertical: 12 * heightScale,
      marginBottom: 20 * heightScale,
    },
    calendarDayColumn: {
      width: 44 * sizeScale,
    },
    dayLabel: {
      fontSize: 13 * sizeScale,
      marginBottom: 8 * heightScale,
    },
    dateCircle: {
      width: 32 * sizeScale,
      height: 32 * sizeScale,
      borderRadius: (32 * sizeScale) / 2,
    },
    dateText: {
      fontSize: 15 * sizeScale,
    },
    subLabelText: {
      fontSize: 8 * sizeScale,
      marginTop: 4 * heightScale,
    },
    transactionsCard: {
      marginHorizontal: 24 * sizeScale,
      padding: 20 * sizeScale,
      borderRadius: 24 * sizeScale,
      marginBottom: 24 * heightScale,
    },
    dateHeader: {
      fontSize: 12 * sizeScale,
      marginBottom: 12 * heightScale,
    },
    avatarCircle: {
      width: 40 * sizeScale,
      height: 40 * sizeScale,
      borderRadius: (40 * sizeScale) / 2,
      marginRight: 12 * sizeScale,
    },
    merchantName: {
      fontSize: 14 * sizeScale,
    },
    timeText: {
      fontSize: 11 * sizeScale,
      marginTop: 2 * heightScale,
    },
    txAmountText: {
      fontSize: 15 * sizeScale,
    },
    categoryCard: {
      marginHorizontal: 24 * sizeScale,
      padding: 20 * sizeScale,
      borderRadius: 24 * sizeScale,
      marginBottom: 24 * heightScale,
    },
    sectionHeader: {
      marginBottom: 16 * heightScale,
    },
    sectionTitle: {
      fontSize: 18 * sizeScale,
    },
    detailLinkText: {
      fontSize: 12 * sizeScale,
    },
    donutChartContainer: {
      width: 120 * sizeScale,
      height: 120 * sizeScale,
      marginRight: 16 * sizeScale,
    },
    legendRow: {
      marginBottom: 8 * heightScale,
    },
    legendDot: {
      fontSize: 10 * sizeScale,
      marginRight: 8 * sizeScale,
    },
    legendText: {
      fontSize: 13 * sizeScale,
    },
    compareCard: {
      marginHorizontal: 24 * sizeScale,
      padding: 20 * sizeScale,
      borderRadius: 24 * sizeScale,
    },
    compareHeader: {
      paddingVertical: 12 * heightScale,
      paddingHorizontal: 16 * sizeScale,
      borderRadius: 12 * sizeScale,
      marginBottom: 24 * heightScale,
    },
    compareTitle: {
      fontSize: 16 * sizeScale,
    },
    barWrapper: {
      width: 40 * sizeScale,
    },
    barValue: {
      fontSize: 9 * sizeScale,
      marginBottom: 6 * heightScale,
    },
    barContainer: {
      height: 100 * heightScale,
      width: 22 * sizeScale,
      borderRadius: 6 * sizeScale,
      marginBottom: 8 * heightScale,
    },
    barLabel: {
      fontSize: 11 * sizeScale,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* App Logo Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.logo, dynamicStyles.logo]}>
          <Text style={styles.logoDot}>iM</Text> Agent
          <Text style={styles.logoAccent}>iX</Text>
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={dynamicStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Dropdown and Total Amount Selection */}
        <View style={dynamicStyles.monthSelectorContainer}>
          <View style={styles.monthRow}>
            <TouchableOpacity
              style={styles.monthSelectorBtn}
              activeOpacity={0.7}
            >
              <Text style={[styles.monthText, dynamicStyles.monthText]}>
                4월
              </Text>
              <Ionicons name="chevron-down" size={20} color="#1F2937" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewAllBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("SpendingDate")}
            >
              <Text style={[styles.viewAllText, dynamicStyles.detailLinkText]}>
                전체보기 &gt;
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.amountText, dynamicStyles.amountText]}>
            000,000원
          </Text>
        </View>

        {/* Weekly Calendar Horizontal Strip */}
        <View
          style={[styles.calendarContainer, dynamicStyles.calendarContainer]}
        >
          <View style={styles.flexRowBetween}>
            {calendarDays.map((item, index) => {
              const isSelected = selectedDate === item.date;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDayColumn,
                    dynamicStyles.calendarDayColumn,
                  ]}
                  onPress={() => setSelectedDate(item.date)}
                  activeOpacity={0.8}
                >
                  {/* Day Name (일, 월, 화, ...) */}
                  <Text
                    style={[
                      styles.dayLabel,
                      dynamicStyles.dayLabel,
                      isSelected && styles.selectedDayLabel,
                    ]}
                  >
                    {item.dayName}
                  </Text>

                  {/* Date circular button */}
                  <View
                    style={[
                      styles.dateCircle,
                      dynamicStyles.dateCircle,
                      isSelected && styles.selectedDateCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        dynamicStyles.dateText,
                        isSelected
                          ? styles.selectedDateText
                          : styles.unselectedDateText,
                      ]}
                    >
                      {item.date}
                    </Text>
                  </View>

                  {/* Optional Spent Amount label under the date */}
                  <Text
                    style={[
                      styles.subLabelText,
                      dynamicStyles.subLabelText,
                      isSelected && styles.selectedSubLabel,
                    ]}
                  >
                    {item.hasLabel ? item.labelAmount : " "}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Transaction History Card List */}
        <View style={[styles.transactionsCard, dynamicStyles.transactionsCard]}>
          {transactions.map((group, groupIdx) => (
            <View key={groupIdx} style={styles.dateGroup}>
              <Text style={[styles.dateHeader, dynamicStyles.dateHeader]}>
                {group.date}
              </Text>
              {group.items.map((tx, txIdx) => (
                <View
                  key={txIdx}
                  style={[
                    styles.transactionRow,
                    txIdx > 0 && { marginTop: 12 },
                  ]}
                >
                  <View
                    style={[styles.avatarCircle, dynamicStyles.avatarCircle]}
                  />
                  <View style={styles.transactionInfo}>
                    <Text
                      style={[styles.merchantName, dynamicStyles.merchantName]}
                    >
                      {tx.name}
                    </Text>
                    <Text style={[styles.timeText, dynamicStyles.timeText]}>
                      {tx.time}
                    </Text>
                  </View>
                  <Text
                    style={[styles.txAmountText, dynamicStyles.txAmountText]}
                  >
                    {tx.amount}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Category Spending Donut Chart Section */}
        <View style={[styles.categoryCard, dynamicStyles.categoryCard]}>
          <View style={[styles.flexRowBetween, dynamicStyles.sectionHeader]}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              카테고리별 소비
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("SpendingCategory")}
            >
              <Text
                style={[styles.detailLinkText, dynamicStyles.detailLinkText]}
              >
                자세히 보기 &gt;
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryContentRow}>
            {/* SVG Donut Chart */}
            <View style={dynamicStyles.donutChartContainer}>
              <Svg width="100%" height="100%" viewBox="0 0 100 100">
                <G transform="rotate(-90 50 50)">
                  {categoryData.map((category, index) => {
                    const strokeLength =
                      (category.percentage / 100) * donutCircumference;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += strokeLength;

                    return (
                      <Circle
                        key={index}
                        cx="50"
                        cy="50"
                        r={donutRadius}
                        fill="transparent"
                        stroke={category.color}
                        strokeWidth="14"
                        strokeDasharray={[strokeLength, donutCircumference]}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  })}
                </G>
              </Svg>
            </View>

            {/* Chart Legend List */}
            <View style={styles.legendContainer}>
              {categoryData.map((category, index) => (
                <View
                  key={index}
                  style={[styles.legendRow, dynamicStyles.legendRow]}
                >
                  <Text
                    style={[dynamicStyles.legendDot, { color: category.color }]}
                  >
                    ◆
                  </Text>
                  <Text style={[styles.legendText, dynamicStyles.legendText]}>
                    {category.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Monthly Spent Average Comparison Bar Chart */}
        <View style={[styles.compareCard, dynamicStyles.compareCard]}>
          {/* Average status text badge */}
          <View style={[styles.compareHeader, dynamicStyles.compareHeader]}>
            <Text style={[styles.compareTitle, dynamicStyles.compareTitle]}>
              평균보다 <Text style={styles.highlightText}>12,500원</Text> 더
              썼어요
            </Text>
          </View>

          {/* Bar Chart Container */}
          <View style={styles.barChartContainer}>
            {barChartData.map((bar, index) => (
              <View
                key={index}
                style={[styles.barWrapper, dynamicStyles.barWrapper]}
              >
                {/* Numeric value shown above each bar */}
                <Text
                  style={[
                    styles.barValue,
                    dynamicStyles.barValue,
                    bar.isCurrent
                      ? styles.activeBarValue
                      : styles.inactiveBarValue,
                  ]}
                >
                  {bar.amount}
                </Text>

                {/* Vertical Bar shape */}
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barContainer,
                      dynamicStyles.barContainer,
                      bar.isCurrent ? styles.activeBar : styles.inactiveBar,
                      { height: `${bar.value}%` },
                    ]}
                  />
                </View>

                {/* X-axis labels (Month name) */}
                <Text
                  style={[
                    styles.barLabel,
                    dynamicStyles.barLabel,
                    bar.isCurrent
                      ? styles.activeBarLabel
                      : styles.inactiveBarLabel,
                  ]}
                >
                  {bar.month}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  logo: {
    color: "#151B1E",
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  logoDot: {
    color: "#009D8B",
  },
  logoAccent: {
    color: "#009D8B",
  },
  scrollView: {
    flex: 1,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  monthSelectorBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthText: {
    color: "#1F2937",
    fontWeight: "bold",
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    color: "#94A3B8",
  },
  amountText: {
    color: "#111827",
    fontWeight: "bold",
  },
  flexRowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  calendarDayColumn: {
    alignItems: "center",
  },
  dayLabel: {
    color: "#94A3B8",
    fontWeight: "600",
    textAlign: "center",
  },
  selectedDayLabel: {
    color: "#1F2937",
    fontWeight: "bold",
  },
  dateCircle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  selectedDateCircle: {
    backgroundColor: "#E2E8F0", // Grey circle background
  },
  dateText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedDateText: {
    color: "#1F2937",
  },
  unselectedDateText: {
    color: "#6B7280",
  },
  subLabelText: {
    color: "#94A3B8",
    textAlign: "center",
  },
  selectedSubLabel: {
    color: "#475569",
    fontWeight: "bold",
  },
  transactionsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontWeight: "bold",
    color: "#94A3B8",
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    backgroundColor: "#CBD5E1",
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontWeight: "bold",
    color: "#334155",
  },
  timeText: {
    color: "#94A3B8",
  },
  txAmountText: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  detailLinkText: {
    color: "#94A3B8",
  },
  categoryContentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendContainer: {
    flex: 1,
    justifyContent: "center",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendText: {
    color: "#334155",
    fontWeight: "600",
  },
  compareCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  compareHeader: {
    backgroundColor: "#EDF5F3", // Light shaded mint-purple background matching design
    justifyContent: "center",
    alignItems: "center",
  },
  compareTitle: {
    fontWeight: "bold",
    color: "#1F2937",
  },
  highlightText: {
    color: "#009D8B", // Brand green highlight
    fontWeight: "bold",
  },
  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    paddingHorizontal: 4,
  },
  barWrapper: {
    alignItems: "center",
  },
  barValue: {
    textAlign: "center",
  },
  activeBarValue: {
    color: "#009D8B",
    fontWeight: "bold",
  },
  inactiveBarValue: {
    color: "#94A3B8",
  },
  barTrack: {
    height: 80,
    justifyContent: "flex-end",
  },
  barContainer: {
    width: "100%",
  },
  activeBar: {
    backgroundColor: "#00B395", // Active brand green
  },
  inactiveBar: {
    backgroundColor: "#E2E8F0", // Inactive grey
  },
  barLabel: {
    textAlign: "center",
    marginTop: 4,
  },
  activeBarLabel: {
    color: "#009D8B",
    fontWeight: "bold",
  },
  inactiveBarLabel: {
    color: "#94A3B8",
  },
});
