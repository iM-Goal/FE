import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  Pressable,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  StatusBar,
  useWindowDimensions,
} from "react-native";

// Base design dimensions from your template code
const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

// Requiring local assets copy generated in the assets/ directory
const angryMascot = require("../../assets/angry_character.png");
const happyMascot = require("../../assets/smile_character.png");

export default function SpendAlert() {
  const { width, height } = useWindowDimensions();

  // Set default slider value to 15 (within 1~31 range)
  const [duration, setDuration] = useState(15);
  const [sliderWidth, setSliderWidth] = useState(0);

  // State to track if the slider is currently being dragged
  const [isDragging, setIsDragging] = useState(false);

  // Updated range (1 to 31)
  const minDays = 1;
  const maxDays = 31;
  const range = maxDays - minDays;

  // Responsive scaling calculations matching your design layout
  const widthScale = width / BASE_SCREEN_WIDTH;
  const heightScale = height / BASE_SCREEN_HEIGHT;
  const sizeScale = width / BASE_SCREEN_WIDTH;

  // Refs for tracking values during dragging gestures
  const startDuration = useRef(15);
  const sliderWidthRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        startDuration.current = duration;
      },
      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        if (sliderWidthRef.current > 0) {
          const deltaX = gestureState.dx;
          const deltaValue = (deltaX / sliderWidthRef.current) * range;
          const newValue = Math.max(
            minDays,
            Math.min(maxDays, Math.round(startDuration.current + deltaValue)),
          );
          setDuration(newValue);
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      },
    }),
  ).current;

  const onSliderLayout = (event: any) => {
    const { width: measuredWidth } = event.nativeEvent.layout;
    setSliderWidth(measuredWidth);
    sliderWidthRef.current = measuredWidth;
  };

  // Calculate position percentage and horizontal offsets
  const ratio = (duration - minDays) / range;
  const activeTrackWidth = sliderWidth * ratio;

  // Dynamic styling object computed based on current window dimensions
  const dynamicStyles = {
    content: {
      flexGrow: 1,
      paddingBottom: 40 * heightScale,
    },
    header: {
      marginBottom: 32 * heightScale,
      paddingHorizontal: 16 * sizeScale,
      paddingTop: 16 * heightScale,
    },
    logo: {
      fontSize: 16 * sizeScale,
    },
    banner: {
      paddingTop: 20 * heightScale,
      paddingBottom: 0, // 수정됨: 하단 패딩을 없애서 이미지가 바닥에 닿게 함
      paddingHorizontal: 24 * sizeScale,
    },
    bannerTextContainer: {
      paddingBottom: 20 * heightScale, // 수정됨: 텍스트는 기존 간격 유지
    },
    angryMascotImage: {
      width: 100 * sizeScale,
      height: 115 * sizeScale,
      marginRight: 16 * sizeScale,
    },
    bannerTitle: {
      fontSize: 20 * sizeScale,
      marginBottom: 4 * heightScale,
    },
    bannerSubtitle: {
      fontSize: 13 * sizeScale,
      marginBottom: 8 * heightScale,
    },
    bannerAmount: {
      fontSize: 30 * sizeScale,
    },
    bannerAmountLabel: {
      fontSize: 14 * sizeScale,
    },
    historyCard: {
      borderRadius: 24 * sizeScale,
      padding: 20 * sizeScale,
      marginHorizontal: 20 * sizeScale,
      marginTop: 20 * heightScale,
    },
    historyTitle: {
      fontSize: 18 * sizeScale,
      marginBottom: 16 * heightScale,
    },
    dateHeader: {
      fontSize: 11 * sizeScale,
      marginBottom: 10 * heightScale,
    },
    avatarCircle: {
      width: 44 * sizeScale,
      height: 44 * sizeScale,
      borderRadius: (44 * sizeScale) / 2,
      marginRight: 12 * sizeScale,
    },
    merchantName: {
      fontSize: 14 * sizeScale,
    },
    transactionTime: {
      fontSize: 11 * sizeScale,
      marginTop: 2 * heightScale,
    },
    amountText: {
      fontSize: 15 * sizeScale,
    },
    aiRecommendationContainer: {
      marginHorizontal: 20 * sizeScale,
      marginTop: 24 * heightScale,
    },
    happyMascotImage: {
      width: 60 * sizeScale,
      height: 60 * sizeScale,
      borderRadius: (60 * sizeScale) / 2,
      borderWidth: 1 * sizeScale,
    },
    speechBubble: {
      flex: 2,
      alignItems: "center", // 내부 텍스트(요소)들을 가로 중앙으로 정렬
      justifyContent: "center", // 추가됨: 내부 요소를 세로 중앙으로 정렬
      marginLeft: 12 * sizeScale,
      borderRadius: 20 * sizeScale,
      padding: 16 * sizeScale,
    },
    bubbleSubTitle: {
      fontSize: 11 * sizeScale,
      marginBottom: 2 * heightScale,
    },
    bubbleTitle: {
      fontSize: 16 * sizeScale,
    },
    bubbleDescription: {
      fontSize: 11 * sizeScale,
      marginTop: 4 * heightScale,
    },
    adjusterContainer: {
      marginHorizontal: 20 * sizeScale,
      marginTop: 28 * heightScale,
    },
    adjusterTitle: {
      fontSize: 18 * sizeScale,
      marginBottom: 20 * heightScale,
    },
    sliderInfoRow: {
      marginBottom: 12 * heightScale,
    },
    sliderLabel: {
      fontSize: 11 * sizeScale,
      letterSpacing: 0.8 * sizeScale,
    },
    sliderValue: {
      fontSize: 20 * sizeScale,
    },
    sliderContainer: {
      height: 30 * sizeScale,
    },
    sliderTrackBackground: {
      height: 6 * sizeScale,
      borderRadius: (6 * sizeScale) / 2,
    },
    sliderTrackActive: {
      height: 6 * sizeScale,
      borderRadius: (6 * sizeScale) / 2,
    },
    sliderThumb: {
      width: 28 * sizeScale,
      height: 28 * sizeScale,
      borderRadius: (28 * sizeScale) / 2,
      shadowRadius: 4 * sizeScale,
    },
    sliderThumbInner: {
      width: 12 * sizeScale,
      height: 12 * sizeScale,
      borderRadius: (12 * sizeScale) / 2,
    },
    sliderTicksRow: {
      marginTop: 8 * heightScale,
    },
    tickLabel: {
      fontSize: 11 * sizeScale,
    },
    buttonContainer: {
      marginTop: 36 * heightScale,
      marginHorizontal: 20 * sizeScale,
    },
    confirmButton: {
      height: 52 * sizeScale,
      borderRadius: (52 * sizeScale) / 2,
    },
    confirmButtonText: {
      fontSize: 16 * sizeScale,
    },
    cancelButton: {
      height: 52 * sizeScale,
      borderRadius: (52 * sizeScale) / 2,
      marginTop: 12 * heightScale,
    },
    cancelButtonText: {
      fontSize: 16 * sizeScale,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* iM Agentix Header (Fixed at the top, left aligned, styled matching template code) */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.logo, dynamicStyles.logo]}>
          <Text style={styles.logoDot}>iM</Text> Agent
          <Text style={styles.logoAccent}>iX</Text>
        </Text>
      </View>

      {/* 과소비 패턴 감지 Fixed Banner */}
      <View style={[styles.banner, dynamicStyles.banner]}>
        <View style={styles.bannerContent}>
          {/* Mascot Image (Angry bird) */}
          <Image
            source={angryMascot}
            style={[styles.angryMascotImage, dynamicStyles.angryMascotImage]}
          />

          {/* Text Description */}
          <View
            style={[
              styles.bannerTextContainer,
              dynamicStyles.bannerTextContainer,
            ]}
          >
            <Text style={[styles.bannerTitle, dynamicStyles.bannerTitle]}>
              과소비 패턴 감지
            </Text>
            <Text style={[styles.bannerSubtitle, dynamicStyles.bannerSubtitle]}>
              이번 주 배달을 평소보다 많이 시켰어요.
            </Text>
            <Text style={[styles.bannerAmount, dynamicStyles.bannerAmount]}>
              ₩23,000{" "}
              <Text
                style={[
                  styles.bannerAmountLabel,
                  dynamicStyles.bannerAmountLabel,
                ]}
              >
                초과
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content Area below the fixed banner */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, dynamicStyles.content]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDragging} // Disable scrolling during drag gestures to prevent responder conflicts
      >
        {/* 나의 배달 지출 내역 Card */}
        <View style={[styles.historyCard, dynamicStyles.historyCard]}>
          <Text style={[styles.historyTitle, dynamicStyles.historyTitle]}>
            나의 배달 지출 내역
          </Text>

          {/* Group 1: 7월 10일 금요일 */}
          <View style={styles.dateGroup}>
            <Text style={[styles.dateHeader, dynamicStyles.dateHeader]}>
              7월 10일 금요일
            </Text>
            <View style={styles.transactionRow}>
              <View style={[styles.avatarCircle, dynamicStyles.avatarCircle]} />
              <View style={styles.transactionInfo}>
                <Text style={[styles.merchantName, dynamicStyles.merchantName]}>
                  배달의민족
                </Text>
                <Text
                  style={[
                    styles.transactionTime,
                    dynamicStyles.transactionTime,
                  ]}
                >
                  16:48
                </Text>
              </View>
              <Text style={[styles.amountText, dynamicStyles.amountText]}>
                - 15,000원
              </Text>
            </View>
          </View>

          {/* Group 2: 7월 7일 화요일 */}
          <View style={styles.dateGroup}>
            <Text style={[styles.dateHeader, dynamicStyles.dateHeader]}>
              7월 7일 화요일
            </Text>
            <View style={styles.transactionRow}>
              <View style={[styles.avatarCircle, dynamicStyles.avatarCircle]} />
              <View style={styles.transactionInfo}>
                <Text style={[styles.merchantName, dynamicStyles.merchantName]}>
                  쿠팡이츠
                </Text>
                <Text
                  style={[
                    styles.transactionTime,
                    dynamicStyles.transactionTime,
                  ]}
                >
                  09:12
                </Text>
              </View>
              <Text style={[styles.amountText, dynamicStyles.amountText]}>
                - 11,000원
              </Text>
            </View>
          </View>

          {/* Group 3: 7월 6일 월요일 */}
          <View style={styles.dateGroup}>
            <Text style={[styles.dateHeader, dynamicStyles.dateHeader]}>
              7월 6일 월요일
            </Text>

            <View style={styles.transactionRow}>
              <View style={[styles.avatarCircle, dynamicStyles.avatarCircle]} />
              <View style={styles.transactionInfo}>
                <Text style={[styles.merchantName, dynamicStyles.merchantName]}>
                  요기요
                </Text>
                <Text
                  style={[
                    styles.transactionTime,
                    dynamicStyles.transactionTime,
                  ]}
                >
                  20:10
                </Text>
              </View>
              <Text style={[styles.amountText, dynamicStyles.amountText]}>
                - 12,000원
              </Text>
            </View>

            <View style={[styles.transactionRow, { marginTop: 12 }]}>
              <View style={[styles.avatarCircle, dynamicStyles.avatarCircle]} />
              <View style={styles.transactionInfo}>
                <Text style={[styles.merchantName, dynamicStyles.merchantName]}>
                  배달의민족
                </Text>
                <Text
                  style={[
                    styles.transactionTime,
                    dynamicStyles.transactionTime,
                  ]}
                >
                  08:38
                </Text>
              </View>
              <Text style={[styles.amountText, dynamicStyles.amountText]}>
                - 9,000원
              </Text>
            </View>
          </View>
        </View>

        {/* AI 미션 추천 Section (Centered Alignments + Mockup drop shadow) */}
        <View
          style={[
            styles.aiRecommendationContainer,
            dynamicStyles.aiRecommendationContainer,
          ]}
        >
          <Image
            source={happyMascot}
            style={[styles.happyMascotImage, dynamicStyles.happyMascotImage]}
          />
          <View style={[styles.speechBubble, dynamicStyles.speechBubble]}>
            <Text
              style={[
                styles.bubbleSubTitle,
                dynamicStyles.bubbleSubTitle,
                styles.centeredText,
              ]}
            >
              AI 미션 추천
            </Text>
            <Text
              style={[
                styles.bubbleTitle,
                dynamicStyles.bubbleTitle,
                styles.centeredText,
              ]}
            >
              <Text style={styles.highlightText}>3일</Text> 참아서 밸런스 맞추기
            </Text>
            <Text
              style={[
                styles.bubbleDescription,
                dynamicStyles.bubbleDescription,
                styles.centeredText,
              ]}
            >
              수락 시 초과 금액만큼 보증금으로 잠겨요!
            </Text>
          </View>
        </View>

        {/* 미션 재조정 Title & Slider */}
        <View
          style={[styles.adjusterContainer, dynamicStyles.adjusterContainer]}
        >
          <Text style={[styles.adjusterTitle, dynamicStyles.adjusterTitle]}>
            미션 재조정
          </Text>

          <View style={[styles.sliderInfoRow, dynamicStyles.sliderInfoRow]}>
            <Text style={[styles.sliderLabel, dynamicStyles.sliderLabel]}>
              DURATION (DAYS)
            </Text>
            <Text style={[styles.sliderValue, dynamicStyles.sliderValue]}>
              {duration} {duration === 1 ? "Day" : "Days"}
            </Text>
          </View>

          {/* Interactive Custom Slider Container */}
          <View
            style={[styles.sliderContainer, dynamicStyles.sliderContainer]}
            onLayout={onSliderLayout}
            {...panResponder.panHandlers}
          >
            {/* Slider Inactive Track */}
            <View
              style={[
                styles.sliderTrackBackground,
                dynamicStyles.sliderTrackBackground,
              ]}
            />

            {/* Slider Active Track */}
            <View
              style={[
                styles.sliderTrackActive,
                dynamicStyles.sliderTrackActive,
                { width: activeTrackWidth },
              ]}
            />

            {/* Drag Handle (Thumb) */}
            <View
              style={[
                styles.sliderThumb,
                dynamicStyles.sliderThumb,
                { left: Math.max(0, activeTrackWidth - 14 * sizeScale) },
              ]}
            >
              <View
                style={[
                  styles.sliderThumbInner,
                  dynamicStyles.sliderThumbInner,
                ]}
              />
            </View>
          </View>

          {/* Tick Labels (Adjusted for 1 ~ 31 range) */}
          <View style={[styles.sliderTicksRow, dynamicStyles.sliderTicksRow]}>
            <Text style={[styles.tickLabel, dynamicStyles.tickLabel]}>
              1 Day
            </Text>
            <Text style={[styles.tickLabel, dynamicStyles.tickLabel]}>
              31 Days
            </Text>
          </View>
        </View>

        {/* Bottom Buttons with CSS transition for 60fps web hover effects */}
        <View style={[styles.buttonContainer, dynamicStyles.buttonContainer]}>
          <Pressable
            style={({ hovered }) => [
              styles.confirmButton,
              dynamicStyles.confirmButton,
              hovered && styles.confirmButtonHovered,
            ]}
          >
            <Text
              style={[
                styles.confirmButtonText,
                dynamicStyles.confirmButtonText,
              ]}
            >
              도전하기
            </Text>
          </Pressable>

          <Pressable
            style={({ hovered }) => [
              styles.cancelButton,
              dynamicStyles.cancelButton,
              hovered && styles.cancelButtonHovered,
            ]}
          >
            <Text
              style={[styles.cancelButtonText, dynamicStyles.cancelButtonText]}
            >
              안하기
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  logo: {
    color: "#151b1e",
    fontWeight: "800",
    letterSpacing: 0,
  },
  logoDot: {
    color: "#009d8b",
  },
  logoAccent: {
    color: "#009d8b",
  },
  banner: {
    backgroundColor: "#00B395",
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "flex-end", // 수정됨: 요소를 아래로 정렬하여 이미지가 바닥에 닿게 함
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  bannerAmount: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "right",
  },
  bannerAmountLabel: {
    fontWeight: "normal",
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    width: "100%",
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  historyTitle: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontWeight: "bold",
    color: "#94A3B8",
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    backgroundColor: "#CBD5E1",
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontWeight: "bold",
    color: "#334155",
  },
  transactionTime: {
    color: "#94A3B8",
  },
  amountText: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  aiRecommendationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  happyMascotImage: {
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  speechBubble: {
    backgroundColor: "#EDF5F3",
    alignItems: "center",
    shadowColor: "#668b88",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#D8ECE8",
  },
  centeredText: {
    textAlign: "center",
  },
  bubbleSubTitle: {
    color: "#64748B",
    fontWeight: "bold",
  },
  bubbleTitle: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  highlightText: {
    color: "#00B395",
    fontWeight: "bold",
  },
  bubbleDescription: {
    color: "#64748B",
  },
  adjusterContainer: {},
  adjusterTitle: {
    fontWeight: "bold",
    color: "#1E293B",
  },
  sliderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  sliderLabel: {
    fontWeight: "bold",
    color: "#94A3B8",
  },
  sliderValue: {
    fontWeight: "bold",
    color: "#00B395",
  },
  sliderContainer: {
    justifyContent: "center",
    position: "relative",
  },
  sliderTrackBackground: {
    backgroundColor: "#E2E8F0",
  },
  sliderTrackActive: {
    backgroundColor: "#D1FAE5",
    position: "absolute",
    left: 0,
  },
  sliderThumb: {
    backgroundColor: "#00B395",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    shadowColor: "#00B395",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
  },
  sliderThumbInner: {
    backgroundColor: "#004D40",
  },
  sliderTicksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tickLabel: {
    color: "#94A3B8",
  },
  buttonContainer: {},
  confirmButton: {
    backgroundColor: "#00B395",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00B395",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    // Web CSS transitions for smooth hover animations
    // @ts-ignore
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
    transitionTimingFunction: "ease",
  },
  confirmButtonHovered: {
    backgroundColor: "#00856F",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#4A5D5A",
    justifyContent: "center",
    alignItems: "center",
    // Web CSS transitions for cancel button
    // @ts-ignore
    transitionProperty: "background-color, border-color",
    transitionDuration: "0.2s",
    transitionTimingFunction: "ease",
  },
  cancelButtonHovered: {
    backgroundColor: "#F1F5F9",
    borderColor: "#2C3A38",
  },
  cancelButtonText: {
    color: "#1E293B",
    fontWeight: "bold",
  },
});
