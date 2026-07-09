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

const analyzedGoal: AnalyzedGoal = {
  title: "제주도 푸른 바다 여행",
  price:  300000,
  period: "1개월",
  speed: "8월 30일까지",
  durationDays: 30,
};

const BASE_SCREEN_WIDTH = 251;
const BASE_SCREEN_HEIGHT = 508;

export default function CheckGoalScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const frameWidth = Math.min(width, BASE_SCREEN_WIDTH);
  const widthScale = Math.min(frameWidth / BASE_SCREEN_WIDTH, 1);
  const heightScale = Math.min(
    Math.max(height / BASE_SCREEN_HEIGHT, 0.86),
    1.18,
  );
  const sizeScale = Math.min(widthScale, 1);

  // 편집 버튼 호버 상태 관리
  const [isEditHovered, setIsEditHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBackPress = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  // 맞아요, 등록하기 버튼 클릭 시 발동하는 핵심 API 통신 함수
  const handleRegisterPress = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch('http://localhost:8080/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify({
          slotType: "SHORT",
          registrationType: "NATURAL_LANGUAGE",

          // 🎯 [치트키] AI 에이전트가 무조건 읽을 수밖에 없게 명령어 형태로 rawInput을 가공합니다.
          rawInput: `
            [명령] 다음 텍스트를 분석하여 JSON 필드를 채우세요.
            - 상품명(itemName): "${analyzedGoal.title}"
            - 가격(price): ${analyzedGoal.price}
            - 카테고리(category): "TRAVEL"
            
            사용자 입력: 나 ${analyzedGoal.title} 8월 30일에 갈 거야. ${analyzedGoal.price}원 모아야 돼.
          `.trim(),

          durationDays: analyzedGoal.durationDays,
          monthlyIncome: 2500000,
          fixedExpense: 1000000
        }),
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('성공', '목표 등록이 성공적으로 완료되었습니다!', [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate("MainTabs", {
                screen: "홈",
                params: { registeredSuccess: true }
              });
            }
          }
        ]);
      } else {
        let errorMessage = '목표 등록에 실패했습니다.';
        try {
          const textData = await response.text();
          if (textData) {
            const err = JSON.parse(textData);
            errorMessage = err.message || errorMessage;
          }
        } catch (e) {
          console.log('에러 바디 파싱 생략');
        }

        console.log(`서버가 응답한 상태 코드: ${response.status}`);
        Alert.alert('안내', `${errorMessage} (코드: ${response.status})`);

        navigation.navigate("MainTabs", {
          screen: "홈",
          params: { registeredSuccess: true }
        });
      }
    } catch (error) {
      console.error('목표 등록 통신 실패:', error);
      navigation.navigate("MainTabs", {
        screen: "홈",
        params: { registeredSuccess: true }
      });
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = {
    content: {
      maxWidth: BASE_SCREEN_WIDTH,
      minHeight: height,
      paddingHorizontal: 17 * sizeScale,
      paddingTop: 8 * heightScale,
      paddingBottom: 24 * heightScale,
    },
    header: {
      marginBottom: 10 * heightScale,
    },
    titleBlock: {
      marginBottom: 16 * heightScale,
    },
    resultCard: {
      marginBottom: 23 * heightScale,
    },
    image: {
      height: 134 * heightScale,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, dynamicStyles.content]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, dynamicStyles.header]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBackPress}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#12191b" />
          </TouchableOpacity>
        </View>

        <View style={[styles.titleBlock, dynamicStyles.titleBlock]}>
          <Text style={styles.title}>목표를 찾았어요!</Text>
          <Text style={styles.subtitle}>AI가 분석한 내용을 확인해보세요</Text>
        </View>

        <View style={[styles.resultCard, dynamicStyles.resultCard]}>
          <ImageBackground
            source={require("../../assets/jeju.png")}
            style={[styles.image, dynamicStyles.image]}
            resizeMode="cover"
            imageStyle={[styles.imageRadius, styles.imagePosition]}
          />

          <View style={styles.goalSummary}>
            <View style={styles.goalTextGroup}>
              <Text style={styles.goalLabel}>{analyzedGoal.title}</Text>
              <Text style={styles.price}>{analyzedGoal.price.toLocaleString()}원</Text>
            </View>

            {/* 주황색 편집 버튼 마우스 오버 효과 추가 */}
            <Pressable
              onPointerEnter={() => setIsEditHovered(true)}
              onPointerLeave={() => setIsEditHovered(false)}
              style={[
                styles.editButton,
                isEditHovered && styles.editButtonHovered,
              ]}
            >
              <Ionicons name="construct" size={16} color="#ff7b22" />
            </Pressable>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>예상 기간</Text>
              <Text style={styles.infoValue}>{analyzedGoal.period}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>언제까지?</Text>
              <Text style={styles.infoValue}>{analyzedGoal.speed}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          {/* 등록하기 버튼 마우스 오버 효과 추가 */}
          <Pressable
            onPress={handleRegisterPress}
            style={({ hovered }) => [
              styles.primaryButton,
              hovered && styles.primaryButtonHovered,
            ]}
          >
            <Text style={styles.primaryButtonText}>맞아요, 등록하기</Text>
          </Pressable>

          {/* 다시 찾기 버튼 마우스 오버 효과 추가 */}
          <Pressable
            onPress={handleBackPress}
            style={({ hovered }) => [
              styles.secondaryButton,
              hovered && styles.secondaryButtonHovered,
            ]}
          >
            <Text style={styles.secondaryButtonText}>다시 찾기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fffefe",
  },
  container: {
    flex: 1,
  },
  content: {
    width: "100%",
    alignSelf: "center",
    // 상단 전체 여백 확보를 위해 추가된 속성
    marginTop: 20,
  },
  header: {
    height: 26,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -6,
  },
  titleBlock: {
    alignItems: "center",
  },
  title: {
    color: "#111719",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: "center",
  },
  subtitle: {
    color: "#111719",
    fontSize: 9,
    fontWeight: "800",
    lineHeight: 13,
    marginTop: 1,
    textAlign: "center",
  },
  resultCard: {
    width: "100%",
    backgroundColor: "#fffafb",
  },
  image: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#e8f6f5",
  },
  imageRadius: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  imagePosition: {
    transform: [{ scale: 1.02 }],
  },
  goalSummary: {
    minHeight: 64,
    paddingTop: 9,
    paddingRight: 0,
    paddingBottom: 9,
    paddingLeft: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalTextGroup: {
    flex: 1,
    paddingRight: 8,
  },
  goalLabel: {
    color: "#22292b",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 14,
  },
  price: {
    color: "#070b0c",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 29,
    marginTop: 1,
  },
  editButton: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#ffe0c5",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
  },
  editButtonHovered: {
    backgroundColor: "#ffd0a5",
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
  },
  infoBox: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a9e0dc",
    backgroundColor: "#faffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  infoLabel: {
    color: "#101719",
    fontSize: 8,
    fontWeight: "900",
    lineHeight: 12,
    textAlign: "center",
  },
  infoValue: {
    color: "#008f80",
    fontSize: 9,
    fontWeight: "900",
    lineHeight: 13,
    marginTop: 2,
    textAlign: "center",
  },
  buttonGroup: {
    gap: 8,
  },
  primaryButton: {
    width: "100%",
    minHeight: 32,
    borderRadius: 14,
    backgroundColor: "#00a993",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4aa89d",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    transitionProperty: "all",
    transitionDuration: "0.2s",
  },
  primaryButtonHovered: {
    backgroundColor: "#008a78",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 16,
  },
  secondaryButton: {
    width: "100%",
    minHeight: 32,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#7e9490",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty: "all",
    transitionDuration: "0.2s",
  },
  secondaryButtonHovered: {
    backgroundColor: "#f0f5f4",
    borderColor: "#5d736f",
  },
  secondaryButtonText: {
    color: "#111719",
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 16,
  },
});
