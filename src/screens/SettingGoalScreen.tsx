import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// 그라데이션 적용을 위한 라이브러리 임포트
import { LinearGradient } from "expo-linear-gradient";

const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

export default function SettingGoalScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();

  // 가로폭을 좀 더 컴팩트하게 조율하기 위해 최대폭을 390px로 제한
  const frameWidth = Math.min(width, 390);
  const sizeScale = frameWidth / BASE_SCREEN_WIDTH;
  const heightScale = Math.min(height, 850) / BASE_SCREEN_HEIGHT;

  const handleBackPress = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleMenuPress = (type: string) => {
    console.log(`SettingGoalScreen: ${type} 선택됨`);
    if (type === "말로하기") {
      navigation.navigate("VoiceRecord");
    } else if (type === "사진업로드") {
      navigation.navigate("PictureUpload");
    } else if (type === "링크업로드") {
      navigation.navigate("LinkUpload");
    } else {
      Alert.alert("알림", `현재 ${type} 기능은 준비 중입니다.`);
    }
  };

  const dynamicStyles = {
    content: {
      maxWidth: frameWidth,
      minHeight: height - 70, // 헤더 높이를 제외한 영역
      paddingHorizontal: 28 * sizeScale, // 양옆 마진 확보로 가로폭을 축소
      paddingTop: 36 * heightScale, // 위쪽 여백 확보하여 컴포넌트를 조금 아래로 배치
      paddingBottom: 40 * heightScale,
    },
    header: {
      maxWidth: frameWidth,
    },
    headerTitle: {
      fontSize: 24 * sizeScale,
    },
    characterImage: {
      width: 170 * sizeScale,
      height: 150 * sizeScale,
      marginBottom: 32 * heightScale,
    },
    mainTitle: {
      fontSize: 24 * sizeScale,
      lineHeight: 32 * sizeScale,
      marginBottom: 12 * heightScale,
    },
    subTitle: {
      fontSize: 14 * sizeScale,
      lineHeight: 20 * sizeScale,
      marginBottom: 32 * heightScale,
    },
    cardList: {
      width: "100%",
      gap: 14 * heightScale,
      marginBottom: 36 * heightScale,
    },
    card: {
      padding: 18 * sizeScale,
      borderRadius: 24 * sizeScale,
    },
    iconWrapper: {
      width: 48 * sizeScale,
      height: 48 * sizeScale,
      borderRadius: 16 * sizeScale,
      marginRight: 16 * sizeScale,
    },
    cardTitle: {
      fontSize: 18 * sizeScale,
      lineHeight: 24 * sizeScale,
    },
    cardDesc: {
      fontSize: 12 * sizeScale,
      lineHeight: 18 * sizeScale,
      marginTop: 4 * heightScale,
    },
    directButton: {
      borderRadius: 24 * sizeScale,
      paddingVertical: 10 * heightScale,
      paddingHorizontal: 28 * sizeScale,
    },
    directButtonText: {
      fontSize: 14 * sizeScale,
    },
  } as any;

  return (
    // 기존 SafeAreaView 배경색을 제거하고 전체를 그라데이션 컴포넌트로 감싸줍니다.
    <LinearGradient
      colors={["#265252", "#013b30", "#092c28"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 상단 헤더 영역 */}
        <View style={[styles.header, dynamicStyles.header]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBackPress}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={26} color="#ffffff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>목표 설정</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.content, dynamicStyles.content]}
          showsVerticalScrollIndicator={false}
        >
          {/* 중앙 캐릭터 */}
          <Image
            source={require("../../assets/char_blue.png")}
            style={[styles.characterImage, dynamicStyles.characterImage]}
            resizeMode="contain"
          >
            {/* 💡 사용 방법: 만약 이미지가 뜨지 않는다면 위 경로가 프로젝트 내 실제 캐릭터 이미지 파일 경로와 일치하는지 확인해 보세요! */}
          </Image>

          {/* 타이틀 및 서브 타이틀 */}
          <Text style={[styles.mainTitle, dynamicStyles.mainTitle]}>
            어떤 목표를 시작해볼까요?
          </Text>
          <Text style={[styles.subTitle, dynamicStyles.subTitle]}>
            나만의 소비습관을 분석하여{"\n"}가장 효율적인 저축방법을 찾아드려요.
          </Text>

          {/* 메뉴 리스트 */}
          <View style={dynamicStyles.cardList}>
            {/* 말로 하기 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleMenuPress("말로하기")}
              style={[styles.card, dynamicStyles.card]}
            >
              <View style={[styles.iconWrapper, dynamicStyles.iconWrapper]}>
                <Ionicons name="mic" size={24 * sizeScale} color="#00806d" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>말로 하기</Text>
                <Text style={[styles.cardDesc, dynamicStyles.cardDesc]}>
                  목소리로 목표를 들려주세요.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18 * sizeScale} color="#90c7b3" />
            </TouchableOpacity>

            {/* 사진 업로드 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleMenuPress("사진업로드")}
              style={[styles.card, dynamicStyles.card]}
            >
              <View style={[styles.iconWrapper, dynamicStyles.iconWrapper]}>
                <Ionicons name="camera" size={24 * sizeScale} color="#00806d" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>사진 업로드</Text>
                <Text style={[styles.cardDesc, dynamicStyles.cardDesc]}>
                  목표와 관련된 사진을 올려주세요.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18 * sizeScale} color="#90c7b3" />
            </TouchableOpacity>

            {/* 링크 업로드 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleMenuPress("링크업로드")}
              style={[styles.card, dynamicStyles.card]}
            >
              <View style={[styles.iconWrapper, dynamicStyles.iconWrapper]}>
                <Ionicons name="link" size={24 * sizeScale} color="#00806d" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>링크 업로드</Text>
                <Text style={[styles.cardDesc, dynamicStyles.cardDesc]}>
                  구매하고 싶은 상품 링크를 붙여주세요.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18 * sizeScale} color="#90c7b3" />
            </TouchableOpacity>
          </View>

          {/* 직접 입력하기 버튼 */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleMenuPress("직접입력하기")}
            style={[styles.directButton, dynamicStyles.directButton]}
          >
            <Text style={[styles.directButtonText, dynamicStyles.directButtonText]}>
              직접 입력하기
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent", // 그라데이션이 보이도록 투명하게 설정
  },
  container: {
    flex: 1,
  },
  content: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    marginTop: 10,
    width: "100%",
    alignSelf: "center",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#ffffff",
    fontWeight: "800",
    textAlign: "center",
  },
  characterImage: {
    alignSelf: "center",
  },
  mainTitle: {
    color: "#ffffff",
    fontWeight: "800",
    textAlign: "center",
  },
  subTitle: {
    color: "rgba(255, 255, 255, 0.75)",
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f2ee",
    width: "100%",
  },
  iconWrapper: {
    backgroundColor: "#d4ede4",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: "#152e27",
    fontWeight: "800",
  },
  cardDesc: {
    color: "#618276",
    fontWeight: "600",
  },
  directButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  directButtonText: {
    color: "#ffffff",
    fontWeight: "600", // 800에서 600(Semi-bold)으로 변경하여 덜 무겁게 수정
  },
});