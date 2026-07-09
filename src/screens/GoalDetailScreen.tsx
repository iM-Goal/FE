import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Polyline, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function GoalDetailScreen({ navigation, route }: any) {
    // 🔄 나중에 AI API와 직결할 핵심 데이터 구조 (현재는 시안 데이터로 가이드 빌드)
    const [goalDetail, setGoalDetail] = useState<any>({
        itemName: '제주도 여행',
        targetAmount: 300000,
        currentAmount: 204000,
        achievementRate: 68,
        endDate: '2025.07.31',
        dailyBudget: 20000,
        estimatedDate: '7월 20일',
    });

    const [loading, setLoading] = useState(false);

    // 🌐 [추후 작업] AI API 연동부 (GET /goals/{goalId} 주석 처리로 대기)
    /*
    const fetchGoalDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/goals/1`);
        if (response.status === 200) {
          const data = await response.json();
          setGoalDetail(data);
        }
      } catch (e) { console.log(e); }
    };
    useEffect(() => { fetchGoalDetail(); }, []);
    */

    // 📐 원형 그래프 공식 계산 장치
    const radius = 90;
    const stroke = 16;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (goalDetail.achievementRate / 100) * circumference;

    // 🏃‍♂️ 68% 원주율 끝자락에 맞춰 캐릭터를 회전 및 위치시키는 삼각함수 좌표 계산법
    const angle = (goalDetail.achievementRate / 100) * 360 - 90;
    const angleRad = (angle * Math.PI) / 180;
    const characterX = 110 + normalizedRadius * Math.cos(angleRad) - 25; // 중심점 110
    const characterY = 110 + normalizedRadius * Math.sin(angleRad) - 25;

    return (
        <SafeAreaView style={styles.container}>
            {/*  Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{goalDetail.itemName}</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="create-outline" size={22} color="#000000" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* ⭕ 1. 원형 프로그레스 차트 및 위를 달리는 캐릭터 링 구역 */}
                <View style={styles.chartWrapper}>
                    <View style={{ width: 220, height: 220, position: 'relative' }}>
                        <Svg height="220" width="220" style={{ transform: [{ rotate: '-90deg' }] }}>
                            {/* 회색 비활성 배경 트랙 */}
                            <Circle
                                stroke="#F3F4F6"
                                fill="transparent"
                                strokeWidth={stroke}
                                r={normalizedRadius}
                                cx="110"
                                cy="110"
                            />
                            {/* iM 시그니처 민트색 실시간 게이지 링 */}
                            <Circle
                                stroke="#009D8B"
                                fill="transparent"
                                strokeWidth={stroke}
                                strokeDasharray={circumference + ' ' + circumference}
                                style={{ strokeDashoffset }}
                                strokeLinecap="round"
                                r={normalizedRadius}
                                cx="110"
                                cy="110"
                            />
                        </Svg>

                        {/* 원형 정중앙 % 노출 디스플레이 */}
                        <View style={styles.percentTextContainer}>
                            <Text style={styles.percentNumberText}>{goalDetail.achievementRate}%</Text>
                        </View>

                        {/* 원 위에 얹어져서 달리는 캐릭터 이미지 */}
                        <Image
                            source={require('../../assets/running_blue.png')} // 스키타는 비주얼 매칭
                            style={[styles.runningCharacter, { left: characterX, top: characterY }]}
                        />
                    </View>
                    <Text style={styles.dateLineText}>{goalDetail.endDate}까지</Text>
                </View>

                {/* 2. 금액 지표 그리드 대시보드 */}
                <View style={styles.gridContainer}>
                    <View style={styles.gridRow}>
                        <View style={[styles.gridCell, { borderRightWidth: 1, borderRightColor: '#E5E7EB' }]}>
                            <Text style={styles.cellLabel}>목표 금액</Text>
                            <Text style={styles.cellValue}>{goalDetail.targetAmount.toLocaleString()}원</Text>
                        </View>
                        <View style={styles.gridCell}>
                            <Text style={styles.cellLabel}>모은 금액</Text>
                            <Text style={styles.cellValue}>{goalDetail.currentAmount.toLocaleString()}원</Text>
                        </View>
                    </View>
                    <View style={[styles.gridRow, { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 16 }]}>
                        <View style={{ paddingHorizontal: 16, width: '100%' }}>
                            <Text style={styles.cellLabel}>목표를 위한 일일 가용 금액</Text>
                            <Text style={[styles.cellValue, { textAlign: 'right', fontSize: 22, color: '#111827', marginTop: 4 }]}>
                                {goalDetail.dailyBudget.toLocaleString()}원
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 3. 페이스 추이 선형 그래프 박스 구역 */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionCardTitle}>페이스 추이</Text>
                    <View style={styles.graphWrapper}>
                        {/* 좌측 Y축 라벨 범례 */}
                        <View style={styles.yAxisLabels}>
                            <Text style={styles.axisText}>100%</Text>
                            <Text style={styles.axisText}>75%</Text>
                            <Text style={styles.axisText}>50%</Text>
                            <Text style={styles.axisText}>25%</Text>
                            <Text style={styles.axisText}>0%</Text>
                        </View>

                        {/* SVG 차트 드로잉 그리드 (시안 도트 완벽 정밀 마킹) */}
                        <View style={styles.mainGraphZone}>
                            <Svg height="140" width="100%">
                                <Defs>
                                    <SvgGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                                        <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                                    </SvgGradient>
                                </Defs>

                                {/* 수평 가이드선 실선 그리드 */}
                                <Line x1="0" y1="0" x2="240" y2="0" stroke="#E5E7EB" strokeWidth="1" />
                                <Line x1="0" y1="35" x2="240" y2="35" stroke="#E5E7EB" strokeWidth="1" />
                                <Line x1="0" y1="70" x2="240" y2="70" stroke="#E5E7EB" strokeWidth="1" />
                                <Line x1="0" y1="105" x2="240" y2="105" stroke="#E5E7EB" strokeWidth="1" />
                                <Line x1="0" y1="140" x2="240" y2="140" stroke="#9CA3AF" strokeWidth="1" />

                                {/* 현재 68% 수직 Dotted 가이드라인 */}
                                <Line x1="160" y1="45" x2="160" y2="140" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3,3" />

                                {/* 페이스 추이 꺾은선 실선 및 그래디언트 면적 스케치 */}
                                <Polyline
                                    points="0,140 40,115 80,75 120,80 160,45 230,0"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="2"
                                />
                                <Polyline
                                    points="0,140 40,115 80,75 120,80 160,45 230,0 230,140 0,140"
                                    fill="url(#grad)"
                                />
                            </Svg>

                            {/* X축 시간차 범례 바 */}
                            <View style={styles.xAxisRow}>
                                <Text style={styles.axisText}>6/28</Text>
                                <Text style={[styles.axisText, { color: '#3B82F6', fontWeight: '700', marginLeft: 100 }]}>현재 68%</Text>
                                <Text style={[styles.axisText, { marginLeft: 'auto' }]}>7/20</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 🤖 4. AI 기반 목표 달성 예측 리포트 배너 박스 */}
                <View style={[styles.sectionCard, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 }]}>
                    <View>
                        <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI 예측</Text></View>
                        <Text style={styles.aiPredictionMain}>현재 페이스를 유지하면</Text>
                        <Text style={styles.aiPredictionHighlight}>
                            <Text style={{ color: '#009D8B', fontWeight: '800' }}>{goalDetail.estimatedDate} 달성 가능</Text>해요!
                        </Text>
                    </View>
                    <Image source={require('../../assets/main_blue.png')} style={styles.aiBannerCharacter} />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, height: 56 },
    backButton: { padding: 4 },
    editButton: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },

    scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },

    // ⭕ 원형 차트 영역
    chartWrapper: { alignItems: 'center', marginVertical: 20 },
    percentTextContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    percentNumberText: { fontSize: 44, fontWeight: '900', color: '#009D8B', letterSpacing: -1 },
    runningCharacter: { width: 44, height: 44, position: 'absolute', resizeMode: 'contain' },
    dateLineText: { fontSize: 14, fontWeight: '700', color: '#111827', marginTop: 16 },

    // 📊 그리드 지표 레이아웃
    gridContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, marginBottom: 20 },
    gridRow: { flexDirection: 'row', width: '100%' },
    gridCell: { flex: 1, paddingVertical: 16, paddingHorizontal: 20, justifyContent: 'center' },
    cellLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 6 },
    cellValue: { fontSize: 20, fontWeight: '800', color: '#111827' },

    // 📈 섹션 카드 프레임
    sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', padding: 20, marginBottom: 16 },
    sectionCardTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },

    // 그래프 얼라인먼트
    graphWrapper: { flexDirection: 'row', height: 165 },
    yAxisLabels: { width: 40, justifyContent: 'space-between', height: 140, paddingVertical: 2 },
    mainGraphZone: { flex: 1, height: 140, position: 'relative' },
    axisText: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
    xAxisRow: { flexDirection: 'row', width: '100%', marginTop: 8 },

    // 🤖 AI 예측 배너 전용 인테리어
    aiBadge: { backgroundColor: '#E6F6F4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
    aiBadgeText: { fontSize: 11, fontWeight: '700', color: '#009D8B' },
    aiPredictionMain: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
    aiPredictionHighlight: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 4 },
    aiBannerCharacter: { width: 70, height: 65, resizeMode: 'contain', marginTop: 10 }
});