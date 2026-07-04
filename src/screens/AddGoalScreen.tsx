import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MenuButton from '../components/MenuButton';

// MVP용 고정 사용자 ID
const FIXED_USER_ID = "user_test_123";

export default function AddGoalScreen({ navigation }: any) {

    const handlePress = (type: string) => {
        console.log(`User ID: ${FIXED_USER_ID}님이 ${type}을(를) 선택했습니다.`);

        if (type === '음성인식') {
            navigation.navigate('VoiceRecord'); // 🆕 VoiceRecordScreen으로 연동 점프!
        } else {
            // 사진이나 링크 업로드 등은 추후 구현
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 상단 헤더 영역 */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton}>
                    <Ionicons name="close-circle" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>새로운 목표 추가</Text>
                <View style={{ width: 28 }}/>
            </View>

            {/* 중앙 캐릭터 영역 */}
            <View style={styles.characterContainer}>
                <Image source={require('../../assets/char_blue.png')} style={styles.characterImage} />
            </View>
            {/* 하단 화이트 카드 영역 */}
            <View style={styles.cardContainer}>
                <Text style={styles.mainTitle}>뭐 사고 싶어?</Text>
                <Text style={styles.subTitle}>자유롭게 입력해보세요!</Text>
                {/* 버튼 리스트 */}
                <View style={styles.buttonList}>
                    <MenuButton
                        iconName="mic-outline"
                        title="말하기"
                        color="#48C0A4"
                        onPress={() => handlePress('음성인식')}
                    />
                    <MenuButton
                        iconName="camera-outline"
                        title="사진 업로드"
                        color="#4A90E2"
                        onPress={() => handlePress('사진업로드')}
                    />
                    <MenuButton
                        iconName="link-outline"
                        title="링크 업로드"
                        color="#9B51E0"
                        onPress={() => handlePress('링크업로드')}
                    />
                </View>
            </View>

            {/* 최하단 iM뱅크 로고 영역 */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>iM뱅크</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#48C0A4', // iM뱅크 민트 시그니처 배경색
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    characterContainer: {
        alignItems: 'center',
        zIndex: 10,
        transform: [{ translateY: 40 }], // 카드가 캐릭터 아래로 부드럽게 들어가도록 겹침 처리
    },
    dummyCharacter: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    characterImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingTop: 60, // 캐릭터와 겹치는 만큼 내부 패딩 확보
        paddingHorizontal: 30,
        alignItems: 'center',
        // 그림자 효과 (iOS용)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 16,
        color: '#888888',
        marginBottom: 40,
    },
    buttonList: {
        width: '100%',
    },
    footer: {
        height: 60,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#48C0A4', // 로고 텍스트 색상
    },
});