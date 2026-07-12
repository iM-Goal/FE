import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

export default function SpendingReport({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const widthScale = width / BASE_SCREEN_WIDTH;
  const heightScale = height / BASE_SCREEN_HEIGHT;
  const sizeScale = width / BASE_SCREEN_WIDTH;

  const [selectedDate, setSelectedDate] = useState(23);
  const [loading, setLoading] = useState(false);

  // 🎯 실제 백엔드 연동 데이터 스테이트
  const [totalSpend, setTotalSpend] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [comparisonText, setComparisonText] = useState<string>("이번 주 소비 데이터를 불러오는 중...");
  const [highlightAmount, setHighlightAmount] = useState<string>("");

  const palette = ["#014C43", "#00B395", "#00E676", "#A7F3D0", "#CBD5E1"];

  // 📡 백엔드 주간 리포트 결합 동기화
  const fetchSpendingData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const response = await fetch("http://localhost:8080/api/spending/weekly", { method: "GET", headers });

      if (response.status === 200) {
        const weeklyJson = await response.json();
        const data = weeklyJson.data;

        if (data) {
          const total = data.totalSpend || 0;
          setTotalSpend(total);

          if (data.categories && Array.isArray(data.categories)) {
            const mappedCategories = data.categories.map((cat: any, index: number) => {
              const percent = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
              return {
                name: cat.category || `카테고리 ${index + 1}`,
                percentage: percent,
                amount: cat.amount || 0,
                color: palette[index % palette.length],
                vsLastWeek: cat.vsLastWeek || 0,
              };
            });
            setCategoryData(mappedCategories);

            // 전주 대비 지출 증감 지표 매핑 분석 로직
            const avgVs = data.categories.reduce((acc: number, cur: any) => acc + (cur.vsLastWeek || 0), 0) / (data.categories.length || 1);
            if (avgVs > 0) {
              setComparisonText("지난주 평균보다 ");
              setHighlightAmount(`${Math.round(total * avgVs).toLocaleString()}원 더`);
            } else {
              setComparisonText("지난주 평균보다 ");
              setHighlightAmount(`${Math.abs(Math.round(total * avgVs)).toLocaleString()}원 덜`);
            }
          }
        }
      } else {
        applyFallbackData();
      }
    } catch (error) {
      console.log("🚨 소비 리포트 API 연동 실패 (폴백 처리):", error);
      applyFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const applyFallbackData = () => {
    setTotalSpend(245000);
    setCategoryData([
      { name: "식비", percentage: 55, color: "#014C43", amount: 134750 },
      { name: "주거 · 통신", percentage: 20, color: "#00B395", amount: 49000 },
      { name: "교통 · 자동차", percentage: 12, color: "#00E676", amount: 29400 },
      { name: "의료", percentage: 8, color: "#A7F3D0", amount: 19600 },
      { name: "그 외", percentage: 5, color: "#CBD5E1", amount: 12250 },
    ]);
    setComparisonText("평균보다 ");
    setHighlightAmount("12,500원 더");
  };

  useEffect(() => {
    fetchSpendingData();
  }, []);

  const calendarDays = [
    { dayName: "일", date: 21, hasLabel: true, labelAmount: "- 32,000" },
    { dayName: "월", date: 22, hasLabel: false },
    { dayName: "화", date: 23, hasLabel: true, labelAmount: "- 21,000" },
    { dayName: "수", date: 24, hasLabel: false },
    { dayName: "목", date: 25, hasLabel: false },
    { dayName: "금", date: 26, hasLabel: false },
    { dayName: "토", date: 27, hasLabel: false },
  ];

  const transactions = [
    {
      date: "이번 주 주요 소비 내역",
      items: [
        { name: "요기요", time: "20:10", amount: "- 12,000원" },
        { name: "배달의민족", time: "08:38", amount: "- 9,000원" },
      ],
    },
  ];

  const barChartData = [
    { month: "1주차", value: 30, amount: "120,000", isCurrent: false },
    { month: "2주차", value: 72, amount: "280,000", isCurrent: false },
    { month: "3주차", value: 45, amount: "190,000", isCurrent: false },
    { month: "이번 주", value: 60, amount: totalSpend.toLocaleString(), isCurrent: true },
  ];

  const donutRadius = 38;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedPercent = 0;

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={[styles.header, { paddingTop: 16 * heightScale, paddingBottom: 12 * heightScale, paddingHorizontal: 24 * sizeScale }]}>
          <Text style={[styles.logo, { fontSize: 16 * sizeScale }]}>
            <Text style={styles.logoDot}>iM</Text> Agent <Text style={styles.logoAccent}>iX</Text>
          </Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 80 * heightScale }} showsVerticalScrollIndicator={false}>
          {loading ? (
              <View style={{ paddingVertical: 40, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#009D8B" />
              </View>
          ) : (
              <>
                <View style={{ paddingHorizontal: 24 * sizeScale, marginTop: 8 * heightScale, marginBottom: 16 * heightScale }}>
                  <View style={styles.monthRow}>
                    <TouchableOpacity style={styles.monthSelectorBtn} activeOpacity={0.7}>
                      <Text style={[styles.monthText, { fontSize: 24 * sizeScale, marginRight: 6 * sizeScale }]}>이번 주 리포트</Text>
                      <Ionicons name="chevron-down" size={20} color="#1F2937" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.7} onPress={() => navigation.navigate("SpendingDate")}>
                      <Text style={[styles.viewAllText, { fontSize: 12 * sizeScale }]}>달력보기 &gt;</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.amountText, { fontSize: 28 * sizeScale, marginTop: 4 * heightScale }]}>{totalSpend.toLocaleString()}원</Text>
                </View>

                <View style={[styles.calendarContainer, { paddingHorizontal: 24 * sizeScale, paddingVertical: 12 * heightScale, marginBottom: 20 * heightScale }]}>
                  <View style={styles.flexRowBetween}>
                    {calendarDays.map((item, index) => {
                      const isSelected = selectedDate === item.date;
                      return (
                          <TouchableOpacity key={index} style={[{ width: 44 * sizeScale }, styles.calendarDayColumn]} onPress={() => setSelectedDate(item.date)} activeOpacity={0.8}>
                            <Text style={[styles.dayLabel, { fontSize: 13 * sizeScale, marginBottom: 8 * heightScale }, isSelected && styles.selectedDayLabel]}>{item.dayName}</Text>
                            <View style={[styles.dateCircle, { width: 32 * sizeScale, height: 32 * sizeScale, borderRadius: (32 * sizeScale) / 2 }, isSelected && styles.selectedDateCircle]}>
                              <Text style={[styles.dateText, { fontSize: 15 * sizeScale }, isSelected ? styles.selectedDateText : styles.unselectedDateText]}>{item.date}</Text>
                            </View>
                            <Text style={[styles.subLabelText, { fontSize: 8 * sizeScale, marginTop: 4 * heightScale }, isSelected && styles.selectedSubLabel]}>{item.hasLabel ? item.labelAmount : " "}</Text>
                          </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={[styles.transactionsCard, { marginHorizontal: 24 * sizeScale, padding: 20 * sizeScale, borderRadius: 24 * sizeScale, marginBottom: 24 * heightScale }]}>
                  {transactions.map((group, groupIdx) => (
                      <View key={groupIdx} style={styles.dateGroup}>
                        <Text style={[styles.dateHeader, { fontSize: 12 * sizeScale, marginBottom: 12 * heightScale }]}>{group.date}</Text>
                        {group.items.map((tx, txIdx) => (
                            <View key={txIdx} style={[styles.transactionRow, txIdx > 0 && { marginTop: 12 }]}>
                              <View style={[styles.avatarCircle, { width: 40 * sizeScale, height: 40 * sizeScale, borderRadius: (40 * sizeScale) / 2, marginRight: 12 * sizeScale }]} />
                              <View style={styles.transactionInfo}>
                                <Text style={[styles.merchantName, { fontSize: 14 * sizeScale }]}>{tx.name}</Text>
                                <Text style={[styles.timeText, { fontSize: 11 * sizeScale, marginTop: 2 * heightScale }]}>{tx.time}</Text>
                              </View>
                              <Text style={[styles.txAmountText, { fontSize: 15 * sizeScale }]}>{tx.amount}</Text>
                            </View>
                        ))}
                      </View>
                  ))}
                </View>

                <View style={[styles.categoryCard, { marginHorizontal: 24 * sizeScale, padding: 20 * sizeScale, borderRadius: 24 * sizeScale, marginBottom: 24 * heightScale }]}>
                  <View style={[styles.flexRowBetween, { marginBottom: 16 * heightScale }]}>
                    <Text style={[styles.sectionTitle, { fontSize: 18 * sizeScale }]}>카테고리별 소비</Text>
                    {/* 🎯 중요: 파라미터를 들고 세부 페이지로 점프 */}
                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("SpendingCategory", { categoryData, totalSpend })}>
                      <Text style={[styles.detailLinkText, { fontSize: 12 * sizeScale }]}>자세히 보기 &gt;</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.categoryContentRow}>
                    <View style={{ width: 120 * sizeScale, height: 120 * sizeScale, marginRight: 16 * sizeScale }}>
                      <Svg width="100%" height="100%" viewBox="0 0 100 100">
                        <G transform="rotate(-90 50 50)">
                          {categoryData.map((category, index) => {
                            const strokeLength = (category.percentage / 100) * donutCircumference;
                            const strokeDashoffset = -accumulatedPercent;
                            accumulatedPercent += strokeLength;

                            return (
                                <Circle key={index} cx="50" cy="50" r={donutRadius} fill="transparent" stroke={category.color} strokeWidth="14" strokeDasharray={[strokeLength, donutCircumference]} strokeDashoffset={strokeDashoffset} />
                            );
                          })}
                        </G>
                      </Svg>
                    </View>

                    <View style={styles.legendContainer}>
                      {categoryData.map((category, index) => (
                          <View key={index} style={[styles.legendRow, { marginBottom: 8 * heightScale }]}>
                            <Text style={[{ fontSize: 10 * sizeScale, marginRight: 8 * sizeScale }, { color: category.color }]}>◆</Text>
                            <Text style={[styles.legendText, { fontSize: 13 * sizeScale }]}>{category.name} ({category.percentage}%)</Text>
                          </View>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={[styles.compareCard, { marginHorizontal: 24 * sizeScale, padding: 20 * sizeScale, borderRadius: 24 * sizeScale }]}>
                  <View style={[styles.compareHeader, { paddingVertical: 12 * heightScale, paddingHorizontal: 16 * sizeScale, borderRadius: 12 * sizeScale, marginBottom: 24 * heightScale }]}>
                    <Text style={[styles.compareTitle, { fontSize: 16 * sizeScale }]}>
                      {comparisonText} <Text style={styles.highlightText}>{highlightAmount}</Text> 썼어요
                    </Text>
                  </View>

                  <View style={styles.barChartContainer}>
                    {barChartData.map((bar, index) => (
                        <View key={index} style={[{ width: 50 * sizeScale }, styles.barWrapper]}>
                          <Text style={[styles.barValue, { fontSize: 9 * sizeScale, marginBottom: 6 * heightScale }, bar.isCurrent ? styles.activeBarValue : styles.inactiveBarValue]}>{bar.amount}</Text>
                          <View style={styles.barTrack}>
                            <View style={[styles.barContainer, { height: 100 * heightScale, width: 22 * sizeScale, borderRadius: 6 * sizeScale, marginBottom: 8 * heightScale }, bar.isCurrent ? styles.activeBar : styles.inactiveBar, { height: `${bar.value}%` }]} />
                          </View>
                          <Text style={[styles.barLabel, { fontSize: 11 * sizeScale }, bar.isCurrent ? styles.activeBarLabel : styles.inactiveBarLabel]}>{bar.month}</Text>
                        </View>
                    ))}
                  </View>
                </View>
              </>
          )}
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "flex-start", borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  logo: { color: "#151B1E", fontWeight: "800", letterSpacing: -0.5 },
  logoDot: { color: "#009D8B" },
  logoAccent: { color: "#009D8B" },
  scrollView: { flex: 1 },
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" },
  monthSelectorBtn: { flexDirection: "row", alignItems: "center" },
  monthText: { color: "#1F2937", fontWeight: "bold" },
  viewAllBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  viewAllText: { color: "#94A3B8" },
  amountText: { color: "#111827", fontWeight: "bold" },
  flexRowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  calendarContainer: { backgroundColor: "#FFFFFF", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#F1F5F9" },
  calendarDayColumn: { alignItems: "center" },
  dayLabel: { color: "#94A3B8", fontWeight: "600", textAlign: "center" },
  selectedDayLabel: { color: "#1F2937", fontWeight: "bold" },
  dateCircle: { justifyContent: "center", alignItems: "center", backgroundColor: "transparent" },
  selectedDateCircle: { backgroundColor: "#E2E8F0" },
  dateText: { fontWeight: "bold", textAlign: "center" },
  selectedDateText: { color: "#1F2937" },
  unselectedDateText: { color: "#6B7280" },
  subLabelText: { color: "#94A3B8", textAlign: "center" },
  selectedSubLabel: { color: "#475569", fontWeight: "bold" },
  transactionsCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#F1F5F9", shadowColor: "#000000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  dateGroup: { marginBottom: 20 },
  dateHeader: { fontWeight: "bold", color: "#94A3B8" },
  transactionRow: { flexDirection: "row", alignItems: "center" },
  avatarCircle: { backgroundColor: "#CBD5E1" },
  transactionInfo: { flex: 1 },
  merchantName: { fontWeight: "bold", color: "#334155" },
  timeText: { color: "#94A3B8" },
  txAmountText: { fontWeight: "bold", color: "#1E293B" },
  categoryCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#F1F5F9", shadowColor: "#000000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  sectionTitle: { fontWeight: "bold", color: "#1E293B" },
  detailLinkText: { color: "#94A3B8" },
  categoryContentRow: { flexDirection: "row", alignItems: "center" },
  legendContainer: { flex: 1, justifyContent: "center" },
  legendRow: { flexDirection: "row", alignItems: "center" },
  legendText: { color: "#334155", fontWeight: "600" },
  compareCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#F1F5F9", shadowColor: "#000000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  compareHeader: { backgroundColor: "#EDF5F3", justifyContent: "center", alignItems: "center" },
  compareTitle: { fontWeight: "bold", color: "#1F2937" },
  highlightText: { color: "#009D8B", fontWeight: "bold" },
  barChartContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 140, paddingHorizontal: 4 },
  barWrapper: { alignItems: "center" },
  barValue: { textAlign: "center" },
  activeBarValue: { color: "#009D8B", fontWeight: "bold" },
  inactiveBarValue: { color: "#94A3B8" },
  barTrack: { height: 80, justifyContent: "flex-end" },
  barContainer: { width: "100%" },
  activeBar: { backgroundColor: "#00B395" },
  inactiveBar: { backgroundColor: "#E2E8F0" },
  barLabel: { textAlign: "center", marginTop: 4 },
  activeBarLabel: { color: "#009D8B", fontWeight: "bold" },
  inactiveBarLabel: { color: "#94A3B8" },
});