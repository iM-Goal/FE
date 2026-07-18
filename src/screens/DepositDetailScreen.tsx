import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function DepositDetailScreen({ navigation }: any) {
    const [missionList, setMissionList] = useState<any[]>([]);
    const [totalLockedAmount, setTotalLockedAmount] = useState<string>('0');
    const [loading, setLoading] = useState<boolean>(true);

    const fetchDeposits = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch('http://localhost:8080/api/deposits', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            // 🎯 [핵심 동기화 가드 장치]: ChatScreen에서 일어난 연동 상태 플래그 포착
            const isMaturedFlag = await AsyncStorage.getItem('demo_deposit_is_matured') === 'true';
            const isWithdrawnFlag = await AsyncStorage.getItem('demo_deposit_withdrawn') === 'true';

            let sumLocked = 0;
            let list: any[] = [];

            // 🎯 로컬 저장소 수락 미션 검사
            const localAmountStr = await AsyncStorage.getItem('demo_locked_amount');
            const localTitle = await AsyncStorage.getItem('demo_locked_title');
            const localDurationStr = await AsyncStorage.getItem('demo_locked_duration');

            if (localAmountStr) {
                const localAmount = parseInt(localAmountStr, 10);
                const localDuration = localDurationStr ? parseInt(localDurationStr, 10) : 3;

                // 🎯 [시나리오 연동 1]: 출금이 끝난 상태가 아닐 때만 보호 총액 잔액으로 반영
                if (!isWithdrawnFlag) {
                    sumLocked += localAmount;
                }

                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + localDuration);
                const formattedExpiryDate = `${targetDate.getFullYear()}.${String(targetDate.getMonth() + 1).padStart(2, '0')}.${String(targetDate.getDate()).padStart(2, '0')}`;

                // 🎯 [시나리오 연동 2]: 플래그 유무에 따른 카드 상태 실시간 머신 변경
                let currentStatus = '진행 중';
                let currentDDay = `D-${localDuration}`;
                if (isWithdrawnFlag) {
                    currentStatus = '해제 완료';
                    currentDDay = '완료';
                } else if (isMaturedFlag) {
                    currentStatus = '만기 완료';
                    currentDDay = '만기';
                }

                list.push({
                    id: 'demo-local-mission',
                    name: localTitle ? localTitle.replace(/\d+일/, `${localDuration}일`) : `${localDuration}일 참아서 밸런스 맞추기`,
                    amount: `${localAmount.toLocaleString()}원`,
                    rawAmount: localAmount,
                    dDay: currentDDay,
                    date: isWithdrawnFlag ? `${formattedExpiryDate} 해제` : `${formattedExpiryDate} 만기`,
                    status: currentStatus
                });
            }

            // 백엔드 데이터 동기화
            if (response.status === 200) {
                const resData = await response.json();
                const deposits = resData.data;

                if (deposits && Array.isArray(deposits) && deposits.length > 0) {
                    deposits.forEach((item: any, index: number) => {
                        const isLocked = item.status === 'LOCKED' || item.status === '진행 중';
                        const itemAmount = item.amount || item.imkrwAmount || 0;

                        if (isLocked) sumLocked += itemAmount;

                        const targetDateStr = isLocked ? item.lockedAt : (item.releasedAt || item.lockedAt);
                        const formattedDate = targetDateStr ? targetDateStr.substring(0, 10).replace(/-/g, '.') : '2026.07.12';

                        // 중복 방지 처리하며 리스트 삽입
                        if (!list.some(existing => existing.id === item.id?.toString())) {
                            list.push({
                                id: item.id ? item.id.toString() : `dep-${index}`,
                                name: item.missionName || item.description || `${item.category || '절약'} 스마트 미션 보증금`,
                                amount: `${itemAmount.toLocaleString()}원`,
                                rawAmount: isLocked ? itemAmount : 0,
                                dDay: isLocked ? '진행중' : '완료',
                                date: targetDateStr ? `${formattedDate} ${isLocked ? '만기' : '해제'}` : '2026.07.12 만기',
                                status: isLocked ? '진행 중' : '해제 완료'
                            });
                        }
                    });
                }
            }

            setMissionList(list);
            setTotalLockedAmount(sumLocked.toLocaleString());

        } catch (error) {
            console.log('🚨 보증금 조회 실패:', error);
            setMissionList([]);
            setTotalLockedAmount('0');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDeposits();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>내 보증금 미션 리스트</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <LinearGradient colors={['#004B87', '#009D8B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>현재 스마트계약으로 보호 중인 보증금</Text>
                    <Text style={styles.summaryAmount}>{totalLockedAmount} 원</Text>
                    <Text style={styles.summaryDesc}>절약 미션 만기 성공 시, 해당 금액은 iM 주거래 예금 계좌로 즉시 자동 해제 및 복구됩니다.</Text>
                </LinearGradient>

                <Text style={styles.sectionTitle}>진행 현황 및 만기 타임라인</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#009D8B" />
                    </View>
                ) : missionList.length === 0 ? (
                    <View style={styles.emptyMissionContainer}>
                        <Ionicons name="shield-checkmark-outline" size={48} color="#9CA3AF" />
                        <Text style={styles.emptyMissionTitle}>보관 중인 보증금 미션이 없어요</Text>
                        <Text style={styles.emptyMissionDesc}>
                            절약 미션을 시작하면 스마트계약으로{"\n"}보증금을 안전하게 잠그고 마찰을 줄여드려요!
                        </Text>
                    </View>
                ) : (
                    <View style={styles.timelineContainer}>
                        {missionList.map((item, index) => {
                            const isCompleted = item.status === '해제 완료';
                            const isMatured = item.status === '만기 완료';

                            return (
                                <View key={item.id} style={styles.timelineItem}>
                                    <View style={styles.lineColumn}>
                                        <View style={[
                                            styles.timelineDot,
                                            (isCompleted || isMatured) ? { backgroundColor: '#009D8B', borderColor: '#E6F6F4' } : { backgroundColor: '#009D8B', borderColor: '#FFFFFF' }
                                        ]}>
                                            {(isCompleted || isMatured) && <Ionicons name="checkmark" size={8} color="#FFFFFF" />}
                                        </View>
                                        {index !== missionList.length - 1 && <View style={styles.timelineLine} />}
                                    </View>

                                    <View style={[
                                        styles.infoCard,
                                        isCompleted && styles.completedInfoCard,
                                        isMatured && { borderColor: '#D97706', borderWidth: 1.5 }
                                    ]}>
                                        <View style={styles.cardHeader}>
                                            <Text style={[
                                                styles.dDayText,
                                                isCompleted && { color: '#9CA3AF' },
                                                item.status === '진행 중' && { color: '#009D8B' },
                                                isMatured && { color: '#D97706' }
                                            ]}>{item.dDay}</Text>
                                            <View style={[
                                                styles.statusBadge,
                                                item.status === '진행 중' && { backgroundColor: '#E0F2FE' },
                                                isMatured && { backgroundColor: '#FEF3C7' },
                                                isCompleted && { backgroundColor: '#E6F6F4' }
                                            ]}>
                                                <Text style={[
                                                    styles.statusText,
                                                    item.status === '진행 중' && { color: '#0369A1' },
                                                    isMatured && { color: '#D97706' },
                                                    isCompleted && { color: '#009D8B' }
                                                ]}>{item.status}</Text>
                                            </View>
                                        </View>

                                        <Text style={[styles.missionName, isCompleted && { color: '#6B7280', textDecorationLine: 'none' }]}>
                                            {item.name}
                                        </Text>

                                        <View style={styles.cardFooter}>
                                            <Text style={styles.amountLabel}>
                                                {isCompleted ? '환원된 자산: ' : '연동 토큰 자산: '}
                                                <Text style={[styles.amountValue, isCompleted && { color: '#4B5563' }]}>{item.amount}</Text>
                                            </Text>
                                            <Text style={styles.dateText}>{item.date}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, height: 50, marginTop: 10 },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
    scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },

    summaryCard: { borderRadius: 20, padding: 20, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    summaryLabel: { fontSize: 12, color: '#EBF5F5', fontWeight: '500' },
    summaryAmount: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', marginTop: 6 },
    summaryDesc: { fontSize: 11, color: '#EBF5F5', marginTop: 12, lineHeight: 16, fontWeight: '400' },

    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 28, marginBottom: 16, letterSpacing: -0.2 },

    loadingContainer: { paddingVertical: 40, alignItems: 'center' },
    emptyMissionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: 8,
    },
    emptyMissionTitle: { fontSize: 15, fontWeight: '700', color: '#374151', marginTop: 12 },
    emptyMissionDesc: { fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 18, marginTop: 6 },

    timelineContainer: { paddingLeft: 4 },
    timelineItem: { flexDirection: 'row', minHeight: 115 },
    lineColumn: { alignItems: 'center', marginRight: 16, width: 14 },
    timelineLine: { width: 1.5, flex: 1, backgroundColor: '#E5E7EB', marginTop: -2 },

    timelineDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, zIndex: 2, justifyContent: 'center', alignItems: 'center' },

    infoCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    completedInfoCard: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', opacity: 0.8 },

    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dDayText: { fontSize: 18, fontWeight: '700' },
    statusBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 10, fontWeight: '700', color: '#4B5563' },
    missionName: { fontSize: 14, fontWeight: '700', color: '#111827', marginTop: 8 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8 },
    amountLabel: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
    amountValue: { color: '#004B87', fontWeight: '700' },
    dateText: { fontSize: 11, color: '#9CA3AF', fontWeight: '400' }
});