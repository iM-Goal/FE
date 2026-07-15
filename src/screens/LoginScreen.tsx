import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('안내', '이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            // 🎯 [핵심] response.json()은 여기서 '딱 한 번만' 실행해서 result에 담아둡니다!
            const result = await response.json();

            if (response.status === 200) {
                // 🎯 서버가 실제로 준 본문 데이터 전체를 안전하게 확인합니다.
                console.log('📱 서버가 준 로그인 응답 데이터 전체:', result);

                // 명세서v2.0 기반 변수 맵핑 및 가드 처리
                const token = result.accessToken || result.token || result.data?.token;

                if (token) {
                    // 🎯 [신규 추가] 이전 계정이나 테스트로 남아있던 데모 데이터 완전 박멸!
                    await AsyncStorage.removeItem('demo_goal_created');
                    await AsyncStorage.removeItem('demo_locked_amount');
                    await AsyncStorage.removeItem('demo_locked_title');
                    await AsyncStorage.removeItem('demo_locked_duration');

                    // 토큰을 안전하게 기기에 보관합니다.
                    await AsyncStorage.setItem('userToken', token);
                    Alert.alert('성공', '로그인이 완료되었습니다!');
                    console.log('✅ 기기에 안전하게 저장된 토큰:', token);
                    navigation.navigate('MainTabs');
                }  else {
                console.error('🚨 에러: 서버 응답에 accessToken 필드가 없습니다.');
                Alert.alert('안내(데모)', '토큰 규격 불일치로 임시 우회 진입합니다.');

                // 🎯 [신규 추가] 우회 로그인 시에도 깔끔하게 데이터 청소
                    await AsyncStorage.removeItem('demo_goal_created');
                await AsyncStorage.removeItem('demo_locked_amount');
                await AsyncStorage.removeItem('demo_locked_title');
                await AsyncStorage.removeItem('demo_locked_duration');

                await AsyncStorage.setItem('userToken', 'dummy_token_for_demo');
                navigation.navigate('MainTabs');
            }
            } else {
                if (result.code === 'INVALID_CREDENTIALS') {
                    Alert.alert('오류', '이메일 또는 비밀번호가 일치하지 않습니다.');
                } else {
                    Alert.alert('오류', result.message || '로그인에 실패했습니다.');
                }
            }
        } catch (error) {
            // 이제 중복 파싱 에러가 사라져서, 혹시 진짜 서버 에러가 나면 여기에 정직하게 찍힙니다.
            console.error('🚨 로그인 통신 에러 상세:', error);
            Alert.alert('오류', '서버 통신에 실패했습니다. 서버가 켜져 있는지 확인해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 글로우 서클 */}
            <View style={[styles.blurCircle, styles.mintGlow]} />
            <View style={[styles.blurCircle, styles.blueGlow]} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
                    {/* 상단 뒤로가기 헤더 */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    {/* 타이틀 영역 */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleMain}>iM AgentiX</Text>
                        <Text style={styles.titleSub}>로그인</Text>
                        <Text style={styles.description}>자산 관리와 미션 설정을 위해 로그인해 주세요.</Text>
                    </View>

                    {/* 인풋 폼 영역 */}
                    <View style={styles.formContainer}>
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
                                placeholder="비밀번호를 입력해주세요"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        {/* 계정 찾기 / 회원가입 유도 링크 (구조 정돈) */}
                        <View style={styles.linkContainer}>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>비밀번호 찾기</Text>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.linkText}>회원가입</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 하단 버튼 */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? '로그인 중...' : '로그인하기'}</Text>
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
        backgroundColor: '#F8FAFC',
    },
    blurCircle: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        opacity: 0.25,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 80,
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
    input: {
        height: 54,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        paddingHorizontal: 18,
        fontSize: 15,
        color: '#1E293B',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    linkText: {
        fontSize: 14,
        color: '#64748B',
    },
    divider: {
        width: 1,
        height: 14,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 12, // 💡 horizontalMargin 오타 완전 삭제 후 이것만 남김!
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        height: 56,
        backgroundColor: '#00bfa5',
        borderRadius: 28,
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