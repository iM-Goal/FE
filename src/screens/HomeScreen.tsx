import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation, route }: any) {
  // 상태 관리 State
  const [hasGoal, setHasGoal] = useState(false);
  const [nickname, setNickname] = useState('고객');
  const [goalData, setGoalData] = useState<any>(null);
  const [walletAmount, setWalletAmount] = useState('0');
  const [loading, setLoading] = useState(true);

  // /dashboard 통합 데이터 연동 함수 교정본
  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://localhost:8080/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        const resData = await response.json();

        // 백엔드 실제 구조인 resData.data 진입
        const dashboardData = resData.data;

        // 파라미터 검사를 하되, 백엔드 실제 카운트를 최우선으로 검사 -> 목표가 있는지 없는지 확인
        if ((dashboardData && dashboardData.activeGoalCount > 0) || route.params?.registeredSuccess) {
          setNickname('아이엠'); // 닉네임 필드가 대시보드에 없다면 일단 수동 지정

          //UI에 그릴 목표 카드를 세팅
          setGoalData({
            title: '제주도 푸른 바다 여행', // 상세 정보는 기획 dummy 매핑
            targetAmount: 300000,
            currentAmount: dashboardData.totalSavedAmount || 35000, // 백엔드가 준 저축 총액 연동!
            achievementRate: dashboardData.todayMissionAchievementRate || 12 // 달성률 연동
          });

          setHasGoal(true);
          // 이렇게 해야 로그아웃하고 새 계정으로 들어올 때 빈 화면으로 시작합니다.
          if (route.params?.registeredSuccess) {
            navigation.setParams({registeredSuccess: undefined});
          }

        } else {
          setHasGoal(false);
        }
        setWalletAmount('40,000');
      } else {
        // 200이 아닐 때도 데모 흐름을 위해 가드 처리 가능
        setHasGoal(false);
      }
    } catch (error) {
      console.log('iM AgentiX API 통신 실패 (네트워크/서버 다운):', error);

      // 서버가 꺼져있더라도, 방금 막 등록을 성공하고 넘어온 상태(true)일 때만 목표 화면
      if (route.params?.registeredSuccess) {
        console.log("💡 서버는 터졌지만 등록 성공 마크가 있으므로 목표 활성화 화면(폴백)을 켭니다.");

        setNickname('아이엠');
        setHasGoal(true);
        setGoalData({
          title: '제주도 푸른 바다 여행',
          targetAmount: 300000,
          currentAmount: 35000,
          achievementRate: 12
        });
        setWalletAmount('40,000');

        // 화면을 한 번 띄웠으니 파라미터 잔상을 즉시 날려버립니다
        navigation.setParams({registeredSuccess: undefined});

      } else {
        // 등록 성공 파라미터가 없다면, 통신이 실패했을 때 무조건 "목표가 없는 빈 화면"을 보여줍니다.
        console.log("💡 일반 진입 중 통신 실패이므로 빈 대시보드 화면을 유지합니다.");
        setHasGoal(false);
      }

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHomeData();
  }, [route.params?.registeredSuccess]);

  // 1. 목표가 없을 때 보여주는 빈 화면 UI
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
            <Text style={styles.emptySubText}>
              이루고 싶은 목표를 등록해보세요!{"\n"}AI 페이스메이커가 페이스를 잡아드릴게요.
            </Text>

            <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => navigation.navigate('AddGoal')}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.emptyAddButtonText}>목표 설정하러 가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );

  // 2. 목표가 생겼을 때 보여주는 활성화 화면 UI
  const renderActiveState = () => {
    // 🎯 안전한 데이터 출력을 위해 널(Null) 가드 및 기본값 분크 처리
    const title = goalData?.title || '나의 저축 목표';
    const targetAmount = goalData?.targetAmount || 0;
    const currentAmount = goalData?.currentAmount || 0;
    const achievementRate = goalData?.achievementRate || 0;
    const remainingAmount = targetAmount - currentAmount > 0 ? targetAmount - currentAmount : 0;

    // 🎯 숫자에 3자리마다 콤마(,)를 찍어주는 포맷터 함수
    const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={[styles.logoHeader, { paddingHorizontal: 0, marginBottom: 16 }]}>
            <Text style={styles.logo}>
              <Text style={styles.logoDot}>iM</Text> Bank <Text style={styles.logoAccent}>AgentiX</Text>
            </Text>
          </View>

          {/* 상단 웰컴 헤더 */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>{nickname}님 👋</Text>
              <Text style={styles.subWelcomeText}>오늘도 목표를 향해 가는 중이에요</Text>
            </View>
            <TouchableOpacity style={styles.notiButton} onPress={() => navigation.navigate('ChatScreen')}>
              <Ionicons name="notifications-outline" size={30} color="#004B87" />
            </TouchableOpacity>
          </View>

          {/* 상단 민트색 캐릭터 말풍선 가이드 */}
          <View style={styles.characterSection}>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>현재 페이스를 아주 잘 유지하고 있어요! 🎉</Text>
              <Text style={[styles.speechText, { marginTop: 2 }]}>이대로 목표 금액까지 함께 달려가요.</Text>
              <View style={styles.speechTriangle} />
            </View>
            <View style={styles.characterRow}>
              <Image source={require('../../assets/main_blue.png')} style={styles.avatarImage} />
              <View style={styles.islandContainer}>
                <Image source={require('../../assets/palm.png')} style={styles.islandImage} />
              </View>
            </View>
          </View>

          {/* 🎯 동적 데이터가 주입되는 목표 달성 카드 섹션 */}
          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>{title}</Text>

            <View style={styles.goalInfoRow}>
              <View style={styles.goalDetails}>
                <Text style={styles.detailLabelText}>목표 금액 : {formatNumber(targetAmount)}원</Text>
                <Text style={[styles.detailAmountText, { marginTop: 14 }]}>
                  <Text style={styles.mintHighlightText}>{formatNumber(currentAmount)}원</Text> 남았어요
                </Text>
                <Text style={styles.detailAmountText}>
                  <Text style={styles.pinkHighlightText}>{formatNumber(remainingAmount)}원</Text> 남았어요
                </Text>
              </View>

              <View style={styles.percentContainer}>
                {/* 🎯 하드코딩 '68%' 제거 후 실제 달성률 연동 */}
                <Text style={styles.percentText}>{achievementRate}%</Text>
              </View>
            </View>

            <View style={styles.progressBarBackground}>
              {/* 🎯 하드코딩 '68%' 제거 후 게이지 바 스타일 폭 동적 반영 */}
              <View style={[styles.progressBarFill, { width: `${achievementRate}%` }]} />
            </View>

            <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigation.navigate('GoalDetail')}
            >
              <Text style={styles.detailButtonText}> 상세 보기  &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* 🪙 iM 보증금 토큰 지갑 섹션 */}
          <Text style={styles.sectionTitle}>디지털 토큰 자산</Text>
          <TouchableOpacity
              activeOpacity={0.9}
              style={styles.walletCard}
              onPress={() => navigation.navigate('DepositDetail')}
          >
            <View style={styles.walletHeader}>
              <View style={styles.walletTitleRow}>
                <View style={styles.tokenIconCircle}>
                  <Ionicons name="lock-closed" size={14} color="#FFFFFF" />
                </View>
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

          {/* 일반 예금 자산 목록 */}
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
        <LinearGradient
            colors={['#FFFFFF', '#F4F9F9', '#EBF5F5']}
            style={StyleSheet.absoluteFillObject}
        />
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <LinearGradient
              colors={['rgba(0, 157, 139, 0.15)', 'rgba(0, 157, 139, 0.03)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.1, y: 0.1 }}
              style={styles.hugeGlowCircle}
          />
        </View>
        {hasGoal ? renderActiveState() : renderEmptyState()}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  logoHeader: {
    alignItems: "flex-start",
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  logo: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  logoDot: { color: "#009D8B" },
  logoAccent: { color: "#004B87", fontWeight: '900' },

  emptyContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  emptyHeader: { marginBottom: -160 },
  emptyCenter: { flex: 0.8, justifyContent: 'center', alignItems: 'center', width: '100%' },

  emptyCharacterWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 20,
    marginBottom: -40,
    zIndex: 10,
  },
  emptyCharacterImage: { width: 160, height: 160, resizeMode: 'contain', opacity: 1 },

  emptyCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  emptyMainText: { fontSize: 19, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  emptySubText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 26, fontWeight: '500' },
  emptyAddButton: { flexDirection: 'row', backgroundColor: '#009D8B', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16, alignItems: 'center', shadowColor: '#009D8B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  emptyAddButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },

  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#111827', letterSpacing: -0.5 },
  subWelcomeText: { fontSize: 13, color: '#4B5563', marginTop: 4, fontWeight: '500' },
  notiButton: { padding: 4 },
  characterSection: { alignItems: 'flex-start', marginBottom: 12, width: '100%' },
  speechBubble: { backgroundColor: '#E6F6F4', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start', position: 'relative', marginLeft: 15, borderWidth: 1, borderColor: '#B3E5E0' },
  speechText: { color: '#004B87', fontSize: 13, fontWeight: '600', textAlign: 'left', lineHeight: 18 },
  speechTriangle: { position: 'absolute', bottom: -7, left: 24, width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#E6F6F4' },
  characterRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16, marginTop: -15 },
  avatarImage: { width: 150, height: 140, resizeMode: 'contain', zIndex: 10 },
  islandImage: { width: 95, height: 95, resizeMode: 'contain' },
  islandContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 10 },

  goalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginBottom: 24, marginTop : -35 },
  goalTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  goalInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalDetails: { flex: 1 },
  detailLabelText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  detailAmountText: { fontSize: 14, color: '#111827', fontWeight: '600' },
  mintHighlightText: { color: '#009D8B', fontWeight: '700' },
  pinkHighlightText: { color: '#FF5E62', fontWeight: '700' },
  percentContainer: { justifyContent: 'center', alignItems: 'center' },
  percentText: { fontSize: 50,  fontFamily: 'IM_Hyemin-Bold', color: '#009D8B', letterSpacing: -1 },
  progressBarBackground: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginTop: 14, marginBottom: 12 },
  progressBarFill: { height: '100%', backgroundColor: '#009D8B', borderRadius: 4 },
  detailButton: { alignItems: 'center', paddingVertical: 2 },
  detailButtonText: { fontSize: 12, color: '#6B7280', fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12, marginTop: 4, letterSpacing: -0.3 },

  // 🪙 보증금 토큰 지갑 스타일링 변경
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
  hugeGlowCircle: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    right: -100,
    top: 360,
    backgroundColor: '#C7F5F1',
    opacity: 0.3,
  }
});