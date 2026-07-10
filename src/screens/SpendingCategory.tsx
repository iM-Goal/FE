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
import Svg, { Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

// Base design dimensions for consistent layout scaling
const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

export default function SpendingCategory({ navigation }: any) {
  const { width, height } = useWindowDimensions();

  // Responsive scaling factors
  const widthScale = width / BASE_SCREEN_WIDTH;
  const heightScale = height / BASE_SCREEN_HEIGHT;
  const sizeScale = width / BASE_SCREEN_WIDTH;

  // State to track which category accordion is expanded (default is index 4: "그 외 n개")
  const [expandedIndex, setExpandedIndex] = useState<number | null>(4);

  // Category breakdown list configuration
  const categoryData = [
    { name: '채소', percentage: 50, color: '#014C43', amount: '00,000원' },
    { name: '과일', percentage: 25, color: '#00B395', amount: '00,000원' },
    { name: '정육 · 가공육 · 달걀', percentage: 12.5, color: '#00E676', amount: '00,000원' },
    { name: '생수 · 음료', percentage: 7.3, color: '#A7F3D0', amount: '00,000원' },
    { name: '그 외 n개', percentage: 5.2, color: '#CBD5E1', amount: '00,000원' }
  ];

  // SVG Donut Chart configuration
  const donutRadius = 38;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedPercent = 0;

  // Mock transactions list (shown inside the expanded category row)
  const transactions = [
    {
      date: '7월 10일 금요일',
      items: [
        { name: '배달의민족', time: '16:48', amount: '- 15,000원' }
      ]
    },
    {
      date: '7월 7일 화요일',
      items: [
        { name: '쿠팡이츠', time: '09:12', amount: '- 11,000원' }
      ]
    },
    {
      date: '7월 6일 월요일',
      items: [
        { name: '요기요', time: '20:10', amount: '- 12,000원' },
        { name: '배달의민족', time: '08:38', amount: '- 9,000원' }
      ]
    }
  ];

  // Toggle accordion expansion state
  const handleToggleCategory = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Collapse if already open
    } else {
      setExpandedIndex(index); // Expand chosen category
    }
  };

  // Calculate dynamic dimensions
  const dynamicStyles = StyleSheet.create({
    contentContainer: {
      paddingBottom: 40 * heightScale,
    },
    header: {
      paddingTop: 16 * heightScale,
      paddingBottom: 12 * heightScale,
      paddingHorizontal: 24 * sizeScale,
    },
    logo: {
      fontSize: 16 * sizeScale,
    },
    titleBar: {
      paddingHorizontal: 24 * sizeScale,
      marginVertical: 12 * heightScale,
    },
    backButton: {
      marginRight: 10 * sizeScale,
    },
    titleText: {
      fontSize: 24 * sizeScale,
    },
    topSummaryRow: {
      paddingHorizontal: 24 * sizeScale,
      paddingBottom: 20 * heightScale,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9',
      marginBottom: 16 * heightScale,
    },
    leftCol: {
      flex: 1.2,
      justifyContent: 'center',
    },
    monthNavRow: {
      alignItems: 'center',
      marginBottom: 10 * heightScale,
    },
    monthText: {
      fontSize: 20 * sizeScale,
      marginHorizontal: 12 * sizeScale,
    },
    amountText: {
      fontSize: 28 * sizeScale,
    },
    rightCol: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    donutChartContainer: {
      width: 140 * sizeScale,
      height: 140 * sizeScale,
    },
    categoryList: {
      paddingHorizontal: 24 * sizeScale,
    },
    categoryRow: {
      paddingVertical: 16 * heightScale,
    },
    colorIndicator: {
      width: 36 * sizeScale,
      height: 36 * sizeScale,
      borderRadius: (36 * sizeScale) / 2,
      marginRight: 16 * sizeScale,
    },
    categoryName: {
      fontSize: 16 * sizeScale,
    },
    categoryPercent: {
      fontSize: 12 * sizeScale,
      marginTop: 2 * heightScale,
    },
    categoryAmount: {
      fontSize: 16 * sizeScale,
      marginRight: 8 * sizeScale,
    },
    expandedTransactionsContainer: {
      paddingLeft: 52 * sizeScale,
      paddingRight: 4 * sizeScale,
      paddingTop: 8 * heightScale,
      paddingBottom: 16 * heightScale,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9',
    },
    dateHeader: {
      fontSize: 12 * sizeScale,
      marginVertical: 10 * heightScale,
    },
    avatarCircle: {
      width: 36 * sizeScale,
      height: 36 * sizeScale,
      borderRadius: (36 * sizeScale) / 2,
      marginRight: 10 * sizeScale,
    },
    merchantName: {
      fontSize: 13 * sizeScale,
    },
    timeText: {
      fontSize: 11 * sizeScale,
      marginTop: 2 * heightScale,
    },
    txAmountText: {
      fontSize: 14 * sizeScale,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Fixed: App Logo Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.logo, dynamicStyles.logo]}>
          <Text style={styles.logoDot}>iM</Text> Agent
          <Text style={styles.logoAccent}>iX</Text>
        </Text>
      </View>

      {/* Fixed: Screen Title Bar with Back Button */}
      <View style={[styles.titleBar, dynamicStyles.titleBar]}>
        <TouchableOpacity 
          style={dynamicStyles.backButton} 
          onPress={() => navigation.navigate('SpendingReport')}
          activeOpacity={0.7}
        >
          <View style={styles.backRow}>
            <Ionicons name="chevron-back" size={28} color="#111827" />
            <Text style={[styles.titleText, dynamicStyles.titleText]}>카테고리별 소비</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Fixed: Split Month Summary and Large Donut Chart Section */}
      <View style={[styles.topSummaryRow, dynamicStyles.topSummaryRow]}>
        <View style={styles.flexRowBetween}>
          {/* Left Column: Month navigation & Total Amount */}
          <View style={dynamicStyles.leftCol}>
            <View style={[styles.monthNavRow, dynamicStyles.monthNavRow]}>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="caret-back" size={16} color="#4B5563" />
              </TouchableOpacity>
              <Text style={[styles.monthText, dynamicStyles.monthText]}>4월</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="caret-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.amountText, dynamicStyles.amountText]}>000,000원</Text>
          </View>

          {/* Right Column: Large SVG Donut Chart */}
          <View style={dynamicStyles.rightCol}>
            <View style={dynamicStyles.donutChartContainer}>
              <Svg width="100%" height="100%" viewBox="0 0 100 100">
                <G transform="rotate(-90 50 50)">
                  {categoryData.map((category, index) => {
                    const strokeLength = (category.percentage / 100) * donutCircumference;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += strokeLength;

                    return (
                      <Circle
                        key={index}
                        cx="50"
                        cy="50"
                        r={donutRadius}
                        fill="transparent"
                        stroke={category.color}
                        strokeWidth="14"
                        strokeDasharray={[strokeLength, donutCircumference]}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  })}
                </G>
              </Svg>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Categories Accordion Breakdown */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={dynamicStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={dynamicStyles.categoryList}>
          {categoryData.map((category, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <View key={index} style={styles.accordionContainer}>
                {/* Category Main Row (Pressable) */}
                <TouchableOpacity
                  style={[
                    styles.categoryRow,
                    dynamicStyles.categoryRow,
                    !isExpanded && styles.borderBottom,
                  ]}
                  onPress={() => handleToggleCategory(index)}
                  activeOpacity={0.7}
                >
                  {/* Left: Circle Color and Label */}
                  <View style={styles.leftRowInfo}>
                    <View 
                      style={[
                        dynamicStyles.colorIndicator, 
                        { backgroundColor: category.color }
                      ]} 
                    />
                    <View>
                      <Text style={[styles.categoryName, dynamicStyles.categoryName]}>
                        {category.name}
                      </Text>
                      <Text style={[styles.categoryPercent, dynamicStyles.categoryPercent]}>
                        {category.percentage}%
                      </Text>
                    </View>
                  </View>

                  {/* Right: Amount & Caret Icon */}
                  <View style={styles.rightRowInfo}>
                    <Text style={[styles.categoryAmount, dynamicStyles.categoryAmount]}>
                      {category.amount}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>

                {/* Expanded Accordion Transaction History (Accordion item details) */}
                {isExpanded && (
                  <View style={dynamicStyles.expandedTransactionsContainer}>
                    {transactions.map((group, groupIdx) => (
                      <View key={groupIdx} style={styles.dateGroup}>
                        <Text style={[styles.dateHeader, dynamicStyles.dateHeader]}>{group.date}</Text>
                        {group.items.map((tx, txIdx) => (
                          <View
                            key={txIdx}
                            style={[
                              styles.transactionRow,
                              txIdx > 0 && { marginTop: 12 },
                            ]}
                          >
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
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logo: {
    color: '#151B1E',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoDot: {
    color: '#009D8B',
  },
  logoAccent: {
    color: '#009D8B',
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  monthNavRow: {
    flexDirection: 'row',
  },
  monthText: {
    color: '#111827',
    fontWeight: 'bold',
  },
  amountText: {
    color: '#111827',
    fontWeight: 'bold',
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionContainer: {
    width: '100%',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  leftRowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    color: '#111827',
    fontWeight: 'bold',
  },
  categoryPercent: {
    color: '#94A3B8',
    fontWeight: '600',
  },
  rightRowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAmount: {
    color: '#111827',
    fontWeight: 'bold',
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    backgroundColor: '#CBD5E1',
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontWeight: 'bold',
    color: '#334155',
  },
  timeText: {
    color: '#94A3B8',
  },
  txAmountText: {
    fontWeight: 'bold',
    color: '#1E293B',
  },
});
