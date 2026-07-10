import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BASE_SCREEN_HEIGHT = 844;
const BASE_SCREEN_WIDTH = 390;

const agentixCharacter = require("../../assets/success.png");
const jejuAsset = require("../../assets/jeju.png");

export interface SuccessGoalProps {
  productName?: string;
  productPrice?: string;
  productImage?: any;
  period?: string;
  speed?: string;
  fontFamily?: string;
  onPurchase?: () => void;
  onRegisterNewGoal?: () => void;
}

export default function SuccessGoal({
  productName = "제주도 푸른 바다 여행",
  productPrice = "300,000원",
  productImage = jejuAsset,
  period = "1개월",
  speed = "8월 30일까지",
  fontFamily,
  onPurchase = () => console.log("Purchase clicked"),
  onRegisterNewGoal = () => console.log("Register new goal clicked"),
}: SuccessGoalProps) {
  const { width, height } = useWindowDimensions();

  const widthScale = width / BASE_SCREEN_WIDTH;
  const heightScale = height / BASE_SCREEN_HEIGHT;
  const sizeScale = width / BASE_SCREEN_WIDTH;

  const textFont = fontFamily ? { fontFamily } : {};

  // 이미지 소스가 숫자(require)인지 객체({uri})인지 판별
  const imageSource =
    typeof productImage === "string" ? { uri: productImage } : productImage;

  const dynamicStyles = {
    header: {
      paddingHorizontal: 24 * sizeScale,
      paddingTop: 12 * heightScale,
      paddingBottom: 4 * heightScale,
    },
    logo: {
      fontSize: 20 * sizeScale,
    },
    headerContent: {
      paddingHorizontal: 24 * sizeScale,
      marginTop: 20 * heightScale,
      paddingBottom: 0, // 🌟 하단 여백을 없애서 바닥에 딱 붙게 설정
      flexDirection: "row" as const,
      alignItems: "flex-end" as const, // 🌟 컨테이너 내부 요소들을 바닥(아래) 기준으로 정렬
      justifyContent: "space-between" as const,
      zIndex: 1,
    },
    mascotImage: {
      width: 160 * sizeScale, // 캐릭터 크기 살짝 조정
      height: 160 * sizeScale,
      marginBottom: -15 * heightScale, // 🌟 배너 밑으로 캐릭터가 살짝 숨어 들어가며 얹혀지도록 음수 마진 적용
    },
    successTextContainer: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flex: 1,
      marginBottom: 30 * heightScale, // 🌟 텍스트는 캐릭터 몸통 중앙 위치에 오도록 바닥에서 띄워줌
    },
    percentTextRow: {
      flexDirection: "row" as const,
      alignItems: "baseline" as const,
      marginBottom: -4 * heightScale,
    },
    percentNumber: {
      fontSize: 58 * sizeScale,
      lineHeight: 58 * sizeScale,
    },
    percentSign: {
      fontSize: 32 * sizeScale,
      marginLeft: 2 * sizeScale,
    },
    goalText: {
      fontSize: 24 * sizeScale,
      marginTop: 0,
    },
    cardContainer: {
      borderTopLeftRadius: 40 * sizeScale,
      borderTopRightRadius: 40 * sizeScale,
      marginTop: 0, // 🌟 겹치는 마진 제거 (캐릭터의 marginBottom으로 충분히 겹침)
      paddingHorizontal: 24 * sizeScale,
      paddingTop: 35 * heightScale,
      paddingBottom: 24 * heightScale,
      zIndex: 3, // 배너가 캐릭터 윗부분을 덮게 됨
    },
    shoeCard: {
      height: 180 * heightScale,
      borderRadius: 36 * sizeScale,
      marginBottom: 16 * heightScale,
    },
    shoeImage: {
      width: "100%",
      height: "100%",
    },
    productDetailsRow: {
      marginBottom: 12 * heightScale,
    },
    productTitle: {
      fontSize: 22 * sizeScale,
    },
    productPriceText: {
      fontSize: 26 * sizeScale,
      marginTop: 4 * heightScale,
    },
    metaInfoRow: {
      flexDirection: "row" as const,
      marginTop: 6 * heightScale,
    },
    metaBadge: {
      paddingHorizontal: 10 * sizeScale,
      paddingVertical: 4 * heightScale,
      borderRadius: 12 * sizeScale,
      marginRight: 8 * sizeScale,
    },
    metaText: {
      fontSize: 12 * sizeScale,
    },
    messageContainer: {
      marginBottom: 20 * heightScale,
    },
    messageText: {
      fontSize: 15 * sizeScale,
      lineHeight: 22 * sizeScale,
    },
    button: {
      height: 54 * sizeScale,
      borderRadius: 27 * sizeScale,
    },
    buttonText: {
      fontSize: 16 * sizeScale,
    },
    registerButton: {
      height: 54 * sizeScale,
      borderRadius: 27 * sizeScale,
      marginTop: 12 * heightScale,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <LinearGradient
        colors={["#FFFFFF", "#E6F6F3", "#D0F0EA"]}
        locations={[0.0, 0.22, 0.36]}
        style={styles.gradientContainer}
      >
        {/* Top Header Logo */}
        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={[styles.logo, dynamicStyles.logo, textFont]}>
            <Text style={styles.logoDot}>iM</Text> Agent
            <Text style={styles.logoAccent}>iX</Text>
          </Text>
        </View>

        {/* Mascot & Success Goal layout */}
        <View style={dynamicStyles.headerContent}>
          <Image
            source={agentixCharacter}
            style={dynamicStyles.mascotImage}
            resizeMode="contain"
          />
          <View style={dynamicStyles.successTextContainer}>
            <View style={dynamicStyles.percentTextRow}>
              <Text
                style={[
                  styles.percentNumberText,
                  dynamicStyles.percentNumber,
                  textFont,
                ]}
              >
                100
              </Text>
              <Text
                style={[
                  styles.percentSignText,
                  dynamicStyles.percentSign,
                  textFont,
                ]}
              >
                %
              </Text>
            </View>
            <Text style={[styles.goalText, dynamicStyles.goalText, textFont]}>
              목표 달성!
            </Text>
          </View>
        </View>

        {/* Fixed Non-scrollable Card Container */}
        <View
          style={[
            styles.cardContainer,
            dynamicStyles.cardContainer,
            styles.flexFill,
          ]}
        >
          {/* Goal Image Card */}
          <View style={[styles.shoeCard, dynamicStyles.shoeCard]}>
            <Image
              source={imageSource}
              style={dynamicStyles.shoeImage}
              resizeMode="cover"
            />
          </View>

          {/* Product Details Row */}
          <View
            style={[styles.productDetailsRow, dynamicStyles.productDetailsRow]}
          >
            <View style={styles.productLeftColumn}>
              <Text
                style={[
                  styles.productTitle,
                  dynamicStyles.productTitle,
                  textFont,
                ]}
              >
                {productName}
              </Text>
              <Text
                style={[
                  styles.productPriceText,
                  dynamicStyles.productPriceText,
                  textFont,
                ]}
              >
                {productPrice}
              </Text>

              {/* 기간 및 목표일 메타 정보 뷰 */}
              <View style={dynamicStyles.metaInfoRow}>
                <View style={[styles.metaBadge, dynamicStyles.metaBadge]}>
                  <Text
                    style={[styles.metaText, dynamicStyles.metaText, textFont]}
                  >
                    기간 {period}
                  </Text>
                </View>
                <View style={[styles.metaBadge, dynamicStyles.metaBadge]}>
                  <Text
                    style={[styles.metaText, dynamicStyles.metaText, textFont]}
                  >
                    목표 {speed}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Motivational message */}
          <View
            style={[styles.messageContainer, dynamicStyles.messageContainer]}
          >
            <Text
              style={[styles.messageText, dynamicStyles.messageText, textFont]}
            >
              축하합니다. 목표를 달성했어요!
            </Text>
            <Text
              style={[styles.messageText, dynamicStyles.messageText, textFont]}
            >
              이제 설레는 마음으로 여행을 떠나보세요.
            </Text>
          </View>

          {/* Action Buttons */}
          <Pressable
            style={({ hovered, pressed }) => [
              styles.button,
              dynamicStyles.button,
              pressed && styles.buttonPressed,
              // @ts-ignore
              hovered && styles.buttonHovered,
            ]}
            onPress={onPurchase}
          >
            <Text
              style={[styles.buttonText, dynamicStyles.buttonText, textFont]}
            >
              구매하기
            </Text>
          </Pressable>

          <Pressable
            style={({ hovered, pressed }) => [
              styles.registerButton,
              dynamicStyles.registerButton,
              pressed && styles.registerButtonPressed,
              // @ts-ignore
              hovered && styles.registerButtonHovered,
            ]}
            onPress={onRegisterNewGoal}
          >
            <Text
              style={[
                styles.registerButtonText,
                dynamicStyles.buttonText,
                textFont,
              ]}
            >
              새로운 목표 등록하기
            </Text>
          </Pressable>
        </View>
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
  },
  logo: {
    color: "#151b1e",
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  logoDot: {
    color: "#00806E",
  },
  logoAccent: {
    color: "#00806E",
  },
  percentNumberText: {
    color: "#00806E",
    fontWeight: "900",
  },
  percentSignText: {
    color: "#00806E",
    fontWeight: "700",
  },
  goalText: {
    color: "#00806E",
    fontWeight: "bold",
  },
  flexFill: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  shoeCard: {
    backgroundColor: "#F1F3F5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  productDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productLeftColumn: {
    flex: 1,
  },
  productTitle: {
    color: "#1A1A1A",
    fontWeight: "bold",
  },
  productPriceText: {
    color: "#000000",
    fontWeight: "900",
  },
  metaBadge: {
    backgroundColor: "#E6F6F3",
  },
  metaText: {
    color: "#00806E",
    fontWeight: "600",
  },
  messageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    color: "#4A5D5A",
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00B395",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00B395",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonHovered: {
    backgroundColor: "#00806E",
  },
  buttonPressed: {
    backgroundColor: "#006E5E",
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#0F3B36",
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonHovered: {
    backgroundColor: "#F3FBF9",
  },
  registerButtonPressed: {
    backgroundColor: "#E6F4F1",
    transform: [{ scale: 0.98 }],
  },
  registerButtonText: {
    color: "#000000",
    fontWeight: "bold",
  },
});
