import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function HomeScreen({ navigation, route }: any) {
  // 목표 등록 상태 State (true: 등록 완료 상태(제주도 여행) / false: 빈 상태)
  const [hasGoal, setHasGoal] = useState(true);

  React.useEffect(() => {
    if (route.params?.registeredSuccess) {
      setHasGoal(true); // 목표 등록 성공 신호가 오면 수동 터치 없이 자동으로 true 전환
    }
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
  const renderActiveState = () => (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={[styles.logoHeader, { paddingHorizontal: 0, marginBottom: 16 }]}>
          <Text style={styles.logo}>
            <Text style={styles.logoDot}>iM</Text> Bank <Text style={styles.logoAccent}>AgentiX</Text>
          </Text>
        </View>

        {/* 상단 웰컴 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>아이엠님 👋</Text>
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

        {/* 제주도 여행 목표 달성 카드 */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>제주도 여행</Text>

          {/* 제주도 여행 목표 달성 카드 */}
            <View style={styles.goalInfoRow}>
              <View style={styles.goalDetails}>
                <Text style={styles.detailLabelText}>목표 금액 : 300,000원</Text>
                <Text style={[styles.detailAmountText, { marginTop: 14 }]}>
                  <Text style={styles.mintHighlightText}>204,000원</Text> 모았어요
                </Text>
                <Text style={styles.detailAmountText}>
                  <Text style={styles.pinkHighlightText}>96,000원</Text> 남았어요
                </Text>
              </View>


              <View style={styles.percentContainer}>
              <Text style={styles.percentText}>68%</Text>
            </View>
          </View>

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '68%' }]} />
          </View>

          <TouchableOpacity
              style={styles.detailButton}
              onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.detailButtonText}> 상세 보기  &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* 🪙 [핵심] iM 보증금 토큰 지갑 섹션 (터치 시 화면 이동) */}
        <Text style={styles.sectionTitle}>디지털 토큰 자산</Text>
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.walletCard}
            onPress={() => navigation.navigate('DepositDetail')} // 상세 리스트 화면으로 진입
        >
          <View style={styles.walletHeader}>
            <View style={styles.walletTitleRow}>
              <View style={styles.tokenIconCircle}>
                <Ionicons name="lock-closed" size={14} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.walletName}>보증금 토큰 지갑</Text>
                <Text style={styles.walletSub}>과소비 제어 스마트 계약 락업 자산</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#004B87" />
          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>락업 보증금 총액</Text>
            <Text style={styles.walletAmount}>40,000 원</Text>
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