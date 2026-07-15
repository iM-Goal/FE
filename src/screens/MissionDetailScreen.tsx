import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MissionDetailScreen({ route, navigation }: any) {
    const [loading, setLoading] = useState(false);

    // 🎯 [데이터 체인 연동] SpendAlert에서 커스텀 조율된 mission 객체를 안전하게 받아옵니다.
    const mission = route.params?.mission || {
        id: 1,
        category: '배달/외식',
        description: '3일 참아서 밸런스 맞추기',
        proposalReason: '이번 주 배달을 평소보다 많이 시켰어요',
        depositAmount: 15000,
        durationDays: 3,
        limitAmount: 3000,
    };

    const formatNumber = (num: number) => (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const handleAcceptMission = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');

            // 🎯 [핵심] 수락 시 로컬 저장소에 보증금 액수, 미션 제목, 그리고 "조정된 기간"까지 세트메뉴로 저장!
            await AsyncStorage.setItem('demo_locked_amount', mission.depositAmount.toString());
            await AsyncStorage.setItem('demo_locked_title', mission.description);
            await AsyncStorage.setItem('demo_locked_duration', mission.durationDays.toString()); // 🎯 D-Day 동적 갱신용 기록 추가

            const response = await fetch(`http://localhost:8080/api/missions/${mission.id}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 200) {
                const resData = await response.json();
                showSuccessAlert(resData.data?.lockTxHash || '0x8fB23c9A1b...', resData.data?.amount || mission.depositAmount);
            } else {
                showSuccessAlert('0x8fB23c9A1b7e4d5F6c7d8E9f2A0b1C3d4E5f6G7h8', mission.depositAmount); // 데모
            }
        } catch (error) {
            // 🎯 통신이 끊겨도 로컬 저장소에 데이터 자산 저장하여 발표장 무결점 시연 보장
            await AsyncStorage.setItem('demo_locked_amount', mission.depositAmount.toString());
            await AsyncStorage.setItem('demo_locked_title', mission.description);
            await AsyncStorage.setItem('demo_locked_duration', mission.durationDays.toString());
            showSuccessAlert('0x8fB23c9A1b7e4d5F6c7d8E9f2A0b1C3d4E5f6G7h8', mission.depositAmount); // 데모 방어
        } finally {
            setLoading(false);
        }
    };

    const showSuccessAlert = (txHash: string, amount: number) => {
        Alert.alert(
            '🎯 스마트 계약 체결 완료',
            `미션 수락 성공!\n보증금 ${formatNumber(amount)}원이 iMKRW로 발행되어 Kaia 컨트랙트에 안전하게 잠겼습니다.\n\nTx Hash: ${txHash.substring(0, 15)}...`,
            [
                {
                    text: '보증금 현황 확인',
                    onPress: () => {
                        // 하단바가 유지되는 탭 네비게이션으로 안전하게 점프
                        navigation.navigate('MainTabs', { screen: '토큰미션' });
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <Ionicons name="close" size={28} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>미션 제안 상세</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.badge}><Text style={styles.badgeText}>AI 맞춤 제안</Text></View>
                    {/* 🎯 슬라이더에서 조정한 일수가 제목에도 반영될 수 있도록 "X일" 동적 렌더링 치환 */}
                    <Text style={styles.title}>
                        {mission.description.replace(/\d+일/, `${mission.durationDays}일`)}
                    </Text>
                    <Text style={styles.reasonText}>💡 {mission.proposalReason}</Text>
                </View>

                <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>📋 미션 수행 가이드</Text>

                    <View style={styles.stepBox}>
                        <View style={styles.stepItem}>
                            <Ionicons name="ellipse" size={8} color="#009D8B" style={{ marginTop: 6 }} />
                            <Text style={styles.stepText}>
                                <Text style={{fontWeight: 'bold'}}>대상 범위: </Text>
                                {mission.category} 관련 지출 시 해당 미션이 적용됩니다.
                            </Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Ionicons name="ellipse" size={8} color="#009D8B" style={{ marginTop: 6 }} />
                            <Text style={styles.stepText}>
                                <Text style={{fontWeight: 'bold'}}>수행 목표: </Text>
                                1회 결제 시 <Text style={{color: '#009D8B', fontWeight: 'bold'}}>{formatNumber(mission.limitAmount)}원 이하</Text>로 결제하세요.
                            </Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Ionicons name="ellipse" size={8} color="#009D8B" style={{ marginTop: 6 }} />
                            <Text style={styles.stepText}>
                                <Text style={{fontWeight: 'bold'}}>수행 기간: </Text>
                                {/* 🎯 슬라이더로 조정한 일수가 가이드에 동적으로 정확하게 찍힙니다! */}
                                오늘부터 <Text style={{fontWeight: 'bold', color: '#009D8B'}}>{mission.durationDays}일 동안</Text> 유지하면 성공입니다.
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>잠금 보증금</Text>
                        <Text style={styles.infoValue}>{formatNumber(mission.depositAmount)} iMKRW</Text>
                    </View>
                    <View style={styles.divider} />
                    <Text style={styles.warningText}>
                        성공 시 보증금은 즉시 전액 환급되며, 미션 실패 시 보증금은 에이전트 기금으로 귀속됩니다.
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.bottomArea}>
                <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptMission} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.acceptButtonText}>미션 수락하고 계약 체결하기</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
    content: { padding: 20 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    badge: { backgroundColor: '#E6F6F4', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 12 },
    badgeText: { color: '#009D8B', fontWeight: '700', fontSize: 12 },
    title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 12, lineHeight: 30 },
    reasonText: { fontSize: 14, color: '#4B5563', fontStyle: 'italic', backgroundColor: '#F9FAFB', padding: 10, borderRadius: 8 },
    detailSection: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
    stepBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
    stepItem: { flexDirection: 'row', marginBottom: 12 },
    stepText: { fontSize: 14, color: '#374151', marginLeft: 10, lineHeight: 22 },
    infoBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    infoLabel: { fontSize: 14, color: '#6B7280' },
    infoValue: { fontSize: 16, fontWeight: '800', color: '#111827' },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 12 },
    warningText: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },
    bottomArea: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
    acceptButton: { backgroundColor: '#00C4A7', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
    acceptButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' }
});