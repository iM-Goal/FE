import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [maturityLoading, setMaturityLoading] = useState(false);
  const [depositMaturityLoading, setDepositMaturityLoading] = useState(false); // 🔓 보증금 만기 로딩
  const [buyoutLoading, setBuyoutLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // 상단 요약 카드용 데이터 싱크 상태
  const [todaySpendData, setTodaySpendData] = useState({
    dailyBudget: 50000,
    todaySpend: 0,
    remainingBudget: 50000,
    usageRate: 0.0
  });

  // 동적 누적 타임라인 정렬 큐 배열 상태 관리
  const [timelineOrder, setTimelineLogOrder] = useState<string[]>([]);
  const [isBuyoutCompleted, setIsBuyoutCompleted] = useState(false);
  const [isDepositWithdrawn, setIsDepositWithdrawn] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (timelineOrder.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150); // 렌더링이 완료된 직후 스무스하게 밀어 올리기 위한 최적의 버퍼 딜레이타임
    }
  }, [timelineOrder]);
  // 📡 화면 진입 시 사용자가 눌렀던 실시간 버튼 순서 장부를 그대로 복원합니다.
  const syncChatTimelineLog = async () => {
    try {
      const localLockedStr = await AsyncStorage.getItem('demo_locked_amount');
      const queueRaw = await AsyncStorage.getItem('demo_chat_queue_order');
      const buyoutRaw = await AsyncStorage.getItem('demo_buyout_completed');

      if (localLockedStr === '15000') {
        setTodaySpendData({ dailyBudget: 50000, todaySpend: 15000, remainingBudget: 35000, usageRate: 30.0 });
      } else {
        setTodaySpendData({ dailyBudget: 50000, todaySpend: 0, remainingBudget: 50000, usageRate: 0.0 });
      }

      if (queueRaw) {
        setTimelineLogOrder(JSON.parse(queueRaw));
      } else {
        setTimelineLogOrder([]);
      }

      if (buyoutRaw === 'true') {
        setIsBuyoutCompleted(true);
      } else {
        setIsBuyoutCompleted(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
      React.useCallback(() => {
        syncChatTimelineLog();
      }, [])
  );

  // 시연 상태 완전 청소 초기화
  const handleResetDemo = async () => {
    try {
      await AsyncStorage.removeItem('demo_locked_amount');
      await AsyncStorage.removeItem('demo_salary_triggered_log');
      await AsyncStorage.removeItem('demo_salary_distributed');
      await AsyncStorage.removeItem('demo_chat_queue_order');
      await AsyncStorage.removeItem('demo_buyout_completed');
      await AsyncStorage.removeItem('demo_maturity_triggered');
      //await AsyncStorage.removeItem('demo_goal_created');
      await AsyncStorage.removeItem('demo_deposit_is_matured');
      await AsyncStorage.removeItem('demo_deposit_withdrawn');

      setTodaySpendData({ dailyBudget: 50000, todaySpend: 0, remainingBudget: 50000, usageRate: 0.0 });
      setTimelineLogOrder([]);
      setIsBuyoutCompleted(false);
      Alert.alert("🔄 시연 타임라인 리셋 완료", "새 창(클린 가이드 상태)으로 초기화되었습니다.");
    } catch (e) {
      console.log(e);
    }
  };

  // 🎯 1. [결제 발생] 트리거 보정 구역
  const handleTriggerMockSpending = async () => {
    if (timelineOrder.includes('SPENDING')) {
      Alert.alert("알림", "이미 결제 알림 카드가 타임라인에 누적되어 있습니다.");
      return;
    }
    setTriggerLoading(true);
    setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        await fetch('http://localhost:8080/api/mock/trigger-spending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ userId: 1, merchantName: "배달의민족", amount: 15000, category: "DELIVERY" })
        });
      } catch (e) {}

      // 🎯 [치명적 버그 수정 포인트]: 새로운 미션이 시작되는 순간이므로,
      // 이전 시연 단계에서 박혀있던 '출금 환원 완료 장부'를 깨끗하게 지워주어야
      // 홈화면 디지털 토큰 자산이 0원으로 굳어버리는 현상이 완벽히 완화됩니다!
      await AsyncStorage.removeItem('demo_deposit_withdrawn_home_sync');
      await AsyncStorage.removeItem('demo_deposit_withdrawn');
      await AsyncStorage.removeItem('demo_deposit_is_matured');
      setIsDepositWithdrawn(false);

      const newOrder = [...timelineOrder, 'SPENDING'];
      setTimelineLogOrder(newOrder);
      await AsyncStorage.setItem('demo_chat_queue_order', JSON.stringify(newOrder));
      await AsyncStorage.setItem('demo_locked_amount', '15000');
      setTodaySpendData({ dailyBudget: 50000, todaySpend: 15000, remainingBudget: 35000, usageRate: 30.0 });

      Alert.alert("🚨 과소비 감지 알림 🚨", "금일 배달 카테고리 소비 임계치가 초과되어 방어 미션 카드가 발급되었습니다.");
      setTriggerLoading(false);
    }, 600);
  };

  // 🎯 2. [월급 입금] 트리거
  const handleTriggerSalaryPayment = () => {
    if (timelineOrder.includes('SALARY')) {
      Alert.alert("알림", "이미 월급 분배 제안 카드가 타임라인에 누적되어 있습니다.");
      return;
    }
    setSalaryLoading(true);
    setTimeout(async () => {
      const newOrder = [...timelineOrder, 'SALARY'];
      setTimelineLogOrder(newOrder);
      await AsyncStorage.setItem('demo_chat_queue_order', JSON.stringify(newOrder));
      await AsyncStorage.setItem('demo_salary_triggered_log', 'true');

      Alert.alert("💰 정기 입금 감지", "iM Bank 계좌로 월급 2,300,000원이 입금되었습니다!");
      setSalaryLoading(false);
    }, 600);
  };

  // 🎯 3. [만기 달성] 트리거
  const handleTriggerMaturity = () => {
    if (timelineOrder.includes('MATURITY')) {
      Alert.alert("알림", "이미 만기 달성 카드가 타임라인에 존재합니다.");
      return;
    }
    setMaturityLoading(true);
    setTimeout(async () => {
      const newOrder = [...timelineOrder, 'MATURITY'];
      setTimelineLogOrder(newOrder);
      await AsyncStorage.setItem('demo_chat_queue_order', JSON.stringify(newOrder));
      await AsyncStorage.setItem('demo_maturity_triggered', 'true');

      Alert.alert("🎯 최종 만기 저축 성공", "마지막 저축액 100,000원이 가산되어 총 300,000원 달성!");
      setMaturityLoading(false);
    }, 500);
  };
  // 🎯 4. [보증만기] 트리거
  const handleTriggerDepositMaturity = () => {
    if (timelineOrder.includes('DEPOSIT_MATURITY')) {
      Alert.alert("알림", "이미 보증금 만기 안내 카드가 타임라인에 존재합니다.");
      return;
    }
    setDepositMaturityLoading(true);
    setTimeout(async () => {
      const newOrder = [...timelineOrder, 'DEPOSIT_MATURITY'];
      setTimelineLogOrder(newOrder);
      await AsyncStorage.setItem('demo_chat_queue_order', JSON.stringify(newOrder));
      await AsyncStorage.setItem('demo_deposit_is_matured', 'true');
      Alert.alert("🔓 스마트 미션 기한 만료", "3일간의 지출 제한 페이스 방어 미션에 성공했습니다! 보증금 출금 카드를 가동하세요.");
      setDepositMaturityLoading(false);
    }, 400);
  };

  // 🎯 [🔓 핵심 개조 구역]: 주신 API 명세 기반 보증금 즉시 출금 실행 엔진 기동
  const handleExecuteDepositWithdraw = async () => {
    setWithdrawLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      // 1. 제공해주신 보증금 출금 실행 API 호출 (데모 1번 타깃 조준)
      await fetch('http://localhost:8080/api/deposits/1/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      // 2. 장부에 출금 완료 캐시 장착
      await AsyncStorage.setItem('demo_deposit_withdrawn', 'true');
      await AsyncStorage.setItem('demo_deposit_withdrawn_home_sync', 'true');
      setIsDepositWithdrawn(true);

      Alert.alert("🎉 스마트 보증금 원화 환원 성공", "iMKRW 토큰 소각 완료!\n보증금 15,000원이 iM 주거래 예금 계좌로 즉시 안전하게 이체되었습니다. 🔓", [
        {
          text: '지갑 내역 확인',
          onPress: () => {
            // 3. 🎯 정산 완료된 실시간 결과창을 입증하기 위해 DepositDetail로 화면 라우팅 트랜지션!
            navigation.navigate('DepositDetail');
          }
        }
      ]);
    } catch (e) {
      // 오프라인 전용 방어 가드 분기
      await AsyncStorage.setItem('demo_deposit_withdrawn', 'true');
      await AsyncStorage.setItem('demo_deposit_withdrawn_home_sync', 'true');
      setIsDepositWithdrawn(true);
      Alert.alert("🎉 스마트 보증금 원화 환원 성공", "iMKRW 토큰 소각 완료!\n보증금 15,000원이 iM 주거래 예금 계좌로 즉시 안전하게 이체되었습니다. 🔓", [
        { text: '지갑 내역 확인', onPress: () => { navigation.navigate('DepositDetail'); } }
      ]);
    } finally {
      setWithdrawLoading(false);
    }
  };

  // 🔓 Buy-out 출금 실행 및 성공화면 네비게이션 점프
  const handleExecuteBuyout = async () => {
    setBuyoutLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://localhost:8080/api/goals/1/buyout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      const resJson = await response.json().catch(() => null);
      const serverMessage = resJson?.data?.message;

      await AsyncStorage.setItem('demo_buyout_completed', 'true');
      setIsBuyoutCompleted(true);

      Alert.alert("🎉 Buy-out 정산 완결", "iMKRW 토큰 소각 및 원화 출금 완료! 달성 리포트 화면으로 이동합니다.", [
        {
          text: '확인',
          onPress: () => {
            navigation.navigate('SuccessGoalScreen', {
              productName: "제주도 푸른 바다 여행 ✈️",
              productPrice: "300,000원",
              period: "1개월",
              speed: "8월 30일까지",
              serverMsg: serverMessage
            });
          }
        }
      ]);
    } catch (e) {
      await AsyncStorage.setItem('demo_buyout_completed', 'true');
      setIsBuyoutCompleted(true);
      Alert.alert("🎉 Buy-out 정산 완결", "iMKRW 토큰 소각 및 원화 출금 완료! 달성 리포트 화면으로 이동합니다.", [
        {
          text: '확인',
          onPress: () => {
            navigation.navigate('SuccessGoalScreen', {
              productName: "제주도 푸른 바다 여행 ✈️",
              productPrice: "300,000원",
              period: "1개월",
              speed: "8월 30일까지"
            });
          }
        }
      ]);
    } finally {
      setBuyoutLoading(false);
    }
  };

  const formatNumber = (num: number) => (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <LinearGradient colors={['#F0FDF8', '#E6F6F4', '#F8FAFC']} style={StyleSheet.absoluteFillObject} />

        {/* 상단 헤더 구역 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerLogo}>
            <Text style={{color: '#009D8B'}}>iM</Text> AgentiX
          </Text>
          <TouchableOpacity onPress={handleResetDemo} style={{ padding: 4 }}>
            <Ionicons name="refresh-circle" size={28} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
        >
          {/* 고정 최상단 1순위: 오늘의 소비 요약 카드 */}
          <ChatBubble>
            <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6 }]}>오늘의 소비 요약 📝</Text>
            <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16 }]}>
              오늘 목표 예산 중 <Text style={{fontWeight: 'bold', color: todaySpendData.usageRate > 0 ? '#004B87' : '#009D8B'}}>{todaySpendData.usageRate.toFixed(1)}%</Text>를 사용했어요.
            </Text>
            <View style={styles.innerCard}>
              <View style={[styles.todaySpendRow, { marginBottom: 8 }]}>
                <Text style={styles.todaySpendLabel}>오늘 사용한 금액</Text>
                <Text style={styles.todaySpendValue}>{formatNumber(todaySpendData.todaySpend)}원</Text>
              </View>
              <View style={styles.todaySpendRow}>
                <Text style={styles.todaySpendLabel}>가용 잔여 금액</Text>
                <Text style={[styles.todaySpendValue, { color: todaySpendData.remainingBudget < 50000 ? '#004B87' : '#111827' }]}>
                  {formatNumber(todaySpendData.remainingBudget)}원
                </Text>
              </View>
            </View>
          </ChatBubble>

          {/* 🎯 [인자 교정]: map 함수 스코프에 (key, index) 쌍을 명확히 주입하여 유령 index 에러 완벽 차단! */}
          {timelineOrder.map((key, index) => {
            if (key === 'SPENDING') {
              return (
                  <ChatBubble key={`spend_${index}`}>
                    <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6 }]}>🔔 과소비 패턴 감지</Text>
                    <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16, textAlign: 'left' }]}>
                      배달의민족 15,000원 결제로 인해 배달 카테고리 지출 속도가 4주 평균치 대비 34.5% 빨라졌습니다.
                    </Text>

                    <Text style={{ fontWeight: '800', color: '#EF4444', textAlign: 'center', fontSize: 14, marginBottom: 10 }}>⚠️ 위험 지수 감지</Text>
                    <View style={{ marginVertical: 12 }}>
                      <View style={{ flexDirection: 'row', height: 16, borderRadius: 8, overflow: 'hidden', backgroundColor: '#FCD34D' }}>
                        <View style={{ width: '60%', height: '100%', backgroundColor: '#00C4A7' }} />
                        <View style={{ width: '40%', height: '100%', backgroundColor: '#FBBF24' }} />
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                        <View style={{ alignItems: 'center', marginLeft: '50%' }}>
                          <Ionicons name="caret-up" size={12} color="#111827" />
                          <Text style={{ color: '#6B7280', fontSize: 10, marginTop: 2 }}>4주 평균</Text>
                          <Text style={{ fontWeight: '700', color: '#111827', fontSize: 11, marginTop: 2 }}>₩24,000</Text>
                        </View>
                        <View style={{ alignItems: 'center', marginRight: '5%' }}>
                          <Ionicons name="caret-up" size={12} color="#009D8B" />
                          <Text style={{ color: '#6B7280', fontSize: 10, marginTop: 2 }}>이번 주 배달</Text>
                          <Text style={{ fontWeight: '700', color: '#111827', fontSize: 11, marginTop: 2 }}>₩39,000</Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.innerCard, { alignItems: 'center', paddingVertical: 16 }]}>
                      <View style={{ backgroundColor: '#E6F6F4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 12 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#009D8B' }}>AI 에이전트 제안</Text>
                      </View>
                      <Text style={{ fontSize: 15, fontWeight: '800', marginBottom: 6, color: '#111827' }}>3일 동안 배달 앱 참고 집밥 요리하기 🍳</Text>
                      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 12, textAlign: 'center', lineHeight: 18 }}>
                        수락 시 초과 페이스 방어용 보증금{"\n"}
                        <Text style={{ color: '#004B87', fontWeight: 'bold' }}>15,000 iMKRW</Text>가 필요해요.
                      </Text>
                      <TouchableOpacity style={[styles.mintButtonAction, { width: '100%', paddingVertical: 12 }]} onPress={() => navigation.navigate('SpendAlert', { mission: { id: 999, category: 'DELIVERY', depositAmount: 15000, durationDays: 3, proposalReason: '배달 결제로 지출 속도가 빨라졌습니다.' } })}>
                        <Text style={styles.mintButtonText}>도전하기</Text>
                      </TouchableOpacity>
                    </View>
                  </ChatBubble>
              );
            }

            if (key === 'SALARY') {
              return (
                  <ChatBubble key={`salary_${index}`}>
                    <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6 }]}>💸 AI 자율 예산 분배 제안</Text>
                    <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16, textAlign: 'left' }]}>
                      아이엠님, 금일 정기 급여 2,300,000원 입금이 포착되었습니다. 예산 쪼개기 레이어를 전격 기동할까요?
                    </Text>
                    <View style={[styles.innerCard, { alignItems: 'center', paddingVertical: 16 }]}>
                      <Text style={{ fontSize: 13, color: '#009D8B', fontWeight: '700', marginBottom: 4 }}>생활비 110만 / 자유예금 100만 / 저축 20만 비례 분할</Text>
                      <TouchableOpacity style={[styles.mintButtonAction, { width: '100%', paddingVertical: 12, backgroundColor: '#004B87', marginTop: 8 }]} onPress={() => navigation.navigate('SalaryDistributionScreen')}>
                        <Text style={styles.mintButtonText}>분배 상세 내역 확인하기</Text>
                      </TouchableOpacity>
                    </View>
                  </ChatBubble>
              );
            }

            if (key === 'MATURITY') {
              return (
                  <ChatBubble key={`maturity_${index}`}>
                    <Text style={[styles.bubbleTitle, { fontSize: 18, marginBottom: 6, color: '#009D8B' }]}>🏆 축하합니다! 최종 만기 완수</Text>
                    <Text style={[styles.bubbleSub, { fontSize: 15, marginBottom: 16, textAlign: 'left' }]}>
                      축하합니다! 마지막 만기 저축금까지 안전하게 도달하여 저축률 100% 고지를 돌파했습니다.가입하신 목표 저축을 영예롭게 해제할까요?
                    </Text>
                    <View style={[styles.innerCard, { alignItems: 'center', paddingVertical: 16, borderColor: '#009D8B', borderWidth: 1.5 }]}>
                      <Image source={require('../../assets/palm.png')} style={{ width: 55, height: 55, marginBottom: 8, resizeMode: 'contain' }} />
                      <Text style={{ fontSize: 15, fontWeight: '800', marginBottom: 4, color: '#111827' }}>제주도 푸른 바다 여행 ✈️</Text>
                      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 14, textAlign: 'center' }}>
                        8월 30일까지 30만원 모으기 성공.
                      </Text>

                      <TouchableOpacity
                          style={[styles.mintButtonAction, { width: '100%', paddingVertical: 14, backgroundColor: isBuyoutCompleted ? '#9CA3AF' : '#009D8B' }]}
                          onPress={handleExecuteBuyout}
                          disabled={buyoutLoading || isBuyoutCompleted}
                      >
                        {buyoutLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.mintButtonText}>
                              {isBuyoutCompleted ? "✨ DAGAON 지갑 정산 완료" :" 목표 달성 보러가기"}
                            </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </ChatBubble>
              );
            }
            if (key === 'DEPOSIT_MATURITY') {
              return (
                  <ChatBubble key={`dep_matur_${index}`}>
                    <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6, color: '#D97706' }]}>🔓 스마트 리워드 해제 알림</Text>
                    <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16, textAlign: 'left' }]}>
                      지출 가드 미션 기한이 만료되었습니다. 과소비 유혹을 완벽하게 견뎌내어 클레이튼 락업 계약 해제 권한을 {"\n"}획득하셨습니다!
                    </Text>
                    <View style={[styles.innerCard, { alignItems: 'center', paddingVertical: 16, borderColor: '#D97706', borderWidth: 1.5 }]}>
                      <Ionicons name="lock-open-outline" size={32} color="#D97706" style={{ marginBottom: 6 }} />
                      <Text style={{ fontSize: 15, color: '#111827', marginBottom: 4, fontWeight: '800' }}>배달 페이스 디펜스 미션 🍳</Text>
                      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 14, textAlign: 'center' }}>환원 보증금액: 15,000 iMKRW</Text>

                      <TouchableOpacity
                          style={[styles.mintButtonAction, { width: '100%', paddingVertical: 14, backgroundColor: isDepositWithdrawn ? '#9CA3AF' : '#D97706' }]}
                          onPress={handleExecuteDepositWithdraw}
                          disabled={withdrawLoading || isDepositWithdrawn}
                      >
                        {withdrawLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.mintButtonText}>
                              {isDepositWithdrawn ? "🔓 원화 환급 및 정산 완료" : "스마트 계약 해제 & 보증금 출금 🔓"}
                            </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </ChatBubble>
              );
            }

            return null;
          })}


          {timelineOrder.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbox-ellipses-outline" size={40} color="#9CA3AF" />
                <Text style={styles.emptyText}>현재 이상 과소비 징후가 없습니다. 하단 제어판 버튼을 터치해 발표용 실시간 감지 시나리오를 구동해 보세요.</Text>
              </View>
          )}


        </ScrollView>

        {/* 🎯 제어판 하단 바닥 고정 레이아웃 (엄지손가락 동선 최적화 완료) */}
        <View style={styles.triggerContainer}>
          <TouchableOpacity style={[styles.triggerButton, { flex: 1, marginRight: 4 }]} onPress={handleTriggerMockSpending} disabled={triggerLoading}>
            <Text style={styles.triggerButtonText}>⚡결제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.triggerButton, { flex: 1, mx: 2, backgroundColor: '#004B87' }]} onPress={handleTriggerSalaryPayment} disabled={salaryLoading}>
            <Text style={styles.triggerButtonText}>💰분배</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.triggerButton, { flex: 1, mx: 2, backgroundColor: '#009D8B' }]} onPress={handleTriggerMaturity} disabled={maturityLoading}>
            <Text style={styles.triggerButtonText}>🎯만기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.triggerButton, { flex: 1, marginLeft: 4, backgroundColor: '#D97706' }]} onPress={handleTriggerDepositMaturity} disabled={depositMaturityLoading}>
            <Text style={styles.triggerButtonText}>🔓보증만기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  headerLogo: { fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  triggerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 50,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  chatRow: { flexDirection: 'row', marginBottom: 28, alignItems: 'flex-start' },
  avatarContainer: { marginRight: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  bubbleContainer: { flex: 1, backgroundColor: '#EAEFEA', borderRadius: 24, borderTopLeftRadius: 4, padding: 20 },
  bubbleTitle: { fontWeight: '800', color: '#111827', textAlign: 'center' },
  bubbleSub: { color: '#4B5563', marginTop: 4, textAlign: 'center', fontWeight: '500' },
  innerCard: { backgroundColor: '#FFFFFF', width: '100%', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  todaySpendRow: { flexDirection: 'row', justifyContent: 'space-between' },
  todaySpendLabel: { color: '#6B7280', fontSize: 13, fontWeight: '500' },
  todaySpendValue: { color: '#111827', fontWeight: '800', fontSize: 14 },
  mintButtonAction: { backgroundColor: '#00C4A7', alignItems: 'center', borderRadius: 10 },
  mintButtonText: { color: '#FFFFFF', fontWeight: '800' },
  triggerButton: { backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  triggerButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  emptyContainer: { alignItems: 'center', padding: 24, marginTop: 40 },
  emptyText: { color: '#6B7280', fontSize: 13, textAlign: 'center', marginTop: 12, lineHeight: 20 }
});