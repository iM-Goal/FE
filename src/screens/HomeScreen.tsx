import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur'; //

export default function HomeScreen({ navigation }: any) {
  // 목표 등록 상태 State (true: 등록 완료 상태(제주도 여행) / false: 빈 상태)
  const [hasGoal, setHasGoal] = useState(false);

  // 1. 목표가 없을 때 보여주는 빈 화면 UI
  const renderEmptyState = () => (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyHeader}>
          <Text style={styles.welcomeText}>아이엠님 👋</Text>
          <Text style={styles.subWelcomeText}>나만의 특별한 재무 페이스메이커</Text>
        </View>

        <View style={styles.emptyCenter}>
          {/* 캐릭터 위치를 왼쪽으로 치우치게 조정 */}
          <View style={styles.emptyCharacterWrapper}>
            <Image source={require('../../assets/main_blue.png')} style={styles.emptyCharacterImage} />
          </View>

          {/* 💡 텍스트와 버튼을 담은 라운드 카드 박스 */}
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

  // 2. 목표가 생겼을 때 보여주는 활성화 화면 UI (요청하신 시안 100% 반영)
  const renderActiveState = () => (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 상단 웰컴 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>아이엠님 👋</Text>
            <Text style={styles.subWelcomeText}>오늘도 목표를 향해 가는 중이에요</Text>
          </View>
          <TouchableOpacity style={styles.notiButton}>
            <Ionicons name="notifications" size={26} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* 상단 민트색 캐릭터 말풍선 가이드 */}
        <View style={styles.characterSection}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>오늘은 아주 좋은 페이스예요! 🎉</Text>
            <Text style={styles.speechText}>이대로만 가면 목표를 달성할 수 있어요!</Text>
            {/* 말풍선 꼬리 밑부분 처리 */}
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

          {/* 프로그레스 바 스트립 디자인 */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '68%' }]} />
          </View>

          <TouchableOpacity
              style={styles.detailButton}
              onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.detailButtonText}>상세 보기 &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* 오늘 추천 섹션 */}
        <Text style={styles.sectionTitle}>오늘 추천</Text>
        <View style={styles.recommendContainer}>
          <View style={styles.recommendRow}>
            <View style={styles.recommendLeft}>
              <View style={styles.recommendIconBg}>
                <Text style={{ fontSize: 18 }}>🍲</Text>
              </View>
              <Text style={styles.recommendItemText}>점심 9,000원 이하</Text>
            </View>
            <View style={[styles.badge, styles.badgeRecommendation]}><Text style={styles.badgeRecText}>추천</Text></View>
          </View>

          <View style={styles.recommendRow}>
            <View style={styles.recommendLeft}>
              <View style={styles.recommendIconBg}>
                <Text style={{ fontSize: 18 }}>☕</Text>
              </View>
              <Text style={styles.recommendItemText}>커피는 1잔 OK!</Text>
            </View>
            <View style={[styles.badge, styles.badgeRecommendation]}><Text style={styles.badgeRecText}>추천</Text></View>
          </View>

          <View style={[styles.recommendRow, { borderBottomWidth: 0, paddingBottom: 4 }]}>
            <View style={styles.recommendLeft}>
              <View style={styles.recommendIconBg}>
                <Text style={{ fontSize: 18 }}>🚖</Text>
              </View>
              <Text style={styles.recommendItemText}>택시대신 버스 이용</Text>
            </View>
            <View style={[styles.badge, styles.badgeWarning]}><Text style={styles.badgeWarnText}>주의</Text></View>
          </View>
        </View>

        {/* 내 토큰 지갑 섹션 */}
        <View style={styles.walletHeaderRow}>
          <Text style={styles.sectionTitle}>내 토큰 지갑</Text>
          <TouchableOpacity onPress={() => setHasGoal(!hasGoal)}>
            <Text style={styles.seeAllText}>전체 보기 &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.walletContainer}>
          {/* 생활비 */}
          <View style={styles.tokenRow}>
            <View style={styles.tokenLeft}>
              <View style={[styles.tokenIconBg, { backgroundColor: '#EEA243' }]} />
              <View>
                <Text style={styles.tokenTitleText}>생활비</Text>
                <Text style={styles.tokenSubText}>오늘 사용 가능</Text>
              </View>
            </View>
            <Text style={styles.tokenAmountText}>65,000원</Text>
          </View>

          {/* 자유 토큰 */}
          <View style={styles.tokenRow}>
            <View style={styles.tokenLeft}>
              <View style={[styles.tokenIconBg, { backgroundColor: '#4A90E2' }]} />
              <View>
                <Text style={styles.tokenTitleText}>자유 토큰</Text>
                <Text style={styles.tokenSubText}>언제든 사용 가능</Text>
              </View>
            </View>
            <Text style={styles.tokenAmountText}>83,000원</Text>
          </View>

          {/* GOAL 토큰 */}
          <View style={[styles.tokenRow, { borderBottomWidth: 0, paddingBottom: 4 }]}>
            <View style={styles.tokenLeft}>
              <View style={[styles.tokenIconBg, { backgroundColor: '#03A28F' }]} />
              <View>
                <Text style={styles.tokenTitleText}>GOAL 토큰</Text>
                <Text style={styles.tokenSubText}>제주도 여행 적립(68%)</Text>
              </View>
            </View>
            <Text style={styles.tokenAmountText}>204,000원</Text>
          </View>

          {/* 토큰 조정하기 선형 디자인 버튼 */}
          <TouchableOpacity style={styles.adjustButton}>
            <Ionicons name="options-outline" size={16} color="#111827" style={{ marginRight: 6 }} />
            <Text style={styles.adjustButtonText}>토큰 조정하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );

  return (
      <SafeAreaView style={styles.container}>
        {/* 시안 바탕의 은은한 오로라/그라데이션 광채 배경 필터 */}
        <LinearGradient
            colors={['#FFFFFF', '#F6FBFB', '#EFF9F8']}
            style={StyleSheet.absoluteFillObject}
        />
        {/* 2. 가장자리가 스르륵 번지는 오로라 블러 원 레이어 */}
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <LinearGradient
              // 안쪽에서 바깥쪽(대각선 방향)으로 가면서 자연스럽게 투명해지도록 설정
              colors={['rgba(167, 243, 208, 0.75)', 'rgba(167, 243, 208, 0.3)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.1, y: 0.1 }}
              style={styles.hugeGlowCircle}
          />
        </View>
        {/* 조건부 렌더링 스위치 로직 적용 */}
        {hasGoal ? renderActiveState() : renderEmptyState()}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  // 목표가 없을 때 (Empty State) 스타일 시트
  emptyContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  emptyHeader: { marginBottom: -160 },
  emptyCenter: { flex: 0.8, justifyContent: 'center', alignItems: 'center', width: '100%' },

  emptyCharacterWrapper: {
    width: '100%',
    alignItems: 'flex-start', // 왼쪽 정렬
    paddingLeft: 20,          // 미세 마진 레이아웃
    marginBottom: -40,        // 카드와의 긴장감 있는 레이어 겹침 효과
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
  emptyAddButton: { flexDirection: 'row', backgroundColor: '#03A28F', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16, alignItems: 'center', shadowColor: '#03A28F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  emptyAddButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },

  // 🏝️ 목표 설정 완료 시 (Active State 시안 매칭) 스타일 시트
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: '#000000', letterSpacing: -0.5 },
  subWelcomeText: { fontSize: 14, color: '#111827', marginTop: 5, fontWeight: '700' },
  notiButton: { padding: 4 },
  characterSection: { alignItems: 'center', marginBottom: 12, width: '100%' },
  speechBubble: { backgroundColor: '#C1F2E8', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, width: '100%', position: 'relative' },
  speechText: { color: '#000000', fontSize: 15, fontWeight: 'bold', textAlign: 'left', lineHeight: 22 },
  speechTriangle: { position: 'absolute', bottom: -8, left: 35, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#C1F2E8' },
  characterRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16, marginTop: -20 },
  avatarImage: { width: 160, height: 150, resizeMode: 'contain',zIndex: 10},
  islandImage: { width: 100, height: 100, resizeMode: 'contain'},
  islandContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 10},
  goalCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4, marginBottom: 30 , marginTop : -40 },
  goalTitle: { fontSize: 18, fontWeight: 'bold', color: '#000000', textAlign: 'center', marginBottom: 14 },
  goalInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalDetails: { flex: 1 },
  detailLabelText: { fontSize: 13, color: '#6B7280', fontWeight: 'bold' },
  detailAmountText: { fontSize: 14, color: '#111827', fontWeight: 'bold', lineHeight: 20 },
  mintHighlightText: { color: '#03A28F', fontWeight: '900' },
  pinkHighlightText: { color: '#FF5E62', fontWeight: '900' },
  percentContainer: { justifyContent: 'center', alignItems: 'center', paddingLeft: 5 },
  percentText: { fontSize: 54, fontWeight: '900', color: '#03A28F', letterSpacing: -1, textShadowColor: 'rgba(3, 162, 143, 0.15)', textShadowOffset: { width: 1, height: 3 }, shadowRadius: 4 },
  progressBarBackground: { height: 12, backgroundColor: '#E5E7EB', borderRadius: 6, overflow: 'hidden', marginTop: 18, marginBottom: 14 },
  progressBarFill: { height: '100%', backgroundColor: '#03A28F', borderRadius: 6 },
  detailButton: { alignItems: 'center', paddingVertical: 4 },
  detailButtonText: { fontSize: 13, color: '#4B5563', fontWeight: 'bold' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#000000', marginBottom: 12, marginTop: 4 },
  recommendContainer: { backgroundColor: '#EFF9F7', borderRadius: 28, paddingHorizontal: 18, paddingVertical: 8, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(3, 162, 143, 0.05)' },
  recommendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)' },
  recommendLeft: { flexDirection: 'row', alignItems: 'center' },
  recommendIconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 3 },
  recommendItemText: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  badgeRecommendation: { backgroundColor: '#BFDBFE' },
  badgeWarning: { backgroundColor: '#FDE68A' },
  badgeRecText: { fontSize: 11, fontWeight: 'bold', color: '#2563EB' },
  badgeWarnText: { fontSize: 11, fontWeight: 'bold', color: '#D97706' },
  walletHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAllText: { fontSize: 12, color: '#000000', fontWeight: 'bold' },
  walletContainer: { backgroundColor: '#FFFFFF', borderRadius: 28, paddingHorizontal: 20, paddingVertical: 6, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2 },
  tokenRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  tokenLeft: { flexDirection: 'row', alignItems: 'center' },
  tokenIconBg: { width: 38, height: 38, borderRadius: 19, marginRight: 12 },
  tokenTitleText: { fontSize: 14, fontWeight: 'bold', color: '#000000' },
  tokenSubText: { fontSize: 11, color: '#9CA3AF', marginTop: 3, fontWeight: '700' },
  tokenAmountText: { fontSize: 14, fontWeight: 'bold', color: '#000000' },
  adjustButton: { flexDirection: 'row', height: 44, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 14 },
  adjustButtonText: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  addGoalFloatingButton: { position: 'absolute', bottom: 10, right: 10, width: 56, height: 56, borderRadius: 28, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },

  hugeGlowCircle: {
    position: 'absolute',
    width: 380,           // 화면을 큼직하게 덮을 거대한 크기
    height: 380,
    borderRadius: 190,
    right: -100,          // 시안의 오늘 추천~내 토큰 지갑 뒷배경 우측에 걸치도록 배치
    top: 360,
    backgroundColor: '#C7F5F1', // 아이엠 감성의 화사한 민트빛 오로라 광채
    opacity: 0.6,        // 은은하게 배경에 스며들도록 투명도 조절
  }
});