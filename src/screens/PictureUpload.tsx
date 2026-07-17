import React, { useState } from "react";
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

const BASE_SCREEN_HEIGHT = 812;
const BASE_SCREEN_WIDTH = 390;

export default function PictureUpload({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const frameWidth = Math.min(width, 390);
  const sizeScale = frameWidth / BASE_SCREEN_WIDTH;
  const heightScale = Math.min(height, 850) / BASE_SCREEN_HEIGHT;

  // 선택된 사진 상태 관리 (mock)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleBackPress = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleAddPhotoPress = () => {
    // 사진을 추가했을 때 가상으로 제주도 이미지를 업로드하는 모션 구현
    if (selectedPhoto) {
      setSelectedPhoto(null); // 토글식 해제
    } else {
      setSelectedPhoto("jeju");
    }
  };

  const handleUploadPress = () => {
    if (!selectedPhoto) {
      Alert.alert("알림", "업로드할 사진을 선택해 주세요!");
      return;
    }
    // 사진이 업로드되면 SearchGoalScreen으로 넘어가서 AI 분석 화면(3초 대기)을 노출합니다.
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
      marginBottom: 32 * heightScale,
    },
    dashedBox: {
      width: "100%",
      height: 220 * sizeScale,
      borderRadius: 24 * sizeScale,
      marginBottom: 32 * heightScale,
    },
    dashedBoxText: {
      fontSize: 16 * sizeScale,
      marginTop: 12 * heightScale,
    },
    gridContainer: {
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12 * sizeScale,
      marginBottom: 40 * heightScale,
    },
    gridItem: {
      width: (frameWidth - 56 - 24) / 3, // 3개 열 배치 구조
      height: (frameWidth - 56 - 24) / 3,
      borderRadius: 16 * sizeScale,
    },
    gridItemText: {
      fontSize: 11 * sizeScale,
      marginTop: 4 * heightScale,
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
      {/* 상단 헤더 (SettingGoalScreen / VoiceRecordScreen과 완벽히 일치하는 고정 헤더 배치) */}
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBackPress}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#ffffff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>사진 업로드</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, dynamicStyles.content]}
        showsVerticalScrollIndicator={false}
      >
        {/* 설명 문구 */}
        <Text style={[styles.subDescription, dynamicStyles.subDescription]}>
          필요한 목표를 사진으로 추가해보세요!
        </Text>

        {/* 중앙 점선 박스 영역 */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleAddPhotoPress}
          style={[styles.dashedBox, dynamicStyles.dashedBox]}
        >
          {selectedPhoto ? (
            <Image
              source={require("../../assets/jeju.png")}
              style={[styles.previewImage, { borderRadius: 24 * sizeScale }]}
            />
          ) : (
            <View style={styles.dashedBoxPlaceholder}>
              <Ionicons name="camera-outline" size={64 * sizeScale} color="#ffffff" />
              <Text style={[styles.dashedBoxText, dynamicStyles.dashedBoxText]}>
                사진을 추가해보세요
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 썸네일 그리드 영역 */}
        <View style={dynamicStyles.gridContainer}>
          {/* 새 사진 추가 버튼 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddPhotoPress}
            style={[styles.gridItem, dynamicStyles.gridItem, styles.addPhotoBtn]}
          >
            <Ionicons name="add" size={28 * sizeScale} color="#ffffff" />
            <Text style={[styles.gridItemText, dynamicStyles.gridItemText]}>새 사진 추가</Text>
          </TouchableOpacity>

          {/* 사진 추가 시 미리보기 슬롯 1개와 비어있는 플레이스홀더 슬롯 2개 */}
          {selectedPhoto ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddPhotoPress}
              style={[styles.gridItem, dynamicStyles.gridItem]}
            >
              <Image source={require("../../assets/jeju.png")} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.gridItem, dynamicStyles.gridItem, styles.emptySlot]} />
          )}
          <View style={[styles.gridItem, dynamicStyles.gridItem, styles.emptySlot]} />
          <View style={[styles.gridItem, dynamicStyles.gridItem, styles.emptySlot]} />
        </View>

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
    backgroundColor: "#013b30", // SettingGoalScreen과 동일한 딥그린 배경색
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
  dashedBox: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.45)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  dashedBoxPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  dashedBoxText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gridItem: {},
  addPhotoBtn: {
    backgroundColor: "#005c4b", // 좀 더 밝은 딥그린
    alignItems: "center",
    justifyContent: "center",
  },
  gridItemText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    resizeMode: "cover",
  },
  emptySlot: {
    backgroundColor: "#004d40", // 비어 있는 다크 플레이스홀더 슬롯
    opacity: 0.5,
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
