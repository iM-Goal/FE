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
import { useFocusEffect } from '@react-navigation/native';

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

  // 🎯 [수치 통일] 초기 상태는 지출 0원, 남은 금액 50,000원
  const [todaySpendData, setTodaySpendData] = useState({
    dailyBudget: 50000,
    todaySpend: 0,
    remainingBudget: 50000,
    usageRate: 0.0
  });

  const [proposals, setProposals] = useState<any[]>([]);

  // 📡 화면에 진입할 때마다 로컬 장부(수락 여부)를 실시간 체크하여 상단 카드 수치 싱크 맞추기
  const checkSyncStatus = async () => {
    try {
      const localLockedStr = await AsyncStorage.getItem('demo_locked_amount');

      if (localLockedStr) {
        setTodaySpendData({
          dailyBudget: 50000,
          todaySpend: 15000,
          remainingBudget: 35000,
          usageRate: 30.0
        });
        applyDemoData(); // 제안 카드도 유지
      } else {
        // [트리거 전 초기 상태]: 깨끗한 0원 상태 대기
        setTodaySpendData({
          dailyBudget: 50000,
          todaySpend: 0,
          remainingBudget: 50000,
          usageRate: 0.0
        });
        setProposals([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 탭 이동이나 화면 포커스가 바뀔 때마다 실시간 수치 동기화 작동
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

      setTodaySpendData({
        dailyBudget: 50000,
        todaySpend: 0,
        remainingBudget: 50000,
        usageRate: 0.0
      });
      setProposals([]);
      Alert.alert("🔄 상태 초기화 완료", "모든 데이터가 최초 청정 상태로 리셋되었습니다.");
    } catch (e) {
      console.log(e);
    }
  };

  const handleTriggerMockSpending = async () => {
    setTriggerLoading(true);

    setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        const response = await fetch('http://localhost:8080/api/mock/trigger-spending', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: 1,
            merchantName: "배달의민족 (가짜 결제)",
            amount: 15000,
            category: "DELIVERY"
          })
        });

        // 🎯 버튼을 누르는 순간 15,000원 차감 연출 시동
        setTodaySpendData({
          dailyBudget: 50000,
          todaySpend: 15000,
          remainingBudget: 35000,
          usageRate: 30.0
        });

        if (response.status === 200) {
          const resData = await response.json();
          if (resData.hasNotification) {
            Alert.alert("🚨 AI 과소비 에이전트 경보!", "금일 배달음식 과소비 임계점이 포착되었습니다. 자산 락업 방어 미션을 전송합니다.");

            const liveMission = {
              id: Date.now(),
              category: '배달음식',
              description: '3일 동안 배달 앱 참고 집밥 요리하기 🍳',
              proposalReason: resData.notificationMessage || '방금 배달 결제로 인해 이번 주 배달 지출 페이스가 무너지고 있습니다.',
              depositAmount: 15000,
              durationDays: 3,
              limitAmount: 3000
            };
            setProposals([liveMission]);
          }
        } else {
          triggerLocalDemoSequence();
        }
      } catch (error) {
        triggerLocalDemoSequence();
      } finally {
        setTriggerLoading(false);
      }
    }, 1000);
  };

  const triggerLocalDemoSequence = () => {
    Alert.alert("🚨 AI 과소비 에이전트 경보!", "금일 배달음식 과소비 임계점이 포착되었습니다. 자산 락업 방어 미션을 전송합니다.");
    setTodaySpendData({
      dailyBudget: 50000,
      todaySpend: 15000,
      remainingBudget: 35000,
      usageRate: 30.0
    });
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
  };

  const applyDemoData = () => {
    setProposals([
      {
        id: 1,
        category: 'DELIVERY',
        description: '3일 동안 배달 앱 참고 집밥 요리하기 🍳',
        proposalReason: '배달의민족 15,000원 결제로 인해 배달 카테고리 지출 속도가 4주 평균치 대비 34.5% 빨라졌습니다.',
        depositAmount: 15000,
        overageRate: 34.5,
        durationDays: 3,
        limitAmount: 3000
      }
    ]);
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

        <TouchableOpacity
            style={styles.triggerButton}
            onPress={handleTriggerMockSpending}
            disabled={triggerLoading}
            activeOpacity={0.8}
        >
          {triggerLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
              <Text style={styles.triggerButtonText}>⚡ 배달 1.5만원</Text>
          )}
        </TouchableOpacity>

        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 16, paddingBottom: 80, paddingTop: 10 }]} showsVerticalScrollIndicator={false}>

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
                <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(todaySpendData.usageRate, 100)}%`, backgroundColor: todaySpendData.usageRate > 0 ? '#004B87' : '#E2E8F0' }
                    ]}
                />
              </View>
            </View>
          </ChatBubble>

          {proposals.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbox-ellipses-outline" size={40} color="#9CA3AF" />
                <Text style={styles.emptyText}>아직 이상 과소비 징후가 감지되지 않았습니다. 상단 가짜 결제 버튼을 터치해 실시간 모니터링 시나리오를 구동해 보세요.</Text>
              </View>
          ) : (
              proposals.map((mission: any) => (
                  <ChatBubble key={mission.id}>
                    <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6 }]}>🔔 과소비 패턴 감지</Text>
                    <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16, lineHeight: 18 }]}>{mission.proposalReason}</Text>

                    <Text style={[styles.overspendAlertText, { fontSize: 14, marginBottom: 10 }]}>⚠️ 위험 지수 감지</Text>

                    <View style={[styles.overlapBarContainer, { marginVertical: 12 }]}>
                      <View style={[styles.overlapBarBg, { height: 16, borderRadius: 8 }]}>
                        <View style={[styles.overlapBarMint, { width: '60%' }]} />
                        <View style={[styles.overlapBarOrange, { width: '40%' }]} />
                      </View>
                      <View style={[styles.overlapBarLabels, { marginTop: 6 }]}>
                        <View style={{ alignItems: 'center', marginLeft: '50%' }}>
                          <Ionicons name="caret-up" size={12} color="#111827" />
                          <Text style={[styles.overlapLabelSub, { fontSize: 10 }]}>4주 평균</Text>
                          <Text style={[styles.overlapLabelMain, { fontSize: 11 }]}>₩24,000</Text>
                        </View>
                        <View style={{ alignItems: 'center', marginRight: '5%' }}>
                          <Ionicons name="caret-up" size={12} color="#009D8B" />
                          <Text style={[styles.overlapLabelSub, { fontSize: 10 }]}>이번 주 배달</Text>
                          <Text style={[styles.overlapLabelMain, { fontSize: 11 }]}>₩39,000</Text>
                        </View>
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
                      <TouchableOpacity
                          style={[styles.greyButtonAction, { width: '100%', paddingVertical: 14, borderRadius: 12, marginTop: 8 }]}
                          activeOpacity={0.7}
                      >
                        <Text style={[styles.greyButtonText, { fontSize: 14 }]}>다른 미션 보기</Text>
                      </TouchableOpacity>
                    </View>
                  </ChatBubble>
              ))
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
  overlapBarLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  overlapLabelSub: { color: '#6B7280', marginTop: 2 },
  overlapLabelMain: { fontWeight: '700', color: '#111827', marginTop: 2 },
  aiBadge: { backgroundColor: '#E6F6F4' },
  aiBadgeText: { fontWeight: '700', color: '#009D8B' },
  missionCardDescMain: { fontWeight: '800', color: '#111827' },
  missionCardDescSub: { color: '#6B7280' },
  mintButtonAction: { backgroundColor: '#00C4A7', alignItems: 'center' },
  mintButtonText: { color: '#FFFFFF', fontWeight: '800' },
  greyButtonAction: { backgroundColor: '#E5E7EB', alignItems: 'center' },
  greyButtonText: { color: '#4B5563', fontWeight: '800' },
  recommendCard: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  recommendHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recommendTitle: { fontWeight: '800', color: '#111827' },
  recommendBadge: { fontWeight: '700', color: '#009D8B' },
  recommendDesc: { color: '#4B5563', fontWeight: '500' },
  triggerButton: { backgroundColor: '#EF4444', paddingVertical: 14, marginHorizontal: 150, borderRadius: 12, alignItems: 'center', shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3, marginTop: 4 },
  triggerButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 24, marginTop: 20 },
  emptyText: { color: '#6B7280', fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 12, fontWeight: '500' }
});