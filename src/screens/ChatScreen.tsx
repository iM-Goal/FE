import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ChatBubble = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.chatRow}>
      <View style={styles.avatarContainer}>
        <Image source={require('../../assets/main_blue.png')} style={styles.avatar} />
      </View>
      <View style={styles.bubbleContainer}>
        {children}
      </View>
    </View>
);

export default function ChatScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [salaryLoading, setSalaryLoading] = useState(false); // 🎯 월급 로딩 추가

  const [todaySpendData, setTodaySpendData] = useState({
    dailyBudget: 50000,
    todaySpend: 0,
    remainingBudget: 50000,
    usageRate: 0.0
  });

  const [proposals, setProposals] = useState<any[]>([]);
  const [salaryNotification, setSalaryNotification] = useState<boolean>(false); // 🎯 월급 알림 카드 노출 여부

  const checkSyncStatus = async () => {
    try {
      const localLockedStr = await AsyncStorage.getItem('demo_locked_amount');
      const localSalaryDistributed = await AsyncStorage.getItem('demo_salary_distributed');

      if (localSalaryDistributed === 'true') {
        // 월급이 이미 분배 완료된 상태라면 알림 클리어
        setSalaryNotification(false);
      }

      if (localLockedStr) {
        setTodaySpendData({
          dailyBudget: 50000,
          todaySpend: 15000,
          remainingBudget: 35000,
          usageRate: 30.0
        });
      } else {
        setTodaySpendData({
          dailyBudget: 50000,
          todaySpend: 0,
          remainingBudget: 50000,
          usageRate: 0.0
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkSyncStatus();
    });
    return unsubscribe;
  }, [navigation]);

  const handleResetDemo = async () => {
    try {
      await AsyncStorage.removeItem('demo_goal_created');
      await AsyncStorage.removeItem('demo_locked_amount');
      await AsyncStorage.removeItem('demo_locked_title');
      await AsyncStorage.removeItem('demo_locked_duration');
      await AsyncStorage.removeItem('demo_salary_distributed');
      await AsyncStorage.removeItem('demo_living_amount');
      await AsyncStorage.removeItem('demo_free_amount');
      await AsyncStorage.removeItem('demo_goal_deposit');

      setTodaySpendData({
        dailyBudget: 50000,
        todaySpend: 0,
        remainingBudget: 50000,
        usageRate: 0.0
      });
      setProposals([]);
      setSalaryNotification(false);
      Alert.alert("🔄 상태 초기화 완료", "모든 데이터가 최초 청정 상태로 리셋되었습니다.");
    } catch (e) {
      console.log(e);
    }
  };

  // 🎯 [신규 추가] 1. 월급 입금 발생 시뮬레이션 버튼 액션
  const handleTriggerSalaryPayment = () => {
    setSalaryLoading(true);

    // 시연장 긴장감 연출용 0.8초 딜레이
    setTimeout(() => {
      setSalaryLoading(false);
      Alert.alert("💰 타행 입금 감지", "iM Bank 계좌로 월급 2,300,000원이 입금되었습니다!");

      // 월급 인공지능 자전 분배 제안 카드 오픈!
      setSalaryNotification(true);
    }, 800);
  };

  // 2. 가짜 지출 결제 트리거 (기존 유지)
  const handleTriggerMockSpending = async () => {
    setTriggerLoading(true);
    setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch('http://localhost:8080/api/mock/trigger-spending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ userId: 1, merchantName: "배달의민족 (가짜 결제)", amount: 15000, category: "DELIVERY" })
        });

        setTodaySpendData({ dailyBudget: 50000, todaySpend: 15000, remainingBudget: 35000, usageRate: 30.0 });

        Alert.alert("🚨 AI 과소비 에이전트 경보!", "금일 배달음식 과소비 임계점이 포착되었습니다. 자산 락업 방어 미션을 전송합니다.");
        setProposals([
          {
            id: 999,
            category: '배달/외식',
            description: '3일 동안 배달 앱 참고 집밥 요리하기 🍳',
            proposalReason: '배달의민족 15,000원 결제로 인해 배달 카테고리 지출 속도가 4주 평균치 대비 34.5% 빨라졌습니다.',
            depositAmount: 15000,
            durationDays: 3,
            limitAmount: 3000
          }
        ]);
      } catch (error) {
        setTodaySpendData({ dailyBudget: 50000, todaySpend: 15000, remainingBudget: 35000, usageRate: 30.0 });
        setProposals([{ id: 999, category: '배달/외식', description: '3일 동안 배달 앱 참고 집밥 요리하기 🍳', proposalReason: '배달의민족 15,000원 결제로 인해 배달 카테고리 지출 속도가 4주 평균치 대비 34.5% 빨라졌습니다.', depositAmount: 15000, durationDays: 3 }]);
      } finally {
        setTriggerLoading(false);
      }
    }, 1000);
  };

  const formatNumber = (num: number) => (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <LinearGradient colors={['#F0FDF8', '#E6F6F4', '#F8FAFC']} style={StyleSheet.absoluteFillObject} />

        <View style={[styles.header, { paddingHorizontal: 16, paddingVertical: 12 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </TouchableOpacity>
          <Text style={[styles.headerLogo, { fontSize: 18, paddingLeft: 10 }]}>
            <Text style={{color: '#009D8B'}}>iM</Text> AgentiX
          </Text>
          <TouchableOpacity onPress={handleResetDemo} style={{ padding: 4 }}>
            <Ionicons name="refresh-circle" size={28} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* 🎯 제어 센터 대시보드: 두 개의 버튼이 나란히 배치됩니다 */}
        <View style={styles.triggerContainer}>
          <TouchableOpacity
              style={[styles.triggerButton, { flex: 1, marginRight: 6 }]}
              onPress={handleTriggerMockSpending}
              disabled={triggerLoading}
          >
            {triggerLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.triggerButtonText}>⚡ 결제 발생 (1.5만)</Text>}
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.triggerButton, { flex: 1, marginLeft: 6, backgroundColor: '#004B87', shadowColor: '#004B87' }]}
              onPress={handleTriggerSalaryPayment}
              disabled={salaryLoading}
          >
            {salaryLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.triggerButtonText}>💰 월급 입금 (230만)</Text>}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 16, paddingBottom: 80, paddingTop: 10 }]} showsVerticalScrollIndicator={false}>

          {/* 소비 요약 카드 기본 장착 */}
          <ChatBubble>
            <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6 }]}>오늘의 소비 요약 📝</Text>
            <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16, lineHeight: 18 }]}>
              오늘 목표 예산 중 <Text style={{fontWeight: 'bold', color: todaySpendData.usageRate > 0 ? '#004B87' : '#009D8B'}}>{todaySpendData.usageRate.toFixed(1)}%</Text>를 사용했어요.
            </Text>

            <View style={[styles.innerCard, { padding: 18, borderRadius: 16 }]}>
              <View style={[styles.todaySpendRow, { marginBottom: 8 }]}>
                <Text style={[styles.todaySpendLabel, { fontSize: 13 }]}>오늘 사용한 금액</Text>
                <Text style={[styles.todaySpendValue, { fontSize: 15 }]}>{formatNumber(todaySpendData.todaySpend)}원</Text>
              </View>
              <View style={[styles.todaySpendRow, { marginBottom: 8 }]}>
                <Text style={[styles.todaySpendLabel, { fontSize: 13 }]}>가용 잔여 금액</Text>
                <Text style={[styles.todaySpendValue, { fontSize: 15, color: todaySpendData.remainingBudget < 50000 ? '#004B87' : '#111827' }]}>
                  {formatNumber(todaySpendData.remainingBudget)}원
                </Text>
              </View>
              <View style={[styles.progressBarBg, { height: 8, borderRadius: 4, marginTop: 8 }]}>
                <View style={[styles.progressBarFill, { width: `${Math.min(todaySpendData.usageRate, 100)}%`, backgroundColor: todaySpendData.usageRate > 0 ? '#004B87' : '#E2E8F0' }]} />
              </View>
            </View>
          </ChatBubble>

          {/* 🎯 2. [신규 조건부 렌더링]: 월급 입금 트리거 시 에이전트 분배 추천 카드 노출 */}
          {salaryNotification && (
              <ChatBubble>
                <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6 }]}>💸 AI 자율 예산 분배 제안</Text>
                <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16, lineHeight: 18, textAlign: 'left' }]}>
                  아이엠님, 이번 달 급여 2,300,000원이 확인되었습니다. 자동 분배를 가동할까요?
                </Text>
                <View style={[styles.innerCard, { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16, borderRadius: 16 }]}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 }}>예상 분배 레이아웃</Text>
                  <Text style={{ fontSize: 12, color: '#009D8B', fontWeight: '600', marginBottom: 12 }}>생활비 110만 / 자유예금 100만 / 저축 20만</Text>

                  <TouchableOpacity
                      style={[styles.mintButtonAction, { width: '100%', paddingVertical: 14, borderRadius: 12, backgroundColor: '#004B87' }]}
                      onPress={() => navigation.navigate('SalaryDistribution')} // 🎯 분배 디테일 화면으로 사출!
                      activeOpacity={0.7}
                  >
                    <Text style={[styles.mintButtonText, { fontSize: 14 }]}>분배 상세 내역 확인하기</Text>
                  </TouchableOpacity>
                </View>
              </ChatBubble>
          )}

          {/* 과소비 방어 미션 리스트 */}
          {proposals.map((mission: any) => (
              <ChatBubble key={mission.id}>
                <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6 }]}>🔔 과소비 패턴 감지</Text>
                <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16, lineHeight: 18 }]}>{mission.proposalReason}</Text>
                <Text style={[styles.overspendAlertText, { fontSize: 14, marginBottom: 10 }]}>⚠️ 위험 지수 감지</Text>

                <View style={[styles.overlapBarContainer, { marginVertical: 12 }]}>
                  <View style={[styles.overlapBarBg, { height: 16, borderRadius: 8 }]}>
                    <View style={[styles.overlapBarMint, { width: '60%' }]} />
                    <View style={[styles.overlapBarOrange, { width: '40%' }]} />
                  </View>
                </View>

                <View style={[styles.innerCard, { alignItems: 'center', paddingVertical: 22, paddingHorizontal: 16, borderRadius: 16 }]}>
                  <View style={[styles.aiBadge, { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 12 }]}>
                    <Text style={[styles.aiBadgeText, { fontSize: 11 }]}>AI 에이전트 제안</Text>
                  </View>
                  <Text style={[styles.missionCardDescMain, { fontSize: 16, marginBottom: 8 }]}>{mission.description}</Text>
                  <Text style={[styles.missionCardDescSub, { fontSize: 12, textAlign: 'center', lineHeight: 18 }]}>
                    수락 시 초과 페이스 방어용 보증금{"\n"}
                    <Text style={{color: '#004B87', fontWeight: 'bold'}}>{formatNumber(mission.depositAmount)} iMKRW</Text>가 필요해요.
                  </Text>

                  <TouchableOpacity
                      style={[styles.mintButtonAction, { width: '100%', paddingVertical: 14, borderRadius: 12, marginTop: 16 }]}
                      onPress={() => navigation.navigate('SpendAlert', { mission })}
                      activeOpacity={0.7}
                  >
                    <Text style={[styles.mintButtonText, { fontSize: 14 }]}>도전하기</Text>
                  </TouchableOpacity>
                </View>
              </ChatBubble>
          ))}

          {proposals.length === 0 && !salaryNotification && (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbox-ellipses-outline" size={40} color="#9CA3AF" />
                <Text style={styles.emptyText}> 상단의 시연 제어판 버튼을 통해 기능을 작동 시켜보세요. </Text>
              </View>
          )}

        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'transparent' },
  backButton: { padding: 4 },
  headerLogo: { fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  scrollContent: { },
  triggerContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8 }, // 🎯 가로 배열 컨테이너
  chatRow: { flexDirection: 'row', marginBottom: 28, alignItems: 'flex-start' },
  avatarContainer: { marginRight: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E2E8F0', resizeMode: 'cover' },
  bubbleContainer: {
    flex: 1,
    backgroundColor: '#EAEFEA',
    borderRadius: 24,
    borderTopLeftRadius: 4,
    padding: 26,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  bubbleTitle: { fontWeight: '800', color: '#111827', textAlign: 'center' },
  bubbleSub: { color: '#4B5563', textAlign: 'center', fontWeight: '500' },
  innerCard: { backgroundColor: '#FFFFFF', width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  todaySpendRow: { flexDirection: 'row', justifyContent: 'space-between' },
  todaySpendLabel: { color: '#6B7280', fontWeight: '500' },
  todaySpendValue: { color: '#111827', fontWeight: '800' },
  progressBarBg: { backgroundColor: '#F1F5F9', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  overspendAlertText: { fontWeight: '800', color: '#EF4444', textAlign: 'center' },
  overlapBarContainer: { },
  overlapBarBg: { flexDirection: 'row', overflow: 'hidden', backgroundColor: '#FCD34D' },
  overlapBarMint: { height: '100%', backgroundColor: '#00C4A7' },
  overlapBarOrange: { height: '100%', backgroundColor: '#FBBF24' },
  aiBadge: { backgroundColor: '#E6F6F4' },
  aiBadgeText: { fontWeight: '700', color: '#009D8B' },
  missionCardDescMain: { fontWeight: '800', color: '#111827' },
  missionCardDescSub: { color: '#6B7280' },
  mintButtonAction: { backgroundColor: '#00C4A7', alignItems: 'center' },
  mintButtonText: { color: '#FFFFFF', fontWeight: '800' },
  triggerButton: { backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3, marginTop: 4 },
  triggerButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 24, marginTop: 20 },
  emptyText: { color: '#6B7280', fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 12, fontWeight: '500' }
});