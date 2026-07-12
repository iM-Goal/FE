import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

export default function SpendingCategory({ navigation, route }: any) {
  const { width, height } = useWindowDimensions();
  const widthScale = width / BASE_SCREEN_WIDTH;
  const heightScale = height / BASE_SCREEN_HEIGHT;
  const sizeScale = width / BASE_SCREEN_WIDTH;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  // 🎯 앞 화면에서 인계받은 실시간 비율 통계 데이터 객체 구조분해 할당
  const categoryData = route.params?.categoryData || [
    { name: '식비', percentage: 55, color: '#014C43', amount: 134750 },
    { name: '주거 · 통신', percentage: 20, color: '#00B395', amount: 49000 },
    { name: '교통 · 자동차', percentage: 12, color: '#00E676', amount: 29400 },
    { name: '의료', percentage: 8, color: '#A7F3D0', amount: 19600 },
    { name: '그 외 n개', percentage: 5, color: '#CBD5E1', amount: 12250 }
  ];

  const totalSpend = route.params?.totalSpend || categoryData.reduce((acc: number, cur: any) => acc + (cur.amount || 0), 0);

  const donutRadius = 38;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedPercent = 0;

  // 🎯 거래 영수증 장부 데이터 실시간 연동
  const fetchTransactionHistory = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://localhost:8080/api/transactions/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        const resData = await response.json();
        if (resData.data && Array.isArray(resData.data)) {
          setAllTransactions(resData.data);
        }
      }
    } catch (error) {
      console.log('🚨 상세 영수증 조회 실패 (가이드 폴백 활성화):', error);
      setAllTransactions([
        { merchant: '배달의민족 / 스마트 결제', amount: 15000, category: '식비', transactedAt: '2026-07-12T16:48:00.000Z' },
        { merchant: '스타벅스 강남점', amount: 6500, category: '식비', transactedAt: '2026-07-12T12:30:00.000Z' },
        { merchant: 'SKT 통신비 자동이체', amount: 49000, category: '주거 · 통신', transactedAt: '2026-07-10T09:00:00.000Z' },
        { merchant: '지하철 정기권 충전', amount: 29400, category: '교통 · 자동차', transactedAt: '2026-07-08T08:15:00.000Z' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  // 🎯 선택된 카테고리에 알맞는 진짜 결제 거래 내역을 그룹핑하여 반환하는 로직
  const getFilteredTransactions = (categoryName: string) => {
    const filtered = allTransactions.filter(tx => {
      if (categoryName.includes('그 외')) return !['식비', '주거 · 통신', '교통 · 자동차', '의료'].includes(tx.category);
      return tx.category === categoryName || (categoryName === '식비' && ['카페', '배달', '음식점'].includes(tx.category));
    });

    if (filtered.length === 0) return [{ date: '결제 내역 없음', items: [] }];

    const grouped: { [key: string]: any[] } = {};
    filtered.forEach(tx => {
      const dateObj = new Date(tx.transactedAt || Date.now());
      const month = dateObj.getMonth() + 1;
      const date = dateObj.getDate();
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      const dateStr = `${month}월 ${date}일 ${dayNames[dateObj.getDay()]}요일`;

      if (!grouped[dateStr]) grouped[dateStr] = [];
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');

      grouped[dateStr].push({
        name: tx.merchant || '결제처 없음',
        time: `${hours}:${minutes}`,
        amount: `- ${(tx.amount || 0).toLocaleString()}원`
      });
    });

    return Object.keys(grouped).map(dateKey => ({ date: dateKey, items: grouped[dateKey] }));
  };

  const handleToggleCategory = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={[styles.header, { paddingTop: 16 * heightScale, paddingBottom: 12 * heightScale, paddingHorizontal: 24 * sizeScale }]}>
          <Text style={[styles.logo, { fontSize: 16 * sizeScale }]}>
            <Text style={styles.logoDot}>iM</Text> Agent <Text style={styles.logoAccent}>iX</Text>
          </Text>
        </View>

        <View style={[styles.titleBar, { paddingHorizontal: 24 * sizeScale, marginVertical: 12 * heightScale }]}>
          {/* 🎯 [버그 탈출] navigate 지우고 빽스택 라우팅 적용 완료 */}
          <TouchableOpacity style={{ marginRight: 10 * sizeScale }} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <View style={styles.backRow}>
              <Ionicons name="chevron-back" size={28} color="#111827" />
              <Text style={[styles.titleText, { fontSize: 24 * sizeScale }]}>카테고리별 소비</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.topSummaryRow, { paddingHorizontal: 24 * sizeScale, paddingBottom: 20 * heightScale, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 16 * heightScale }]}>
          <View style={styles.flexRowBetween}>
            <View style={{ flex: 1.2, justifyContent: 'center' }}>
              <View style={[styles.monthNavRow, { alignItems: 'center', marginBottom: 10 * heightScale }]}>
                <TouchableOpacity activeOpacity={0.7}>
                  <Ionicons name="caret-back" size={16} color="#4B5563" />
                </TouchableOpacity>
                <Text style={[styles.monthText, { fontSize: 20 * sizeScale, marginHorizontal: 12 * sizeScale }]}>이번 주</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Ionicons name="caret-forward" size={16} color="#D1D5DB" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.amountText, { fontSize: 28 * sizeScale }]}>{totalSpend.toLocaleString()}원</Text>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
              <View style={{ width: 140 * sizeScale, height: 140 * sizeScale }}>
                <Svg width="100%" height="100%" viewBox="0 0 100 100">
                  <G transform="rotate(-90 50 50)">
                    {categoryData.map((category: any, index: number) => {
                      const strokeLength = (category.percentage / 100) * donutCircumference;
                      const strokeDashoffset = -accumulatedPercent;
                      accumulatedPercent += strokeLength;

                      return (
                          <Circle key={index} cx="50" cy="50" r={donutRadius} fill="transparent" stroke={category.color} strokeWidth="14" strokeDasharray={[strokeLength, donutCircumference]} strokeDashoffset={strokeDashoffset} />
                      );
                    })}
                  </G>
                </Svg>
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 * heightScale }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 24 * sizeScale }}>
            {categoryData.map((category: any, index: number) => {
              const isExpanded = expandedIndex === index;
              const categoryTransactions = getFilteredTransactions(category.name);

              return (
                  <View key={index} style={styles.accordionContainer}>
                    <TouchableOpacity style={[styles.categoryRow, { paddingVertical: 16 * heightScale }, !isExpanded && styles.borderBottom]} onPress={() => handleToggleCategory(index)} activeOpacity={0.7}>
                      <View style={styles.leftRowInfo}>
                        <View style={[{ width: 36 * sizeScale, height: 36 * sizeScale, borderRadius: (36 * sizeScale) / 2, marginRight: 16 * sizeScale }, { backgroundColor: category.color }]} />
                        <View>
                          <Text style={[styles.categoryName, { fontSize: 16 * sizeScale }]}>{category.name}</Text>
                          <Text style={[styles.categoryPercent, { fontSize: 12 * sizeScale, marginTop: 2 * heightScale }]}>{category.percentage}%</Text>
                        </View>
                      </View>

                      <View style={styles.rightRowInfo}>
                        <Text style={[styles.categoryAmount, { fontSize: 16 * sizeScale, marginRight: 8 * sizeScale }]}>{(category.amount || 0).toLocaleString()}원</Text>
                        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#9CA3AF" />
                      </View>
                    </TouchableOpacity>

                    {isExpanded && (
                        <View style={{ paddingLeft: 52 * sizeScale, paddingRight: 4 * sizeScale, paddingTop: 8 * heightScale, paddingBottom: 16 * heightScale, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                          {loading ? (
                              <ActivityIndicator size="small" color="#009D8B" style={{ marginVertical: 10 }} />
                          ) : (
                              categoryTransactions.map((group, groupIdx) => (
                                  <View key={groupIdx} style={styles.dateGroup}>
                                    <Text style={[styles.dateHeader, { fontSize: 12 * sizeScale, marginVertical: 10 * heightScale }]}>{group.date}</Text>
                                    {group.items.length === 0 ? (
                                        <Text style={{ fontSize: 12, color: '#9CA3AF', marginVertical: 4 }}>해당 내역이 존재하지 않습니다.</Text>
                                    ) : (
                                        group.items.map((tx: any, txIdx: number) => (
                                            <View key={txIdx} style={[styles.transactionRow, txIdx > 0 && { marginTop: 12 }]}>
                                              <View style={[styles.avatarCircle, { width: 36 * sizeScale, height: 36 * sizeScale, borderRadius: (36 * sizeScale) / 2, marginRight: 10 * sizeScale }]} />
                                              <View style={styles.transactionInfo}>
                                                <Text style={[styles.merchantName, { fontSize: 13 * sizeScale }]}>{tx.name}</Text>
                                                <Text style={[styles.timeText, { fontSize: 11 * sizeScale, marginTop: 2 * heightScale }]}>{tx.time}</Text>
                                              </View>
                                              <Text style={[styles.txAmountText, { fontSize: 14 * sizeScale }]}>{tx.amount}</Text>
                                            </View>
                                        ))
                                    )}
                                  </View>
                              ))
                          )}
                        </View>
                    )}
                  </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  logo: { color: '#151B1E', fontWeight: '800', letterSpacing: -0.5 },
  logoDot: { color: '#009D8B' },
  logoAccent: { color: '#009D8B' },
  titleBar: { flexDirection: 'row', alignItems: 'center' },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  titleText: { fontWeight: 'bold', color: '#111827', marginLeft: 4 },
  scrollView: { flex: 1 },
  monthNavRow: { flexDirection: 'row' },
  monthText: { color: '#111827', fontWeight: 'bold' },
  amountText: { color: '#111827', fontWeight: 'bold' },
  flexRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accordionContainer: { width: '100%' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  leftRowInfo: { flexDirection: 'row', alignItems: 'center' },
  categoryName: { color: '#111827', fontWeight: 'bold' },
  categoryPercent: { color: '#94A3B8', fontWeight: '600' },
  rightRowInfo: { flexDirection: 'row', alignItems: 'center' },
  categoryAmount: { color: '#111827', fontWeight: 'bold' },
  dateGroup: { marginBottom: 16 },
  dateHeader: { fontWeight: 'bold', color: '#94A3B8' },
  transactionRow: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { backgroundColor: '#CBD5E1' },
  transactionInfo: { flex: 1 },
  merchantName: { fontWeight: 'bold', color: '#334155' },
  timeText: { color: '#94A3B8' },
  txAmountText: { fontWeight: 'bold', color: '#1E293B' },
});