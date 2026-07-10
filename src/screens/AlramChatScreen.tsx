import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Line,
} from "react-native-svg";

const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

const agentixCharacter = require("../../assets/smile_character.png");

export interface AlramChatProps {
  userName?: string;
  onCheckPaceTrend?: () => void;
  onChallengeMission?: () => void;
  onViewMissionDetails?: () => void;
  onChallengeHomeFood?: () => void;
  onViewGroceryInfo?: () => void;
  fontFamily?: string;
}

export default function AlramChat({
  userName = "00",
  onCheckPaceTrend = () => console.log("Check pace trend clicked"),
  onChallengeMission = () => console.log("Challenge mission clicked"),
  onViewMissionDetails = () => console.log("View mission details clicked"),
  onChallengeHomeFood = () => console.log("Challenge home food clicked"),
  onViewGroceryInfo = () => console.log("View grocery info clicked"),
  fontFamily,
}: AlramChatProps) {
  const { width, height } = useWindowDimensions();

  const widthScale = width / BASE_SCREEN_WIDTH;
  const heightScale = height / BASE_SCREEN_HEIGHT;
  const sizeScale = width / BASE_SCREEN_WIDTH;

  const textFont = fontFamily ? { fontFamily } : {};

  const dynamicStyles = {
    header: {
      paddingHorizontal: 28 * sizeScale,
      paddingTop: 24 * heightScale,
      paddingBottom: 12 * heightScale,
    },
    logo: {
      fontSize: 26 * sizeScale,
    },
    avatarContainer: {
      width: 58 * sizeScale,
      height: 58 * sizeScale,
      borderRadius: (58 * sizeScale) / 2,
    },
    avatarImage: {
      width: 54 * sizeScale,
      height: 54 * sizeScale,
    },
    card: {
      borderRadius: 28 * sizeScale,
      paddingHorizontal: 22 * sizeScale,
      paddingTop: 24 * sizeScale,
      paddingBottom: 22 * sizeScale,
      marginLeft: 12 * sizeScale,
    },
    button: {
      borderRadius: 24 * sizeScale,
      height: 48 * heightScale,
    },
    buttonText: {
      fontSize: 15 * sizeScale,
    },
    smallButton: {
      borderRadius: 18 * sizeScale,
      paddingHorizontal: 16 * sizeScale,
      paddingVertical: 8 * heightScale,
    },
    smallButtonText: {
      fontSize: 13 * sizeScale,
    },
    progressBar: {
      height: 24 * heightScale,
      borderRadius: 12 * sizeScale,
    },
    innerCard: {
      borderRadius: 20 * sizeScale,
      padding: 18 * sizeScale,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <LinearGradient
        colors={["#FFFFFF", "#F0FAF8", "#E6F4F0"]}
        locations={[0.0, 0.4, 1.0]}
        style={styles.gradientContainer}
      >
        {/* 고정 상단 배너 */}
        <View style={[styles.header, dynamicStyles.header]}>
          <Text
            style={[
              styles.logo,
              dynamicStyles.logo,
              textFont,
              styles.logoWeight,
            ]}
          >
            <Text style={styles.logoDot}>iM</Text> Agent
            <Text style={styles.logoAccent}>iX</Text>
          </Text>
        </View>

        {/* 스크롤 영역 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 카드 1: 이번 주 페이스 */}
          <View style={styles.chatRow}>
            <View
              style={[styles.avatarContainer, dynamicStyles.avatarContainer]}
            >
              <Image
                source={agentixCharacter}
                style={dynamicStyles.avatarImage}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.card, dynamicStyles.card, styles.flexFill]}>
              <Text style={[styles.cardTitle, textFont]}>이번 주 페이스</Text>
              <Text style={[styles.cardSubtitle, textFont]}>
                정말 잘하고 있어요!
              </Text>

              <View
                style={[
                  styles.innerCard,
                  dynamicStyles.innerCard,
                  styles.whiteCard,
                ]}
              >
                <Text style={[styles.chartTitle, textFont]}>페이스 추이</Text>

                <View style={styles.chartContainer}>
                  <Svg
                    width="100%"
                    height={90 * heightScale}
                    viewBox="0 0 220 90"
                  >
                    <Defs>
                      <SvgGradient
                        id="chartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <Stop
                          offset="0%"
                          stopColor="#3B82F6"
                          stopOpacity="0.3"
                        />
                        <Stop
                          offset="100%"
                          stopColor="#3B82F6"
                          stopOpacity="0.0"
                        />
                      </SvgGradient>
                    </Defs>
                    <Line
                      x1="160"
                      y1="10"
                      x2="160"
                      y2="80"
                      stroke="#E2E8F0"
                      strokeDasharray="3,3"
                    />
                    <Path
                      d="M 15 80 C 45 75, 75 70, 105 55 C 130 45, 160 30, 205 15 L 205 80 Z"
                      fill="url(#chartGradient)"
                    />
                    <Path
                      d="M 15 80 C 45 75, 75 70, 105 55 C 130 45, 160 30, 205 15"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                    />
                    <Circle cx="15" cy="80" r="3" fill="#3B82F6" />
                    <Circle cx="105" cy="55" r="3" fill="#3B82F6" />
                    <Circle cx="160" cy="30" r="5" fill="#3B82F6" />
                    <Circle
                      cx="160"
                      cy="30"
                      r="9"
                      fill="#3B82F6"
                      fillOpacity="0.15"
                    />
                    <Circle cx="205" cy="15" r="3" fill="#3B82F6" />
                  </Svg>

                  <View style={styles.chartLabelsRow}>
                    <Text style={[styles.chartLabel, textFont]}>6/20</Text>
                    <Text style={[styles.chartCurrentLabel, textFont]}>
                      현재 68%
                    </Text>
                    <Text style={[styles.chartLabel, textFont]}>7/20</Text>
                  </View>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  dynamicStyles.button,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onCheckPaceTrend}
              >
                <Text
                  style={[
                    styles.buttonText,
                    dynamicStyles.buttonText,
                    textFont,
                  ]}
                >
                  페이스 추이 확인하기
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 카드 2: 과소비 패턴 감지 */}
          <View style={styles.chatRow}>
            <View
              style={[styles.avatarContainer, dynamicStyles.avatarContainer]}
            >
              <Image
                source={agentixCharacter}
                style={dynamicStyles.avatarImage}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.card, dynamicStyles.card, styles.flexFill]}>
              <Text style={[styles.cardTitle, textFont]}>
                🔔 과소비 패턴 감지
              </Text>
              <Text style={[styles.cardSubtitle, textFont]}>
                이번 주 배달을 평소보다 많이 시켰어요
              </Text>

              <Text style={[styles.overspendingText, textFont]}>
                ₩23,000 <Text style={styles.overspendingLabel}>초과</Text>
              </Text>

              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, dynamicStyles.progressBar]}>
                  <View style={[styles.progressLeft, { flex: 0.72 }]} />
                  <View style={[styles.progressRight, { flex: 0.28 }]} />
                </View>

                <View style={styles.indicatorWrapperRow}>
                  <View style={styles.leftIndicatorBlock}>
                    <Text style={styles.indicatorArrow}>▲</Text>
                    <Text style={[styles.indicatorName, textFont]}>
                      4주 평균
                    </Text>
                    <Text style={[styles.indicatorVal, textFont]}>₩24,000</Text>
                  </View>
                  <View style={styles.rightIndicatorBlock}>
                    <Text style={[styles.indicatorArrow, styles.mintArrow]}>
                      ▲
                    </Text>
                    <Text style={[styles.indicatorName, textFont]}>
                      이번 주 배달
                    </Text>
                    <Text style={[styles.indicatorVal, textFont]}>₩47,000</Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.innerCard,
                  dynamicStyles.innerCard,
                  styles.whiteCard,
                  styles.alignCenter,
                ]}
              >
                <Text style={[styles.missionHeader, textFont]}>
                  AI 미션 추천
                </Text>
                <Text style={[styles.missionTitle, textFont]}>
                  3일 참아서 밸런스 맞추기
                </Text>
                <Text style={[styles.missionDesc, textFont]}>
                  수락 시 초과 금액만큼{"\n"}보증금으로 잠겨요!
                </Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    dynamicStyles.button,
                    styles.fullWidth,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={onChallengeMission}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      dynamicStyles.buttonText,
                      textFont,
                    ]}
                  >
                    도전하기
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.grayButton,
                    dynamicStyles.button,
                    styles.fullWidth,
                    pressed && styles.grayButtonPressed,
                  ]}
                  onViewMissionDetails
                  onPress={onViewMissionDetails}
                >
                  <Text
                    style={[
                      styles.grayButtonText,
                      dynamicStyles.buttonText,
                      textFont,
                    ]}
                  >
                    상세보기
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* 카드 3: 맞춤형 추천 */}
          <View style={styles.chatRow}>
            <View
              style={[styles.avatarContainer, dynamicStyles.avatarContainer]}
            >
              <Image
                source={agentixCharacter}
                style={dynamicStyles.avatarImage}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.card, dynamicStyles.card, styles.flexFill]}>
              <Text style={[styles.cardTitle, textFont]}>
                {userName}님 맞춤형 추천
              </Text>
              <Text style={[styles.cardSubtitle, textFont]}>
                회원님의 최근 데이터를 기반으로{"\n"}AI가 분석한 추천입니다.
              </Text>

              <View
                style={[
                  styles.innerCard,
                  dynamicStyles.innerCard,
                  styles.whiteCard,
                  styles.rowBetween,
                ]}
              >
                <View style={styles.flexFill}>
                  <Text style={[styles.recommendTitle, textFont]}>
                    🍚 집밥 챌린지
                  </Text>
                  <Text style={[styles.recommendSubtitle, textFont]}>
                    이번 주 배달 대신{"\n"}집밥 도전해보세요!
                  </Text>
                </View>
                <View style={styles.alignEnd}>
                  <Text style={[styles.successRateTag, textFont]}>
                    목표 성공률 +0.3%
                  </Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.smallButton,
                      dynamicStyles.smallButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={onChallengeHomeFood}
                  >
                    <Text
                      style={[
                        styles.smallButtonText,
                        dynamicStyles.smallButtonText,
                        textFont,
                      ]}
                    >
                      도전하기
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View
                style={[
                  styles.innerCard,
                  dynamicStyles.innerCard,
                  styles.whiteCard,
                  styles.rowBetween,
                ]}
              >
                <View style={styles.flexFill}>
                  <Text style={[styles.recommendTitle, textFont]}>
                    🛒 식재료 잘 사기
                  </Text>
                  <Text style={[styles.recommendSubtitle, textFont]}>
                    근처 마트 할인{"\n"}정보를 확인하세요!
                  </Text>
                </View>
                <View style={styles.alignEnd}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.smallButton,
                      dynamicStyles.smallButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={onViewGroceryInfo}
                  >
                    <Text
                      style={[
                        styles.smallButtonText,
                        dynamicStyles.smallButtonText,
                        textFont,
                      ]}
                    >
                      정보보기
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  logoWeight: {
    fontWeight: "900",
  },
  logo: {
    color: "#1A2F2C",
    letterSpacing: -0.8,
  },
  logoDot: {
    color: "#00B395",
  },
  logoAccent: {
    color: "#00B395",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 50,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
    width: "100%",
  },
  avatarContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  flexFill: {
    flex: 1,
  },
  card: {
    backgroundColor: "#E9F1EE",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B433E",
    marginBottom: 6,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#556662",
    lineHeight: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  innerCard: {
    // 🌟 ts(2339) 컴파일 오류 방지를 위한 누락 스타일 추가 완료
    width: "100%",
  },
  whiteCard: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#556662",
    marginBottom: 10,
  },
  chartContainer: {
    width: "100%",
  },
  chartLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 6,
  },
  chartLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  chartCurrentLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  button: {
    width: "100%",
    backgroundColor: "#00B395",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00B395",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonPressed: {
    backgroundColor: "#009D83",
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  overspendingText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1E293B",
    textAlign: "center",
    marginVertical: 4,
  },
  overspendingLabel: {
    fontSize: 15,
    fontWeight: "normal",
    color: "#6B7280",
  },
  progressContainer: {
    width: "100%",
    marginVertical: 16,
  },
  progressBar: {
    flexDirection: "row",
    width: "100%",
    overflow: "hidden",
  },
  progressLeft: {
    backgroundColor: "#00B395",
  },
  progressRight: {
    backgroundColor: "#FFB84D",
  },
  indicatorWrapperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
    marginTop: 6,
  },
  leftIndicatorBlock: {
    alignItems: "center",
    width: "55%",
  },
  rightIndicatorBlock: {
    alignItems: "center",
    width: "45%",
  },
  indicatorArrow: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 12,
  },
  mintArrow: {
    color: "#00B395",
  },
  indicatorName: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    textAlign: "center",
  },
  indicatorVal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 2,
    textAlign: "center",
  },
  alignCenter: {
    alignItems: "center",
  },
  missionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9CA3AF",
    marginBottom: 6,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  missionDesc: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
  },
  fullWidth: {
    width: "100%",
  },
  grayButton: {
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  grayButtonPressed: {
    backgroundColor: "#D1D5DB",
    transform: [{ scale: 0.98 }],
  },
  grayButtonText: {
    color: "#4B5563",
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  recommendSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  successRateTag: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 6,
    textAlign: "right",
  },
  smallButton: {
    backgroundColor: "#00B395",
    justifyContent: "center",
    alignItems: "center",
  },
  smallButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
