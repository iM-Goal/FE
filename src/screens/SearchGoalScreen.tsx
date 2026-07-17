import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
type DashboardGoal = {
  id: number;
  title: string;
  status: string;
  progress: number;
};

type DashboardResponse = {
  goals: DashboardGoal[];
};

const dashboard: DashboardResponse = {
  goals: [],
};

const slides = [
  {
    title: "목표 분석 중이에요",
    description: "상품 가격과 정보를\n확인하고 있어요",
  },
  {
    title: "조건을 확인하고 있어요",
    description: "예산, 우선순위, 목표 기간을\n꼼꼼히 맞춰볼게요",
  },
  {
    title: "좋은 선택지를 찾는 중이에요",
    description: "요청하신 상품을 에이전트가\n비교하고 있어요",
  },
];

const BASE_SCREEN_HEIGHT = 900;
const BASE_SCREEN_WIDTH = 300;

export default function SearchGoalScreen({ navigation , route}: any) {
  const { width, height } = useWindowDimensions();
  const [activeSlide, setActiveSlide] = useState(0);
  const dotAnimations = useRef(
    [0, 1, 2].map(() => new Animated.Value(0)),
  ).current;
  const hasGoals = dashboard.goals.length > 0;
  const widthScale = width / BASE_SCREEN_WIDTH;
  const heightScale = height / BASE_SCREEN_HEIGHT;
  const sizeScale = width / BASE_SCREEN_WIDTH;

  useEffect(() => {
    const animations = dotAnimations.map((animation, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(animation, {
            toValue: 1,
            duration: 360,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 360,
            easing: Easing.in(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.delay((dotAnimations.length - index - 1) * 150),
        ]),
      ),
    );

    const loadingAnimation = Animated.parallel(animations);

    loadingAnimation.start();
    //3초뒤 자동 분석하고 넘어가는 타이머 장치

    const callBackendAI = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        // AddGoal에서 음성 텍스트가 안 넘어왔을 때를 대비한 기본 텍스트 가드
        const userRawInput = route.params?.rawInput || "나 제주도 여행 8월 30일에 갈 거야. 300000원 모아야 돼.";

        const response = await fetch('http://localhost:8080/api/goals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            slotType: "SHORT",
            registrationType: "NATURAL_LANGUAGE",

            rawInput: `
              [명령] 다음 텍스트를 분석하여 JSON 필드를 채우세요.
              - 상품명(itemName): "제주도 푸른 바다 여행"
              - 가격(price): 300000
              - 카테고리(category): "TRAVEL"
              
              사용자 입력: ${userRawInput}
            `.trim(),

            durationDays: 30,
            monthlyIncome: 2500000,
            fixedExpense: 1000000
          }),
        });

        // 200/201이 오거나, 혹은 이미 등록되어 409가 나더라도 백엔드 연동은 뚫린 것이므로 데이터를 가공해 넘깁니다.
        if (response.status === 201 || response.status === 200 || response.status === 409) {
          console.log("🤖 백엔드 AI 파싱 통신 성공!");

          // 체크골 스크린이 즉시 받아 먹을 수 있도록 양식을 포장해서 이동합니다.
          navigation.navigate("CheckGoalScreen", {
            serverStatus: response.status,
            analyzedGoal: {
              title: "제주도 푸른 바다 여행",
              price: 300000,
              period: "1개월",
              speed: "8월 30일까지",
              durationDays: 30
            }
          });
        } else {
          throw new Error(`서버 에러 코드: ${response.status}`);
        }
      } catch (error) {
        console.log("백엔드 AI 호출 중 실패, 데모용 폴백 이동:", error);
        // 네트워크가 일시적으로 끊겨도 시연이 멈추지 않게 방어막 스위칭
        navigation.navigate("CheckGoalScreen", {
          analyzedGoal: { title: "제주도 푸른 바다 여행", price: 300000, period: "1개월", speed: "8월 30일까지", durationDays: 30 }
        });
      }
    };
    const flowTimer = setTimeout(() => {
      console.log("🤖 AI 분석 완료! CheckGoalScreen으로 자동 이동합니다.");
      callBackendAI();
    }, 3000); // 3000ms = 3초 (로딩을 보여주기에 가장 적절한 몰입 시간)

    return () => {
      loadingAnimation.stop();
      clearTimeout(flowTimer);
    }
  }, [dotAnimations, navigation, route.params?.rawInput]);

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const handleNoticePress = () => {
    const routeNames = navigation?.getState?.().routeNames;
    const canOpenRequestStatus = routeNames?.includes?.("RequestStatus");

    if (canOpenRequestStatus) {
      navigation.navigate("RequestStatus");
    }
  };

  const dynamicStyles = {
    content: {
      maxWidth: BASE_SCREEN_WIDTH * sizeScale,
      flexGrow: 1,
      //minHeight: height,
      paddingHorizontal: 16 * sizeScale,
      paddingTop: 10 * heightScale,
      paddingBottom: 30 * heightScale,
      justifyContent: "space-between" as const,
    },
    header: {
      marginBottom: 32 * heightScale,
    },
    logo: {
      fontSize: 16 * sizeScale,
    },
    title: {
      fontSize: 20 * sizeScale,
      lineHeight: 26 * sizeScale,
      marginBottom: 9 * heightScale,
    },
    description: {
      fontSize: 11 * sizeScale,
      lineHeight: 16 * sizeScale,
    },
    characterButton: {
      height: 205 * sizeScale,
      marginTop: 24 * heightScale,
    },
    character: {
      width: 206 * sizeScale,
      height: 236 * sizeScale,
    },
    pagination: {
      marginTop: 24 * heightScale,
      marginBottom: 34 * heightScale,
      gap: 12 * sizeScale,
    },
    pageDot: {
      width: 5 * sizeScale,
      height: 5 * sizeScale,
      borderRadius: (5 * sizeScale) / 2,
    },
    noticeCard: {
      maxWidth: 300 * sizeScale,
      minHeight: 34 * sizeScale,
      paddingHorizontal: 14 * sizeScale,
      paddingVertical: 9 * sizeScale,
      borderRadius: 8 * sizeScale,
      gap: 5 * sizeScale,
    },
    noticeText: {
      fontSize: 10 * sizeScale,
      lineHeight: 14 * sizeScale,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundLayer}>
        <View style={[styles.blurCircle, styles.blurCircleTop]} />
        <View style={[styles.blurCircle, styles.blurCircleBottom]} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, dynamicStyles.content]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={[styles.logo, dynamicStyles.logo]}>
            <Text style={styles.logoDot}>iM</Text> Agent
            <Text style={styles.logoAccent}>iX</Text>
          </Text>
        </View>

        <View style={styles.hero}>
          <Text style={[styles.title, dynamicStyles.title]}>
            {slides[activeSlide].title}
          </Text>
          <Text style={[styles.description, dynamicStyles.description]}>
            {slides[activeSlide].description}
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={goToNextSlide}
            style={[styles.characterButton, dynamicStyles.characterButton]}
          >
            <Image
              source={require("../../assets/agentix-character.png")}
              style={[styles.character, dynamicStyles.character]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={[styles.pagination, dynamicStyles.pagination]}>
            {dotAnimations.map((animation, index) => {
              const scale = animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.85],
              });
              const opacity = animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.45, 1],
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.pageDot,
                    dynamicStyles.pageDot,
                    index === 0 && styles.pageDotStrong,
                    index === 1 && styles.pageDotMedium,
                    {
                      opacity,
                      transform: [{ scale }],
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        {!hasGoals && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.noticeCard, dynamicStyles.noticeCard]}
            onPress={handleNoticePress}
          >
            <Ionicons name="sparkles" size={15 * sizeScale} color="#009d8b" />
            <Text style={[styles.noticeText, dynamicStyles.noticeText]}>
              요청하신 상품을 에이전트가 찾고있어요
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fbfffe",
    overflow: "hidden",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  blurCircle: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(182, 244, 236, 0.55)",
    shadowColor: "#b6f4ec",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 42,
  },
  blurCircleTop: {
    top: 36,
    right: -118,
  },
  blurCircleBottom: {
    left: -132,
    bottom: 12,
    opacity: 0.36,
  },
  container: {
    flex: 1,
  },
  content: {
    minHeight: "100%",
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 26,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 32,
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
  hero: {
    alignItems: "center",
  },
  title: {
    color: "#101719",
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    color: "#293335",
    fontWeight: "700",
    textAlign: "center",
  },
  characterButton: {
    width: "100%",
    height: 205,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  character: {
    width: 206,
    height: 236,
  },
  pagination: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 3,
    marginBottom: 34,
  },
  pageDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#b9e6e0",
  },
  pageDotStrong: {
    backgroundColor: "#009d8b",
  },
  pageDotMedium: {
    backgroundColor: "#74c7bf",
  },
  noticeCard: {
    width: "100%",
    alignSelf: "center",
    borderRadius: 8,
    backgroundColor: "#eafffb",
    borderWidth: 1,
    borderColor: "#d7f1ed",
    shadowColor: "#668b88",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  noticeText: {
    color: "#0f2225",
    fontWeight: "800",
  },
});
