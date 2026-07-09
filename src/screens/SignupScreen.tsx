import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function SignupScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !nickname) {
            Alert.alert('안내', '모든 필드를 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            // 명세서에 적힌 Base URL과 엔드포인트 세팅
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    nickname,
                }),
            });

            const result = await response.json();

            if (response.status === 201) {
                Alert.alert('성공', `${result.nickname}님, 회원가입이 완료되었습니다!`,[
                    {
                        text : '확인',
                        onPress: () => navigation.navigate('Login')
                    }
                    ]);
                // TODO: 로그인 화면으로 이동하는 로직이 여기에 들어갑니다.
            } else {
                // 명세서 부록에 정의된 공통 에러 코드 핸들링
                if (result.code === 'DUPLICATE_EMAIL') {
                    Alert.alert('오류', '이미 사용 중인 이메일입니다.');
                } else if (result.code === 'INVALID_INPUT') {
                    Alert.alert('오류', '비밀번호 형식을 확인해주세요. (8자 이상)');
                } else {
                    Alert.alert('오류', result.message || '가입에 실패했습니다.');
                }
            }
        } catch (error) {
            Alert.alert('오류', '서버 통신에 실패했습니다. 서버가 켜져 있는지 확인해 주세요.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            {/* 배경에 은은하게 번지는 민트/블루 글로우 서클 레이어 */}
            <View style={[styles.blurCircle, styles.mintGlow]} />
            <View style={[styles.blurCircle, styles.blueGlow]} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
                    {/* 상단 뒤로가기 헤더 */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    {/* 타이틀 영역 */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleMain}>iM AgentiX</Text>
                        <Text style={styles.titleSub}>시작하기</Text>
                        <Text style={styles.description}>목표 달성을 위한 회원가입을 진행해 주세요.</Text>
                    </View>

                    {/* 인풋 폼 영역 */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>닉네임</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="아이엠뱅크에서 사용할 닉네임"
                                placeholderTextColor="#9CA3AF"
                                value={nickname}
                                onChangeText={setNickname}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>이메일 주소</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="example@email.com"
                                placeholderTextColor="#9CA3AF"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>비밀번호</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="8자 이상 입력해주세요"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* 하단 버튼: 피그마 메인화면 속 시그니처 비비드 그린 컬러 매칭 */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? '처리 중...' : '맞아요, 등록하기'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // 전체적으로 깨끗하고 맑은 라이트 그레이 톤 바탕
    },
    blurCircle: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        opacity: 0.25,
        // iOS 내장 블러 효과 치트키 (Shadow의 구름 현상 활용)
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 80,
        // Android용 블러 필터 대체 속성
        elevation: 20,
    },
    mintGlow: {
        top: -50,
        right: -50,
        backgroundColor: '#00cc99',
        shadowColor: '#00cc99',
    },
    blueGlow: {
        bottom: 100,
        left: -80,
        backgroundColor: '#3b82f6',
        shadowColor: '#3b82f6',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingBottom: 40,
    },
    header: {
        height: 56,
        justifyContent: 'center',
        marginLeft: -8,
    },
    backButton: {
        padding: 8,
    },
    titleContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    /* 글씨체 대조: 굵고 강한 타이틀과 얇은 서브 타이틀 배치 */
    titleMain: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
    },
    titleSub: {
        fontSize: 32,
        fontWeight: '300',
        color: '#0F172A',
        letterSpacing: -1,
        marginTop: -2,
    },
    description: {
        fontSize: 15,
        color: '#64748B',
        marginTop: 12,
        letterSpacing: -0.3,
    },
    formContainer: {
        flex: 1,
    },
    inputWrapper: {
        marginBottom: 24,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
        marginLeft: 4,
    },
    /* 피그마 특유의 투명하고 부드러운 모서리의 인풋 스타일 */
    input: {
        height: 54,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // 뒤의 블러 색상이 살짝 비치는 효과
        borderRadius: 16,
        paddingHorizontal: 18,
        fontSize: 15,
        color: '#1E293B',
        // 소프트한 입체감을 위한 은은한 섀도우
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    buttonContainer: {
        marginTop: 20,
    },
    /*  초록 버튼 */
    button: {
        height: 56,
        backgroundColor: '#00bfa5',
        borderRadius: 28, // 알약 모양의 라운딩 처리
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00bfa5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#94A3B8',
        shadowColor: 'transparent',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
});