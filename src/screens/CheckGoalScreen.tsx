import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

type AnalyzedGoal = {
  title: string;
  price: number;
  period: string;
  speed: string;
  durationDays: number;
};

const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

export default function CheckGoalScreen({ navigation, route }: any) {
  const { width, height } = useWindowDimensions();

  // 데스크탑 화면에서 좌우로 무한정 늘어나는 왜곡을 방지하기 위해 가로폭 최대값(450px) 제한 적용
  const frameWidth = Math.min(width, 450);
  const sizeScale = frameWidth / BASE_SCREEN_WIDTH;
  const heightScale = Math.min(height, 850) / BASE_SCREEN_HEIGHT;

  const [isEditHovered, setIsEditHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const dynamicGoal = route.params?.analyzedGoal || {
    title: "제주도 푸른 바다 여행",
    price: 300000,
    period: "1개월",
    speed: "8월 30일까지",
    durationDays: 30,
  };

  const handleBackPress = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleRegisterPress = async () => {
    setLoading(true);

    await AsyncStorage.setItem('demo_goal_created', 'true');
    Alert.alert('성공', '목표 등록이 성공적으로 완료되었습니다!', [
      {
        text: '확인',
        onPress: () => {
          setLoading(false);
          navigation.navigate("MainTabs", {
            screen: "홈",
          });
        }
      }
    ]);
  };

  // 추천 저축 슬롯 계산 함수 (기간에 따라 동적 분류)
  const getSavingSlot = (days: number, period: string) => {
    if (days) {
      if (days <= 90) return "단기 (1~3개월)";
      if (days <= 365) return "중기 (3~12개월)";
      return "장기 (1년 이상)";
    }
    if (period.includes("년")) return "장기 (1년 이상)";
    const monthsMatch = period.match(/(\d+)\s*개월/);
    if (monthsMatch) {
      const months = parseInt(monthsMatch[1], 10);
      if (months <= 3) return "단기 (1~3개월)";
      if (months <= 12) return "중기 (3~12개월)";
      return "장기 (1년 이상)";
    }
    return "단기 (1~3개월)";
  };

  const dynamicStyles = {
    content: {
      maxWidth: frameWidth,
      minHeight: height,
      paddingHorizontal: 24 * sizeScale,
      paddingTop: 16 * heightScale,
      paddingBottom: 32 * heightScale,
    },
    header: {
      height: 32 * heightScale,
      marginBottom: 16 * heightScale,
    },
    backButton: {
      width: 32 * sizeScale,
      height: 32 * sizeScale,
      marginLeft: -8 * sizeScale,
    },
    titleBlock: {
      marginBottom: 28 * heightScale,
    },
    title: {
      fontSize: 26 * sizeScale,
      lineHeight: 34 * sizeScale,
    },
    subtitle: {
      fontSize: 14 * sizeScale,
      lineHeight: 20 * sizeScale,
      marginTop: 6 * heightScale,
    },
    imageContainer: {
      width: "100%",
      height: 220 * sizeScale,
      borderRadius: 36 * sizeScale,
      marginBottom: 24 * heightScale,
    },
    imageRadius: {
      borderRadius: 36 * sizeScale,
    },
    goalSummary: {
      marginBottom: 6 * heightScale,
    },
    goalLabel: {
      fontSize: 20 * sizeScale,
      lineHeight: 28 * sizeScale,
    },
    price: {
      fontSize: 28 * sizeScale,
      lineHeight: 36 * sizeScale,
      marginBottom: 28 * heightScale,
    },
    editButton: {
      width: 32 * sizeScale,
      height: 32 * sizeScale,
      borderRadius: 16 * sizeScale,
    },
    infoRow: {
      gap: 12 * sizeScale,
      marginBottom: 32 * heightScale,
    },
    infoBox: {
      height: 64 * heightScale,
      borderRadius: 16 * sizeScale,
      paddingHorizontal: 12 * sizeScale,
    },
    infoLabel: {
      fontSize: 11 * sizeScale,
      lineHeight: 16 * sizeScale,
    },
    infoValue: {
      fontSize: 15 * sizeScale,
      lineHeight: 20 * sizeScale,
      marginTop: 4 * heightScale,
    },
    buttonGroup: {
      gap: 12 * heightScale,
    },
    primaryButton: {
      height: 52 * heightScale,
      borderRadius: 26 * sizeScale,
    },
    primaryButtonText: {
      fontSize: 15 * sizeScale,
      lineHeight: 22 * sizeScale,
    },
    secondaryButton: {
      height: 52 * heightScale,
      borderRadius: 26 * sizeScale,
    },
    secondaryButtonText: {
      fontSize: 15 * sizeScale,
      lineHeight: 22 * sizeScale,
    },
  } as any;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, dynamicStyles.content]}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 뒤로가기 헤더 */}
        <View style={[styles.header, dynamicStyles.header]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBackPress}
            style={[styles.backButton, dynamicStyles.backButton]}
          >
            <Ionicons name="chevron-back" size={24 * sizeScale} color="#12191b" />
          </TouchableOpacity>
        </View>

        {/* 타이틀 블록 */}
        <View style={[styles.titleBlock, dynamicStyles.titleBlock]}>
          <Text style={[styles.title, dynamicStyles.title]}>목표를 찾았어요!</Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>AI가 분석한 내용을 확인해보세요</Text>
        </View>

        {/* 메인 이미지 */}
        <ImageBackground
          source={require("../../assets/jeju.png")}
          style={dynamicStyles.imageContainer}
          resizeMode="cover"
          imageStyle={dynamicStyles.imageRadius}
        />

        {/* 목표명 및 편집 버튼 */}
        <View style={[styles.goalSummary, dynamicStyles.goalSummary]}>
          <Text style={[styles.goalLabel, dynamicStyles.goalLabel]} numberOfLines={1}>
            {dynamicGoal.title}
          </Text>
          <Pressable
            onPointerEnter={() => setIsEditHovered(true)}
            onPointerLeave={() => setIsEditHovered(false)}
            style={[
              styles.editButton,
              dynamicStyles.editButton,
              isEditHovered && styles.editButtonHovered,
            ]}
          >
            <Ionicons name="construct" size={16 * sizeScale} color="#ff7b22" />
          </Pressable>
        </View>

        {/* 금액 */}
        <Text style={[styles.price, dynamicStyles.price]}>
          {dynamicGoal.price.toLocaleString()}원
        </Text>

        {/* 정보 카드 리스트 (예상 기간 & 추천 저축 슬롯) */}
        <View style={[styles.infoRow, dynamicStyles.infoRow]}>
          <View style={[styles.infoBox, dynamicStyles.infoBox]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>예상 기간</Text>
            <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{dynamicGoal.period}</Text>
          </View>

          <View style={[styles.infoBox, dynamicStyles.infoBox]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>추천 저축 슬롯</Text>
            <Text style={[styles.infoValue, dynamicStyles.infoValue]}>
              {getSavingSlot(dynamicGoal.durationDays, dynamicGoal.period)}
            </Text>
          </View>
        </View>

        {/* 하단 버튼 그룹 */}
        <View style={[styles.buttonGroup, dynamicStyles.buttonGroup]}>
          <Pressable
            onPress={handleRegisterPress}
            style={({ hovered }: any) => [
              styles.primaryButton,
              dynamicStyles.primaryButton,
              hovered && styles.primaryButtonHovered,
            ]}
          >
            <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>맞아요, 등록하기</Text>
          </Pressable>

          <Pressable
            onPress={handleBackPress}
            style={({ hovered }: any) => [
              styles.secondaryButton,
              dynamicStyles.secondaryButton,
              hovered && styles.secondaryButtonHovered,
            ]}
          >
            <Text style={[styles.secondaryButtonText, dynamicStyles.secondaryButtonText]}>다시 찾기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff", // 메인배경 흰색으로 통일
  },
  container: {
    flex: 1,
  },
  content: {
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    alignItems: "center",
  },
  title: {
    color: "#111719",
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#6b7280", // 서브타이틀 회색조로 트렌디하게 변경
    fontWeight: "700",
    textAlign: "center",
  },
  goalSummary: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalLabel: {
    color: "#111719",
    fontWeight: "800",
    flex: 1,
  },
  price: {
    color: "#111719",
    fontWeight: "800",
  },
  editButton: {
    backgroundColor: "#ffe0c5",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
  } as any,
  editButtonHovered: {
    backgroundColor: "#ffd0a5",
  },
  infoRow: {
    flexDirection: "row",
    width: "100%",
  },
  infoBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d0eae6", // 얇은 민트빛 보더
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    color: "#6B7280",
    fontWeight: "700",
    textAlign: "center",
  },
  infoValue: {
    color: "#00a993",
    fontWeight: "800",
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#00a993",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty: "all",
    transitionDuration: "0.2s",
  } as any,
  primaryButtonHovered: {
    backgroundColor: "#008a78",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  secondaryButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#00a993",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty: "all",
    transitionDuration: "0.2s",
  } as any,
  secondaryButtonHovered: {
    backgroundColor: "#f0f5f4",
  },
  secondaryButtonText: {
    color: "#00a993",
    fontWeight: "800",
  },
});
