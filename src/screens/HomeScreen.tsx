import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 명세서의 GET /dashboard 응답 형태를 반영하되, goals가 비어있는 상태 가정[cite: 1]
export default function HomeScreen({ navigation }: any) {
  // MVP 데이터 시뮬레이션 일단 고정 값으로 넣어둠 [cite: 1]
  const [dashboardData] = useState({
    nickname: "아이엠",
    dailyBudget: 50000,
    todaySpend: 0,
    remainingBudget: 50000,
    usageRate: 0.0,
    goals: [], //아직 목표 설정이 안 된 상태[cite: 1]
    wallet: {
      living: "50,000원",
      free: "83,000원",
      goal: "0원",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/*글로우 배경 */}
      <View style={[styles.blurCircle, styles.mintGlow]} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 헤더 영역: 닉네임 + 알림 아이콘[cite: 1] */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{dashboardData.nickname}님 👋</Text>
            <Text style={styles.subGreeting}>
              오늘도 목표를 향해 가는 중이에요
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("Notification")}
          >
            <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* empty 카드 전체를 터치 가능한 영역으로 만듦 */}
        <TouchableOpacity
          style={styles.emptyGoalCard}
          activeOpacity={0.8} // 누를 때 살짝 투명해지는 효과
          onPress={() => navigation.navigate("AddGoal")} // 이전의 AddGoalScreen으로 이동
        >
          <View style={styles.textContainer}>
            <Text style={styles.emptyCardTitle}>
              아직 등록된 목표가 없어요 🎯
            </Text>
            <Text style={styles.emptyCardSub}>
              iM AgentiX와 함께 새 저축 목표를 세워볼까요?
            </Text>
          </View>

          {/* 아래 버튼은 그대로 유지하되, 카드의 어디를 눌러도 이동되므로 시각적 유도 역할*/}
          <View style={styles.addGoalButton}>
            <Text style={styles.addGoalButtonText}>새로운 목표 추가하기</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={{ marginLeft: 6 }}
            />
          </View>
        </TouchableOpacity>

        {/* 내 토큰 지갑 섹션  */}
        <View style={styles.walletSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>내 토큰 지갑</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>전체 보기 </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.walletCard}>
            {/* 1. 생활비 */}
            <View style={styles.walletItem}>
              <View style={[styles.iconBox, { backgroundColor: "#F59E0B" }]}>
                <Ionicons name="wallet" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>생활비</Text>
                <Text style={styles.walletDesc}>오늘 사용 가능</Text>
              </View>
              <Text style={styles.walletAmount}>
                {dashboardData.wallet.living}
              </Text>
            </View>
            <View style={styles.divider} />

            {/* 2. 자유 토큰 */}
            <View style={styles.walletItem}>
              <View style={[styles.iconBox, { backgroundColor: "#3B82F6" }]}>
                <Ionicons name="key" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>자유 토큰</Text>
                <Text style={styles.walletDesc}>언제든 사용 가능</Text>
              </View>
              <Text style={styles.walletAmount}>
                {dashboardData.wallet.free}
              </Text>
            </View>
            <View style={styles.divider} />

            {/* 3. GOAL 토큰 */}
            <View style={styles.walletItem}>
              <View style={[styles.iconBox, { backgroundColor: "#10B981" }]}>
                <Ionicons name="trophy" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>GOAL 토큰</Text>
                <Text style={styles.walletDesc}>적립된 목표 자산</Text>
              </View>
              <Text style={styles.walletAmount}>
                {dashboardData.wallet.goal}
              </Text>
            </View>

            {/* 토큰 조정하기 알약 버튼 */}
            <TouchableOpacity style={styles.adjustButton}>
              <Ionicons
                name="options-outline"
                size={18}
                color="#475569"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.adjustButtonText}>토큰 조정하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  blurCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 100,
    elevation: 20,
  },
  mintGlow: {
    bottom: 50,
    right: -100,
    backgroundColor: "#00cc99",
    shadowColor: "#00cc99",
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  /* 목표 부재 상태(Empty) UI 카드 디자인 */
  emptyGoalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  emptyCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  emptyCardSub: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  addGoalButton: {
    flexDirection: "row",
    height: 48,
    backgroundColor: "#00bfa5", // 시그니처 비비드 그린[cite: 1]
    borderRadius: 24,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00bfa5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addGoalButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  /* 지갑 섹션 */
  walletSection: {
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  walletCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  walletInfo: {
    flex: 1,
    marginLeft: 14,
  },
  walletName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  walletDesc: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  walletAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  adjustButton: {
    flexDirection: "row",
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  adjustButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
});
