import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Polyline, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function GoalDetailScreen({ navigation, route }: any) {
    const [goalDetail, setGoalDetail] = useState<any>({
        itemName: '제주도 푸른 바다 여행',
        targetAmount: 300000,
        currentAmount: 204000,
        achievementRate: 68,
        endDate: '2026.08.30',
        dailyBudget: 20000,
        estimatedDate: '8월 20일',
    });

    const [loading, setLoading] = useState(false);

    const fetchGoalDetail = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch('http://localhost:8080/api/goals', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                const resData = await response.json();
                const goalsData = resData.data;

                if (goalsData && goalsData.shortGoal) {
                    const short = goalsData.shortGoal;
                    setGoalDetail({
                        itemName: short.itemName || '나의 저축 목표',
                        targetAmount: short.targetAmount || 0,
                        currentAmount: short.currentAmount || 0,
                        achievementRate: short.achievementRate || 0,
                        endDate: short.estimatedCompletionDate || short.endDate || '2026.08.30',
                        dailyBudget: short.dailyBudget || 20000,
                        estimatedDate: short.estimatedDate || '8월 20일',
                    });
                }
            }
        } catch (error) {
            console.log('🚨 목표 상세 API 통신 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoalDetail();
    }, []);

    const formatNumber = (num: number) => (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    //[단 1mm도 안 어긋나는 1:1 정밀 규격 세팅]
    const chartSize = 280;        // 차트 전체 프레임 크기 280x280
    const center = 140;           // 정중앙 중심점 (280의 절반 = 140)
    const radius = 110;           // 초록색 게이지가 도는 반지름 110
    const stroke = 20;            // 20px 두께의 시원한 초록색 선
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (goalDetail.achievementRate / 100) * circumference;

    //  초록색 선 맨 앞 끝자락 정중앙에 캐릭터 중심을 안착시키는 삼각함수 공식
    const charSize = 90;          // 캐릭터 이미지 크기 50x50
    const angle = (goalDetail.achievementRate / 100) * 360 - 90;
    const angleRad = (angle * Math.PI) / 180;

    // 원의 중심(140, 140)에서 반지름(110)만큼 떨어진 초록선 위에 캐릭터 중심 안착!
    const characterX = center + radius * Math.cos(angleRad) - charSize / 2;
    const characterY = center + radius * Math.sin(angleRad) - charSize / 2;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
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

                {/* ⭕ 1. 100% 완벽하게 결합된 원형 차트 & 캐릭터 & 중앙 퍼센트 */}
                <View style={styles.chartWrapper}>
                    {/* 가장 중요] 280x280 영역을 명확히 잡고 이 안에 모든 것을 중첩시킵니다! */}
                    <View style={{
                        width: chartSize,
                        height: chartSize,
                        position: 'relative',
                        alignSelf: 'center',
                        marginVertical: 10
                    }}>

                        {/* 1층: SVG 원형 그래프 (top: 0, left: 0으로 280 영역에 딱 맞춤) */}
                        <View style={{ position: 'absolute', top: 0, left: 0, width: chartSize, height: chartSize }}>
                            <Svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`} style={{ transform: [{ rotate: '-90deg' }] }}>
                                {/* 회색 배경 트랙 */}
                                <Circle
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    stroke="#F3F4F6"
                                    strokeWidth={stroke}
                                    fill="transparent"
                                />
                                {/* 실시간 민트색 초록 게이지 */}
                                <Circle
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    stroke="#009D8B"
                                    strokeWidth={stroke}
                                    strokeDasharray={`${circumference} ${circumference}`}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    fill="transparent"
                                />
                            </Svg>
                        </View>

                        {/* 2층: 🎯 퍼센트 글자! (top: 0, left: 0, 너비/높이를 280으로 똑같이 주어 무조건 원 정중앙에 갇히게 함!) */}
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 280,
                            height: 280,
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 5
                        }}>
                            <Text style={{
                                fontSize: 50,
                                fontWeight: '900',
                                color: '#009D8B',
                                letterSpacing: -1.5
                            }}>{goalDetail.achievementRate}%</Text>
                        </View>

                        {/* 3층: 🎯 달리는 캐릭터! (초록색 궤도 선 바로 위 정확한 좌표에 탑승) */}
                        <Image
                            source={require('../../assets/running_blue.png')}
                            style={{
                                position: 'absolute',
                                width: charSize,
                                height: charSize,
                                left: characterX,
                                top: characterY,
                                zIndex: 10,
                                resizeMode: 'contain'
                            }}
                        />
                    </View>
                    <Text style={styles.dateLineText}>{goalDetail.endDate}까지</Text>
                </View>

                {/* 2. 금액 지표 그리드 대시보드 */}
                <View style={styles.gridContainer}>
                    <View style={styles.gridRow}>
                        <View style={[styles.gridCell, { borderRightWidth: 1, borderRightColor: '#E5E7EB' }]}>
                            <Text style={styles.cellLabel}>목표 금액</Text>
                            <Text style={styles.cellValue}>{formatNumber(goalDetail.targetAmount)}원</Text>
                        </View>
                        <View style={styles.gridCell}>
                            <Text style={styles.cellLabel}>모은 금액</Text>
                            <Text style={styles.cellValue}>{formatNumber(goalDetail.currentAmount)}원</Text>
                        </View>
                    </View>
                    <View style={[styles.gridRow, { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 16 }]}>
                        <View style={{ paddingHorizontal: 16, width: '100%' }}>
                            <Text style={styles.cellLabel}>목표를 위한 일일 가용 금액</Text>
                            <Text style={[styles.cellValue, { textAlign: 'right', fontSize: 22, color: '#111827', marginTop: 4 }]}>
                                {formatNumber(goalDetail.dailyBudget)}원
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 3. 페이스 추이 선형 그래프 박스 구역 */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionCardTitle}>페이스 추이</Text>
                    <View style={styles.graphWrapper}>
                        <View style={styles.yAxisLabels}>
                            <Text style={styles.axisText}>100%</Text>
                            <Text style={styles.axisText}>75%</Text>
                            <Text style={styles.axisText}>50%</Text>
                            <Text style={styles.axisText}>25%</Text>
                            <Text style={styles.axisText}>0%</Text>
                        </View>

                        <View style={styles.mainGraphZone}>
                            <Svg height="140" width="100%">
                                <Defs>
                                    <SvgGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                                        <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                                    </SvgGradient>
                                </Defs>

                                <Line x1="0" y1="0" x2="240" y2="0" stroke="#E5E7EB" strokeWidth="1" />
                                <Line x1="0" y1="35" x2="240" y2="35" stroke="#E5E7EB" strokeWidth="1" />
                                <Line x1="0" y1="70" x2="240" y2="70" stroke="#E5E7EB" strokeWidth="1" />
                                <Line x1="0" y1="105" x2="240" y2="105" stroke="#E5E7EB" strokeWidth="1" />
                                <Line x1="0" y1="140" x2="240" y2="140" stroke="#9CA3AF" strokeWidth="1" />

                                <Line x1="160" y1="45" x2="160" y2="140" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3,3" />

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

                            <View style={styles.xAxisRow}>
                                <Text style={styles.axisText}>07.12</Text>
                                <Text style={[styles.axisText, { color: '#3B82F6', fontWeight: '700', marginLeft: 90 }]}>현재 {goalDetail.achievementRate}%</Text>
                                <Text style={[styles.axisText, { marginLeft: 'auto' }]}>8.30</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 🤖 4. AI 기반 목표 달성 예측 리포트 배너 */}
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

    chartWrapper: { alignItems: 'center', marginVertical: 10 },
    dateLineText: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 16 },

    gridContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, marginBottom: 20 },
    gridRow: { flexDirection: 'row', width: '100%' },
    gridCell: { flex: 1, paddingVertical: 16, paddingHorizontal: 20, justifyContent: 'center' },
    cellLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 6 },
    cellValue: { fontSize: 20, fontWeight: '800', color: '#111827' },

    sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', padding: 20, marginBottom: 16 },
    sectionCardTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },

    graphWrapper: { flexDirection: 'row', height: 165 },
    yAxisLabels: { width: 40, justifyContent: 'space-between', height: 140, paddingVertical: 2 },
    mainGraphZone: { flex: 1, height: 140, position: 'relative' },
    axisText: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
    xAxisRow: { flexDirection: 'row', width: '100%', marginTop: 8 },

    aiBadge: { backgroundColor: '#E6F6F4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
    aiBadgeText: { fontSize: 11, fontWeight: '700', color: '#009D8B' },
    aiPredictionMain: { fontSize: 14, fontWeight: '600', fontFamily: 'IM_Hyemin-Bold', color: '#4B5563' },
    aiPredictionHighlight: { fontSize: 18, fontWeight: '700', fontFamily: 'IM_Hyemin-Bold', color: '#111827', marginTop: 4 },
    aiBannerCharacter: { width: 70, height: 65, resizeMode: 'contain', marginTop: 10 }
});