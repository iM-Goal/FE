import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation, route }: any) {
  // 상태 관리 State
  const [hasGoal, setHasGoal] = useState(false);
  const [nickname, setNickname] = useState('아이엠');
  const [goalData, setGoalData] = useState<any>(null);
  const [walletAmount, setWalletAmount] = useState('0');
  const [loading, setLoading] = useState(true);

  // 오늘의 일일 가용 금액 및 남은 가용 금액 상태 관리
  // 🎯 [수치 통일]: 초기 상태는 지출 0원, 남은 금액 50,000원 전액 보존!
  const [todaySpending, setTodaySpending] = useState({
    dailyBudget: 50000,
    remainingBudget: 50000,
    todaySpend: 0,
    usageRate: 0.0
  });

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const localGoalCreated = await AsyncStorage.getItem('demo_goal_created');
      const localLockedStr = await AsyncStorage.getItem('demo_locked_amount');
      const hasAcceptedLocalMission = localLockedStr !== null;

      if (localGoalCreated === 'true') {
        setHasGoal(true);
        setNickname('아이엠');
        setGoalData({
          title: '제주도 푸른 바다 여행 ✈️',
          targetAmount: 300000,
          currentAmount: 35000,
          achievementRate: 11.6
        });

        // 🎯 [수치 통일 핵심 분기]
        if (hasAcceptedLocalMission) {
          // 🔥 [트리거 이후]: 가짜 결제 15,000원이 반영된 상태로 정확히 매핑!
          const baseLocked = parseInt(localLockedStr || '15000', 10);
          setTodaySpending({
            dailyBudget: 50000,
            remainingBudget: 35000,     // 🎯 50,000 - 15,000 = 35,000원 남음!
            todaySpend: 15000,         // 🎯 방금 쓴 15,000원 딱 표시!
            usageRate: 30.0            // 🎯 사용률 30%로 게이지 연동
          });
          setWalletAmount(baseLocked.toLocaleString());
        } else {
          // ❄️ [가짜 결제 전]: 아주 깨끗하고 안전한 가용 상태 (0원 지출)
          setTodaySpending({
            dailyBudget: 50000,
            remainingBudget: 50000,
            todaySpend: 0,
            usageRate: 0.0
          });
          setWalletAmount('0');
        }
      } else {
        setHasGoal(false);
        setWalletAmount('0');
      }

      // 백엔드 연결 시 동기화 (오프라인 시 작동 생략)
      try {
        const [dashboardRes, goalsRes, depositsRes, todaySpendingRes] = await Promise.all([
          fetch('http://localhost:8080/api/dashboard', { method: 'GET', headers }),
          fetch('http://localhost:8080/api/goals', { method: 'GET', headers }),
          fetch('http://localhost:8080/api/deposits', { method: 'GET', headers }),
          fetch('http://localhost:8080/api/spending/today', { method: 'GET', headers })
        ]);

        if (goalsRes.status === 200) {
          const goalsJson = await goalsRes.json();
          const goalDataList = goalsJson.data;

          if (goalDataList && goalDataList.shortGoal) {
            const short = goalDataList.shortGoal;
            setGoalData({
              title: short.itemName,
              targetAmount: short.targetAmount,
              currentAmount: short.currentAmount,
              achievementRate: short.achievementRate
            });
            setHasGoal(true);
            await AsyncStorage.setItem('demo_goal_created', 'true');
          }
        }
      } catch (err) {
        // 백엔드 미구동 시 예외 가드
      }

    } catch (error) {
      console.log('🚨 홈 상태 처리 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
      useCallback(() => {
        fetchHomeData();
      }, [route.params?.registeredSuccess])
  );

  const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleCreateMockGoal = async () => {
    await AsyncStorage.setItem('demo_goal_created', 'true');
    Alert.alert("🎉 목표 설정 완료", "제주도 푸른 바다 여행 목표가 새롭게 시작됩니다!");
    fetchHomeData();
  };

  const renderEmptyState = () => (
      <View style={styles.emptyContainer}>
        <View style={styles.logoHeader}>
          <Text style={styles.logo}>
            <Text style={styles.logoDot}>iM</Text> Bank <Text style={styles.logoAccent}>AgentiX</Text>
          </Text>
        </View>
        <View style={styles.emptyHeader}>
          <Text style={styles.welcomeText}>아이엠님 👋</Text>
          <Text style={styles.subWelcomeText}>나만의 특별한 재무 페이스메이커</Text>
        </View>
        <View style={styles.emptyCenter}>
          <View style={styles.emptyCharacterWrapper}>
            <Image source={require('../../assets/main_blue.png')} style={styles.emptyCharacterImage} />
          </View>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyMainText}>아직 설정된 목표가 없어요</Text>
            <Text style={styles.emptySubText}>이루고 싶은 목표를 등록해보세요! AI 페이스메이커가 페이스를 잡아드릴게요.</Text>
            <TouchableOpacity style={styles.emptyAddButton} onPress={handleCreateMockGoal}>
              <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.emptyAddButtonText}>목표 설정하러 가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );

  const renderActiveState = () => {
    const title = goalData?.title || '나의 저축 목표';
    const targetAmount = goalData?.targetAmount || 0;
    const currentAmount = goalData?.currentAmount || 0;
    const achievementRate = goalData?.achievementRate || 0;

    // 🎯 [수정]: 30% 지출은 '임계 위험'까지는 아니므로 알림 조건을 유연하게 변경하거나 메시지를 조율합니다.
    const isSpent = todaySpending.todaySpend > 0;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.logoHeader, { paddingHorizontal: 0, marginBottom: 16 }]}>
            <Text style={styles.logo}>
              <Text style={styles.logoDot}>iM</Text> Bank <Text style={styles.logoAccent}>AgentiX</Text>
            </Text>
          </View>

          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>{nickname}님 👋</Text>
              {isSpent ? (
                  <Text style={[styles.subWelcomeText, { color: '#004B87', fontWeight: 'bold' }]}>
                    🔔 방금 새로운 배달 지출이 감지되었습니다.
                  </Text>
              ) : (
                  <Text style={styles.subWelcomeText}>오늘도 목표를 향해 가는 중이에요</Text>
              )}
            </View>
            <TouchableOpacity style={styles.notiButton} onPress={() => navigation.navigate('ChatScreen')}>
              <View style={styles.notiBadgeContainer}>
                <Ionicons name="notifications-outline" size={30} color="#004B87" />
                {isSpent && <View style={styles.notiDot} />}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.characterSection}>
            <View style={styles.speechBubble}>
              {isSpent ? (
                  <Text style={[styles.speechText, { color: '#004B87' }]}>
                    앗, 방금 소비로 페이스가 급해졌어요! AI 락업 미션 카드를 확인하세요! 🚨
                  </Text>
              ) : (
                  <>
                    <Text style={styles.speechText}>현재 소비 페이스가 아주 안전합니다! 🎉</Text>
                    <Text style={[styles.speechText, { marginTop: 2, color: '#009D8B' }]}>이대로 목표 금액까지 함께 달려가요.</Text>
                  </>
              )}
              <View style={styles.speechTriangle} />
            </View>
            <View style={styles.characterRow}>
              <Image source={require('../../assets/main_blue.png')} style={styles.avatarImage} />
              <View style={styles.islandContainer}>
                <Image source={require('../../assets/palm.png')} style={styles.islandImage} />
              </View>
            </View>
          </View>

          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>{title}</Text>
            <View style={styles.goalInfoRow}>
              <View style={styles.goalDetails}>
                <Text style={styles.detailLabelText}>목표 금액 : {formatNumber(targetAmount)}원</Text>
                <Text style={[styles.detailAmountText, { marginTop: 8 }]}>
                  <Text style={styles.mintHighlightText}>{formatNumber(currentAmount)}원</Text> 모았어요.
                </Text>
              </View>
              <View style={styles.percentContainer}>
                <Text style={styles.percentText}>{achievementRate}%</Text>
              </View>
            </View>

            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${achievementRate}%` }]} />
            </View>

            <View style={styles.spendingIndicatorContainer}>
              <View style={styles.spendingIndicatorRow}>
                <View style={styles.indicatorLeft}>
                  <Ionicons name="calendar-outline" size={16} color="#4B5563" style={{ marginRight: 6 }} />
                  <Text style={styles.indicatorLabel}>오늘 지출 가용 예산</Text>
                </View>
                <Text style={styles.indicatorValue}>{formatNumber(todaySpending.dailyBudget)}원</Text>
              </View>

              <View style={[styles.spendingIndicatorRow, { marginTop: 10 }]}>
                <View style={styles.indicatorLeft}>
                  <Ionicons
                      name={isSpent ? "alert-circle" : "wallet-outline"}
                      size={16}
                      color={isSpent ? "#004B87" : "#009D8B"}
                      style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.indicatorLabel, isSpent && { color: '#004B87', fontWeight: '700' }]}>
                    오늘 남은 가용 금액
                  </Text>
                </View>
                {/* 🎯 [수정]: 50,000원에서 15,000원 뺀 35,000원이 예쁘게 찍힙니다! */}
                <Text style={[styles.indicatorValue, { fontSize: 18 }, isSpent ? { color: '#004B87' } : { color: '#009D8B' }]}>
                  {formatNumber(todaySpending.remainingBudget)}원
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.detailButton} onPress={() => navigation.navigate('GoalDetail')}>
              <Text style={styles.detailButtonText}>자세한 페이스메이커 차트 보기 &gt;</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>디지털 토큰 자산</Text>
          <TouchableOpacity activeOpacity={0.9} style={styles.walletCard} onPress={() => navigation.navigate('DepositDetail')}>
            <View style={styles.walletHeader}>
              <View style={styles.walletTitleRow}>
                <View style={styles.tokenIconCircle}><Ionicons name="lock-closed" size={14} color="#FFFFFF" /></View>
                <View>
                  <Text style={styles.walletName}>iMKRW</Text>
                  <Text style={styles.walletSub}>과소비 제어 스마트 계약 락업 자산</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#004B87" />
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>락업 보증금 총액</Text>
              <Text style={styles.walletAmount}>{walletAmount} 원</Text>
            </View>
            <View style={styles.infoBadgeRow}>
              <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>스마트 리워드머니</Text></View>
              <Text style={styles.clickGuideText}>미션 및 만기일 확인 &gt;</Text>
            </View>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>예금 자산</Text>
          <View style={styles.normalWalletContainer}>
            <View style={styles.normalTokenRow}>
              <View style={styles.normalLeftRow}>
                <View style={[styles.normalDot, { backgroundColor: '#004B87' }]} />
                <Text style={styles.normalTokenTitle}>iM 주거래 자유예금 / 생활비</Text>
              </View>
              <Text style={styles.normalTokenAmount}>148,000 원</Text>
            </View>
          </View>
        </ScrollView>
    );
  };

  return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#FFFFFF', '#F4F9F9', '#EBF5F5']} style={StyleSheet.absoluteFillObject} />
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <LinearGradient colors={['rgba(0, 157, 139, 0.15)', 'rgba(0, 157, 139, 0.03)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0.1, y: 0.1 }} style={styles.hugeGlowCircle} />
        </View>
        {hasGoal ? renderActiveState() : renderEmptyState()}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  logoHeader: { alignItems: "flex-start", paddingHorizontal: 4, marginBottom: 20 },
  logo: { color: "#111827", fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  logoDot: { color: "#009D8B" },
  logoAccent: { color: "#004B87", fontWeight: '900' },
  emptyContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  emptyHeader: { marginBottom: -160 },
  emptyCenter: { flex: 0.8, justifyContent: 'center', alignItems: 'center', width: '100%' },
  emptyCharacterWrapper: { width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginBottom: -40, zIndex: 10 },
  emptyCharacterImage: { width: 160, height: 160, resizeMode: 'contain', opacity: 1 },
  emptyCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 28, paddingVertical: 32, paddingHorizontal: 24, borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center', shadowColor: '#000000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  emptyMainText: { fontSize: 19, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  emptySubText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 26, fontWeight: '500' },
  emptyAddButton: { flexDirection: 'row', backgroundColor: '#009D8B', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16, alignItems: 'center', shadowColor: '#009D8B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  emptyAddButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#111827', letterSpacing: -0.5 },
  subWelcomeText: { fontSize: 13, color: '#4B5563', marginTop: 4, fontWeight: '500' },
  notiButton: { padding: 4 },
  notiBadgeContainer: { position: 'relative' },
  notiDot: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  characterSection: { alignItems: 'flex-start', marginBottom: 12, width: '100%' },
  speechBubble: { backgroundColor: '#E6F6F4', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start', position: 'relative', marginLeft: 15, borderWidth: 1, borderColor: '#B3E5E0' },
  speechText: { color: '#004B87', fontSize: 13, fontWeight: '600', textAlign: 'left', lineHeight: 18 },
  speechTriangle: { position: 'absolute', bottom: -7, left: 24, width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#E6F6F4' },
  characterRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16, marginTop: -15 },
  avatarImage: { width: 150, height: 140, resizeMode: 'contain', zIndex: 10 },
  islandImage: { width: 95, height: 95, resizeMode: 'contain' },
  islandContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 10 },

  goalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginBottom: 24, marginTop : -35 },
  goalTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  goalInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalDetails: { flex: 1 },
  detailLabelText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  detailAmountText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  mintHighlightText: { color: '#009D8B', fontWeight: '700' },
  pinkHighlightText: { color: '#FF5E62', fontWeight: '700' },
  percentContainer: { justifyContent: 'center', alignItems: 'center' },
  percentText: { fontSize: 50, fontFamily: 'IM_Hyemin-Bold', color: '#009D8B', letterSpacing: -1 },
  progressBarBackground: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginTop: 14, marginBottom: 16 },
  progressBarFill: { height: '100%', backgroundColor: '#009D8B', borderRadius: 4 },

  spendingIndicatorContainer: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9' },
  spendingIndicatorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  indicatorLeft: { flexDirection: 'row', alignItems: 'center' },
  indicatorLabel: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  indicatorValue: { fontSize: 15, fontWeight: '800', color: '#111827' },

  detailButton: { alignItems: 'center', paddingVertical: 4, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 },
  detailButtonText: { fontSize: 12, color: '#004B87', fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12, marginTop: 4, letterSpacing: -0.3 },
  walletCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1.5, borderColor: '#009D8B', shadowColor: '#009D8B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 12 },
  walletTitleRow: { flexDirection: 'row', alignItems: 'center' },
  tokenIconCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#009D8B', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  walletName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  walletSub: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '400' },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16 },
  amountLabel: { fontSize: 13, fontWeight: '500', color: '#4B5563' },
  walletAmount: { fontSize: 24, fontWeight: '800', color: '#004B87' },
  infoBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  miniBadge: { backgroundColor: '#E6F6F4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  miniBadgeText: { fontSize: 11, fontWeight: '700', color: '#009D8B' },
  clickGuideText: { fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
  normalWalletContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  normalTokenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  normalLeftRow: { flexDirection: 'row', alignItems: 'center' },
  normalDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  normalTokenTitle: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  normalTokenAmount: { fontSize: 14, fontWeight: '700', color: '#111827' },
  hugeGlowCircle: { position: 'absolute', width: 380, height: 380, borderRadius: 190, right: -100, top: 360, backgroundColor: '#C7F5F1', opacity: 0.3 }
});