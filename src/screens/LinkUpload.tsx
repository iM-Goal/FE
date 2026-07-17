import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

export default function LinkUpload({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const frameWidth = Math.min(width, 390);
  const sizeScale = frameWidth / BASE_SCREEN_WIDTH;
  const heightScale = Math.min(height, 850) / BASE_SCREEN_HEIGHT;

  const [linkText, setLinkText] = useState("");

  const handleBackPress = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleUploadPress = () => {
    if (!linkText.trim()) {
      Alert.alert("알림", "상품 링크를 입력해 주세요!");
      return;
    }
    // 링크가 입력되면 SearchGoalScreen으로 넘어가서 AI 분석 화면(3초 대기)을 노출합니다.
    navigation.navigate("SearchGoalScreen");
  };

  const dynamicStyles = {
    content: {
      maxWidth: frameWidth,
      minHeight: height - 70,
      paddingHorizontal: 28 * sizeScale,
      paddingTop: 24 * heightScale,
      paddingBottom: 40 * heightScale,
    },
    header: {
      maxWidth: frameWidth,
    },
    headerTitle: {
      fontSize: 24 * sizeScale,
    },
    subDescription: {
      fontSize: 16 * sizeScale,
      lineHeight: 22 * sizeScale,
      marginTop: 20 * heightScale,
      marginBottom: 36 * heightScale,
    },
    input: {
      width: "100%",
      height: 52 * heightScale,
      borderRadius: 26 * sizeScale,
      paddingHorizontal: 20 * sizeScale,
      fontSize: 14 * sizeScale,
      marginBottom: 20 * heightScale,
    },
    uploadButton: {
      width: "100%",
      height: 52 * heightScale,
      borderRadius: 26 * sizeScale,
    },
    uploadButtonText: {
      fontSize: 16 * sizeScale,
    },
  } as any;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 헤더 (SettingGoalScreen / VoiceRecordScreen / PictureUpload와 완전히 동일한 위치 고정 헤더 배치) */}
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBackPress}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#ffffff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>링크 업로드</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, dynamicStyles.content]}
        showsVerticalScrollIndicator={false}
      >
        {/* 설명 문구 */}
        <Text style={[styles.subDescription, dynamicStyles.subDescription]}>
          필요한 목표를 상품 링크로 추가해보세요!
        </Text>

        {/* 링크 입력란 */}
        <TextInput
          placeholder="여기에 상품 링크를 입력하거나 붙여넣으세요"
          placeholderTextColor="rgba(255, 255, 255, 0.45)"
          style={[styles.input, dynamicStyles.input]}
          value={linkText}
          onChangeText={setLinkText}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="done"
          onSubmitEditing={handleUploadPress}
        />

        {/* 하단 업로드 버튼 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleUploadPress}
          style={[styles.uploadButton, dynamicStyles.uploadButton]}
        >
          <Text style={[styles.uploadButtonText, dynamicStyles.uploadButtonText]}>
            업로드 하기
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#013b30", // 동일한 딥그린 배경색
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  subDescription: {
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "transparent",
    color: "#ffffff",
    fontWeight: "600",
  },
  uploadButton: {
    backgroundColor: "#00a993",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
});
