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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, Polyline, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
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

  const [todaySpendData, setTodaySpendData] = useState({
    dailyBudget: 50000,
    todaySpend: 47000,
    remainingBudget: 3000,
    usageRate: 94.0
  });

  const [proposals, setProposals] = useState<any[]>([]);

  const fetchChatDashboardData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

      const [todayRes, proposalsRes] = await Promise.all([
        fetch('http://localhost:8080/api/spending/today', { method: 'GET', headers }),
        fetch('http://localhost:8080/api/missions/proposals', { method: 'GET', headers })
      ]);

      if (todayRes.status === 200) {
        const todayJson = await todayRes.json();
        if (todayJson.data) {
          setTodaySpendData({
            dailyBudget: todayJson.data.dailyBudget || 20000,
            todaySpend: todayJson.data.todaySpend || 0,
            remainingBudget: todayJson.data.remainingBudget || 0,
            usageRate: (todayJson.data.usageRate || 0) > 1 ? todayJson.data.usageRate : (todayJson.data.usageRate || 0) * 100
          });
        }
      }

      if (proposalsRes.status === 200) {
        const proposalsJson = await proposalsRes.json();
        if (proposalsJson.data && Array.isArray(proposalsJson.data) && proposalsJson.data.length > 0) {
          setProposals(proposalsJson.data);
        } else {
          applyDemoData();
        }
      } else {
        applyDemoData();
      }
    } catch (error) {
      applyDemoData();
    } finally {
      setLoading(false);
    }
  };

  const applyDemoData = () => {
    setProposals([
      {
        id: 1,
        category: 'DELIVERY',
        description: '3일 참아서 밸런스 맞추기',
        proposalReason: '이번 주 배달을 평소보다 많이 시켰어요',
        depositAmount: 15000,
        overageRate: 34.5
      }
    ]);
  };

  useEffect(() => {
    fetchChatDashboardData();
  }, []);

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
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 16, paddingBottom: 80, paddingTop: 10 }]} showsVerticalScrollIndicator={false}>

          <ChatBubble>
            <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6 }]}>오늘의 소비 요약 📝</Text>
            <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16, lineHeight: 18 }]}>
              오늘 목표 예산 중 <Text style={{fontWeight: 'bold', color: '#EF4444'}}>{todaySpendData.usageRate.toFixed(1)}%</Text>를 사용했어요. (주의 필요)
            </Text>

            <View style={[styles.innerCard, { padding: 18, borderRadius: 16 }]}>
              <View style={[styles.todaySpendRow, { marginBottom: 8 }]}>
                <Text style={[styles.todaySpendLabel, { fontSize: 13 }]}>오늘 사용한 금액</Text>
                <Text style={[styles.todaySpendValue, { fontSize: 15 }]}>{formatNumber(todaySpendData.todaySpend)}원</Text>
              </View>
              <View style={[styles.todaySpendRow, { marginBottom: 8 }]}>
                <Text style={[styles.todaySpendLabel, { fontSize: 13 }]}>가용 잔여 금액</Text>
                <Text style={[styles.todaySpendValue, { fontSize: 15, color: '#EF4444' }]}>
                  {formatNumber(todaySpendData.remainingBudget)}원
                </Text>
              </View>
              <View style={[styles.progressBarBg, { height: 8, borderRadius: 4, marginTop: 8 }]}>
                <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(todaySpendData.usageRate, 100)}%`, backgroundColor: '#EF4444' }
                    ]}
                />
              </View>
            </View>
          </ChatBubble>

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
                  <View style={[styles.overlapBarLabels, { marginTop: 6 }]}>
                    <View style={{ alignItems: 'center', marginLeft: '50%' }}>
                      <Ionicons name="caret-up" size={12} color="#111827" />
                      <Text style={[styles.overlapLabelSub, { fontSize: 10 }]}>4주 평균</Text>
                      <Text style={[styles.overlapLabelMain, { fontSize: 11 }]}>₩24,000</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginRight: '5%' }}>
                      <Ionicons name="caret-up" size={12} color="#009D8B" />
                      <Text style={[styles.overlapLabelSub, { fontSize: 10 }]}>이번 주 배달</Text>
                      <Text style={[styles.overlapLabelMain, { fontSize: 11 }]}>₩47,000</Text>
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

                  {/* 🎯 [수정] 수락 API가 아니라 '세부 사항 화면'으로 파라미터와 함께 넘어갑니다! */}
                  <TouchableOpacity
                      style={[styles.mintButtonAction, { width: '100%', paddingVertical: 14, borderRadius: 12, marginTop: 16 }]}
                      onPress={() => navigation.navigate('MissionDetail', { mission })}
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
          ))}

          {/* 💡 요청에 따라 맞춤형 추천 섹션은 잠시 주석 처리합니다. */}
          {/*
        <ChatBubble>
          <Text style={[styles.bubbleTitle, { fontSize: 16, marginBottom: 6 }]}>맞춤형 추천</Text>
          <Text style={[styles.bubbleSub, { fontSize: 13, marginBottom: 16, lineHeight: 18 }]}>회원님의 최근 데이터를 기반으로{"\n"}AI가 분석한 추천입니다.</Text>
          <TouchableOpacity style={[styles.recommendCard, { padding: 16, borderRadius: 16, marginBottom: 12 }]}>
            <View style={[styles.recommendHeader, { marginBottom: 8 }]}>
              <Text style={[styles.recommendTitle, { fontSize: 15 }]}>🍚 집밥 챌린지</Text>
            </View>
            <Text style={[styles.recommendDesc, { fontSize: 13 }]}>이번 주 배달 대신 집밥 도전해보세요!</Text>
          </TouchableOpacity>
        </ChatBubble>
        */}

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
  chatRow: { flexDirection: 'row', marginBottom: 28, alignItems: 'flex-start' }, // 버블 간격 약간 확대
  avatarContainer: { marginRight: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E2E8F0', resizeMode: 'cover' },

  // 🎯 말풍선 패딩(여백)을 기존 20에서 26으로 대폭 확대!
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
});