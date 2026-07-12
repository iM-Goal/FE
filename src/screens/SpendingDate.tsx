import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

export default function SpendingDate({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const widthScale = width / BASE_SCREEN_WIDTH;
  const heightScale = height / BASE_SCREEN_HEIGHT;
  const sizeScale = width / BASE_SCREEN_WIDTH;

  const [selectedDate, setSelectedDate] = useState(23);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const calendarWeeks = [
    [
      { date: 1, hasLabel: true, labelAmount: '- 12,000' },
      { date: 2, hasLabel: false },
      { date: 3, hasLabel: true, labelAmount: '- 8,500' },
      { date: 4, hasLabel: false },
      { date: 5, hasLabel: false },
      { date: 6, hasLabel: false },
      { date: 7, hasLabel: false }
    ],
    [
      { date: 8, hasLabel: true, labelAmount: '- 45,000' },
      { date: 9, hasLabel: false },
      { date: 10, hasLabel: true, labelAmount: '- 14,000' },
      { date: 11, hasLabel: false },
      { date: 12, hasLabel: false },
      { date: 13, hasLabel: true, labelAmount: '- 9,000' },
      { date: 14, hasLabel: false }
    ],
    [
      { date: 15, hasLabel: false },
      { date: 16, hasLabel: false },
      { date: 17, hasLabel: false },
      { date: 18, hasLabel: false },
      { date: 19, hasLabel: false },
      { date: 20, hasLabel: false },
      { date: 21, hasLabel: false }
    ],
    [
      { date: 22, hasLabel: true, labelAmount: '- 32,000' },
      { date: 23, hasLabel: false },
      { date: 24, hasLabel: true, labelAmount: '- 21,000' },
      { date: 25, hasLabel: false },
      { date: 26, hasLabel: false },
      { date: 27, hasLabel: false },
      { date: 28, hasLabel: false }
    ]
  ];

  const transactions = [
    {
      date: '이번 주 주요 내역',
      items: [
        { name: '배달의민족', time: '16:48', amount: '- 15,000원' },
        { name: '쿠팡이츠', time: '09:12', amount: '- 11,000원' },
        { name: '요기요', time: '20:10', amount: '- 12,000원' }
      ]
    }
  ];

  const dynamicStyles = StyleSheet.create({
    contentContainer: { paddingBottom: 40 * heightScale },
    header: { paddingTop: 16 * heightScale, paddingBottom: 12 * heightScale, paddingHorizontal: 24 * sizeScale },
    logo: { fontSize: 16 * sizeScale },
    titleBar: { paddingHorizontal: 24 * sizeScale, marginVertical: 12 * heightScale },
    backButton: { marginRight: 10 * sizeScale },
    titleText: { fontSize: 24 * sizeScale },
    monthNavRow: { justifyContent: 'center', alignItems: 'center', marginVertical: 16 * heightScale },
    monthText: { fontSize: 20 * sizeScale, marginHorizontal: 16 * sizeScale },
    calendarGrid: { paddingHorizontal: 24 * sizeScale, marginBottom: 24 * heightScale },
    dayOfWeekLabel: { width: 44 * sizeScale, fontSize: 13 * sizeScale, marginBottom: 12 * heightScale },
    calendarRow: { marginBottom: 16 * heightScale },
    calendarDayCell: { width: 44 * sizeScale },
    dateCircle: { width: 34 * sizeScale, height: 34 * sizeScale, borderRadius: (34 * sizeScale) / 2 },
    dateText: { fontSize: 15 * sizeScale },
    subLabelText: { fontSize: 8 * sizeScale, marginTop: 4 * heightScale },
    filterDropdownRow: { paddingHorizontal: 24 * sizeScale, marginBottom: 16 * heightScale },
    dropdownText: { fontSize: 15 * sizeScale, marginRight: 4 * sizeScale },
    transactionsCard: { marginHorizontal: 24 * sizeScale, padding: 20 * sizeScale, borderRadius: 24 * sizeScale },
    dateHeader: { fontSize: 12 * sizeScale, marginBottom: 12 * heightScale },
    avatarCircle: { width: 40 * sizeScale, height: 40 * sizeScale, borderRadius: (40 * sizeScale) / 2, marginRight: 12 * sizeScale },
    merchantName: { fontSize: 14 * sizeScale },
    timeText: { fontSize: 11 * sizeScale, marginTop: 2 * heightScale },
    txAmountText: { fontSize: 15 * sizeScale },
  });

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={[styles.logo, dynamicStyles.logo]}>
            <Text style={styles.logoDot}>iM</Text> Agent <Text style={styles.logoAccent}>iX</Text>
          </Text>
        </View>

        <View style={[styles.titleBar, dynamicStyles.titleBar]}>
          <TouchableOpacity style={dynamicStyles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <View style={styles.backRow}>
              <Ionicons name="chevron-back" size={28} color="#111827" />
              <Text style={[styles.titleText, dynamicStyles.titleText]}>소비 달력</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.monthNavRow, dynamicStyles.monthNavRow]}>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="caret-back" size={18} color="#4B5563" />
          </TouchableOpacity>
          <Text style={[styles.monthText, dynamicStyles.monthText]}>이번 달</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="caret-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        <View style={[styles.calendarGrid, dynamicStyles.calendarGrid]}>
          <View style={styles.flexRowBetween}>
            {weekDays.map((day, idx) => (
                <Text key={idx} style={[styles.dayOfWeekLabel, dynamicStyles.dayOfWeekLabel]}>{day}</Text>
            ))}
          </View>

          {calendarWeeks.map((week, weekIdx) => (
              <View key={weekIdx} style={[styles.flexRowBetween, dynamicStyles.calendarRow]}>
                {week.map((dayItem, dayIdx) => {
                  const isHighlight = dayItem.date === selectedDate;
                  return (
                      <TouchableOpacity key={dayIdx} style={[styles.calendarDayCell, dynamicStyles.calendarDayCell]} onPress={() => dayItem.date && setSelectedDate(dayItem.date)} activeOpacity={0.8}>
                        <View style={[styles.dateCircle, dynamicStyles.dateCircle, isHighlight && styles.highlightedDateCircle]}>
                          <Text style={[styles.dateText, dynamicStyles.dateText, isHighlight ? styles.highlightedDateText : styles.normalDateText]}>{dayItem.date}</Text>
                        </View>
                        <Text style={[styles.subLabelText, dynamicStyles.subLabelText, isHighlight && styles.highlightedSubLabelText]}>{dayItem.hasLabel ? dayItem.labelAmount : ' '}</Text>
                      </TouchableOpacity>
                  );
                })}
              </View>
          ))}
        </View>

        <View style={[styles.filterDropdownRow, dynamicStyles.filterDropdownRow]}>
          <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.7}>
            <Text style={[styles.dropdownText, dynamicStyles.dropdownText]}>전체보기</Text>
            <Ionicons name="chevron-down" size={16} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={dynamicStyles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.transactionsCard, dynamicStyles.transactionsCard]}>
            {transactions.map((group, groupIdx) => (
                <View key={groupIdx} style={styles.dateGroup}>
                  <Text style={[styles.dateHeader, dynamicStyles.dateHeader]}>{group.date}</Text>
                  {group.items.map((tx, txIdx) => (
                      <View key={txIdx} style={[styles.transactionRow, txIdx > 0 && { marginTop: 12 }]}>
                        <View style={[styles.avatarCircle, dynamicStyles.avatarCircle]} />
                        <View style={styles.transactionInfo}>
                          <Text style={[styles.merchantName, dynamicStyles.merchantName]}>{tx.name}</Text>
                          <Text style={[styles.timeText, dynamicStyles.timeText]}>{tx.time}</Text>
                        </View>
                        <Text style={[styles.txAmountText, dynamicStyles.txAmountText]}>{tx.amount}</Text>
                      </View>
                  ))}
                </View>
            ))}
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
  logoAccent: { color: "#009D8B" },
  titleBar: { flexDirection: 'row', alignItems: 'center' },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  titleText: { fontWeight: 'bold', color: '#111827', marginLeft: 4 },
  scrollView: { flex: 1 },
  monthNavRow: { flexDirection: 'row' },
  monthText: { color: '#111827', fontWeight: 'bold' },
  flexRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayOfWeekLabel: { color: '#94A3B8', fontWeight: '600', textAlign: 'center' },
  calendarDayCell: { alignItems: 'center' },
  dateCircle: { justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  highlightedDateCircle: { borderWidth: 1.5, borderColor: '#009D8B', backgroundColor: 'transparent' },
  dateText: { fontWeight: '600', textAlign: "center" },
  normalDateText: { color: '#374151' },
  highlightedDateText: { color: '#009D8B', fontWeight: 'bold' },
  subLabelText: { color: '#94A3B8', textAlign: 'center' },
  highlightedSubLabelText: { color: '#009D8B', fontWeight: 'bold' },
  filterDropdownRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8 },
  dropdownText: { color: '#4B5563', fontWeight: '600' },
  transactionsCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginBottom: 20 },
  dateGroup: { marginBottom: 20 },
  dateHeader: { fontWeight: 'bold', color: '#94A3B8' },
  transactionRow: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { backgroundColor: '#CBD5E1' },
  transactionInfo: { flex: 1 },
  merchantName: { fontWeight: 'bold', color: '#334155' },
  timeText: { color: '#94A3B8' },
  txAmountText: { fontWeight: 'bold', color: '#1E293B' },
});