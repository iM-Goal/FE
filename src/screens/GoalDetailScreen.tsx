import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Polyline, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function GoalDetailScreen({ navigation, route }: any) {
    // 🎯 [데이터 싱크 단일화] 초기 스펙 및 연동 데이터의 수치 구조 전면 통일
    const [goalDetail, setGoalDetail] = useState<any>({
        itemName: '제주도 푸른 바다 여행 ✈️',
        targetAmount: 300000,
        currentAmount: 0,        // 🎯 최초 0원 상태 동기화
        achievementRate: 0,      // 🎯 최초 0% 상태 동기화
        endDate: '2026.08.30',
        daysLeft: 45,
        dailyBudget: 50000,      // 🎯 일일 가용 예산 5만원 싱크 매핑
        estimatedDate: '8월 30일', // 🎯 만기일과 AI 분석 타깃일 매칭
    });

    const [loading, setLoading] = useState(false);

    // 📡 [API 연동 및 수치 맞춤 개조]
    const fetchGoalProgress = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const goalId = route.params?.goalId || 1;

            const response = await fetch(`http://localhost:8080/api/goals/${goalId}/progress`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            // 🎯 로컬 미션 수락에 따른 강제 데이터 트리거 싱크 체크
            const localLockedStr = await AsyncStorage.getItem('demo_locked_amount');
            const hasAcceptedLocalMission = localLockedStr !== null;

            if (response.status === 200) {
                const resData = await response.json();
                const progress = resData.data;

                if (progress) {
                    // 날짜 데이터 파싱 및 가공 (2026-08-30 -> 월/일 추출)
                    let displayEstimated = '8월 30일';
                    let formattedXAxisDate = '8.30';

                    if (progress.estimatedCompletionDate) {
                        const dateParts = progress.estimatedCompletionDate.split('-');
                        if (dateParts.length === 3) {
                            displayEstimated = `${parseInt(dateParts[1], 10)}월 ${parseInt(dateParts[2], 10)}일`;
                            formattedXAxisDate = `${parseInt(dateParts[1], 10)}.${parseInt(dateParts[2], 10)}`;
                        }
                    }

                    setGoalDetail((prev: any) => ({
                        ...prev,
                        currentAmount: progress.currentAmount ?? prev.currentAmount,
                        achievementRate: progress.achievementRate ?? prev.achievementRate,
                        daysLeft: progress.daysLeft ?? prev.daysLeft,
                        endDate: progress.estimatedCompletionDate
                            ? progress.estimatedCompletionDate.replace(/-/g, '.')
                            : prev.endDate,
                        estimatedDate: displayEstimated,
                        xAxisEndDate: formattedXAxisDate
                    }));
                }
            } else if (hasAcceptedLocalMission) {
                // 🔥 [트리거 이후 오프라인 상태]: 미션 수락 후 수치 체인 동기화
                setGoalDetail((prev: any) => ({
                    ...prev,
                    currentAmount: 15000,      // 가짜 결제 및 미션 자산화 반영
                    achievementRate: 5.0,      // 300,000원 중 15,000원으로 5% 달성률 보정
                    daysLeft: 45,
                    endDate: '2026.08.30',
                    estimatedDate: '8월 30일',
                    xAxisEndDate: '8.30'
                }));
            }
        } catch (error) {
            console.log('🚨 목표 진행률 데이터 싱크 에러:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoalProgress();
    }, []);

    const formatNumber = (num: number) => (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // [단 1mm도 안 어긋나는 1:1 정밀 규격 세팅]
    const chartSize = 280;
    const center = 140;
    const radius = 110;
    const stroke = 20;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (goalDetail.achievementRate / 100) * circumference;

    // 캐릭터 궤도 삼각함수 공식 계산부
    const charSize = 90;
    const angle = (goalDetail.achievementRate / 100) * 360 - 90;
    const angleRad = (angle * Math.PI) / 180;

    const characterX = center + radius * Math.cos(angleRad) - charSize / 2;
    const characterY = center + radius * Math.sin(angleRad) - charSize / 2;

    // 그래프 X축 우측 끝 날짜 동적 파싱 계산 보정
    const getXAxisEndDate = () => {
        if (goalDetail.xAxisEndDate) return goalDetail.xAxisEndDate;
        const parts = goalDetail.endDate.split('.');
        if (parts.length === 3) return `${parseInt(parts[1], 10)}.${parseInt(parts[2], 10)}`;
        return '8.30';
    };

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

                {/* ⭕ 1. 완벽하게 결합된 원형 차트 & 캐릭터 & 중앙 퍼센트 */}
                <View style={styles.chartWrapper}>
                    <View style={{
                        width: chartSize,
                        height: chartSize,
                        position: 'relative',
                        alignSelf: 'center',
                        marginVertical: 10
                    }}>

                        {/* 1층: SVG 원형 그래프 */}
                        <View style={{ position: 'absolute', top: 0, left: 0, width: chartSize, height: chartSize }}>
                            <Svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`} style={{ transform: [{ rotate: '-90deg' }] }}>
                                <Circle
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    stroke="#F3F4F6"
                                    strokeWidth={stroke}
                                    fill="transparent"
                                />
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

                        {/* 2층: 🎯 퍼센트 글자 */}
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
                            {loading ? (
                                <ActivityIndicator size="small" color="#009D8B" />
                            ) : (
                                <Text style={{
                                    fontSize: 50,
                                    fontWeight: '900',
                                    color: '#009D8B',
                                    letterSpacing: -1.5
                                }}>{Math.round(goalDetail.achievementRate)}%</Text>
                            )}
                        </View>

                        {/* 3층: 🎯 달리는 캐릭터 */}
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

                    {/* 🎯 [디자인 고도화] 남은 일수 디데이와 완료 예정 날짜 완전 결합 */}
                    <Text style={styles.dateLineText}>
                        목표일까지 <Text style={{color: '#009D8B'}}>D-{goalDetail.daysLeft}일</Text> ({goalDetail.endDate} 완료 예정)
                    </Text>
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
                            {/* 🎯 다른 화면들과 완벽하게 싱크로율을 맞춘 누적 저축 금액 동적 노출 */}
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
                                <Text style={[styles.axisText, { color: '#3B82F6', fontWeight: '700', marginLeft: 90 }]}>현재 {Math.round(goalDetail.achievementRate)}%</Text>
                                {/* 🎯 [날짜 싱크 수정]: 그래프 하단의 가장 오른쪽 끝 만기 날짜도 완벽 동적 치환 */}
                                <Text style={[styles.axisText, { marginLeft: 'auto' }]}>{getXAxisEndDate()}</Text>
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
                            {/* 🎯 [날짜 싱크 수정]: 상단 목표 완료일과 완벽하게 매칭되도록 일치화 */}
                            <Text style={{ color: '#009D8B', fontWeight: '800' }}>{goalDetail.estimatedDate} 달성 가능</Text>해요!
                        </Text>
                    </View>
                    <Image source={require('../../assets/main_blue.png')} style={styles.aiBannerCharacter} />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

// 스타일 명세는 기존 규칙을 그대로 유지합니다.
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, height: 56 },
    backButton: { padding: 4 },
    editButton: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },

    scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },

    chartWrapper: { alignItems: 'center', marginVertical: 10 },
    dateLineText: { fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 16 },

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