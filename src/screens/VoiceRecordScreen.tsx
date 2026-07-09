import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//import { Audio } from 'expo-av'; // 실제 오디오 녹음 라이브러리 추가 이거 근데 못쓸듯 시뮬레이터라서

export default function VoiceRecordScreen({ navigation }: any) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    // 실시간으로 텍스트가 타이핑되는 듯한 효과를 주기 위한 상태
    const [speechText, setSpeechText] = useState('아래 버튼을 눌러 말씀해주세요.');

    const barHeights = [30, 50, 80, 60, 40, 75, 90, 55, 35, 70, 85, 45, 65, 95, 50, 40, 75, 60];

    const animationValue = useRef(new Animated.Value(1)).current;
    const animationLoop = useRef<Animated.CompositeAnimation | null>(null);

    // 펄스 애니메이션 시작 함수
    const startWaveAnimation = () => {
        // 기존에 돌고 있는 애니메이션이 있다면 중지
        if (animationLoop.current) {
            animationLoop.current.stop();
        }

        animationLoop.current = Animated.loop(
            Animated.sequence([
                Animated.timing(animationValue, { toValue: 1.4, duration: 400, useNativeDriver: true }),
                Animated.timing(animationValue, { toValue: 0.7, duration: 400, useNativeDriver: true }),
            ])
        );

        animationLoop.current.start();
    };

    // 애니메이션 정지 및 리셋 함수
    const stopWaveAnimation = () => {
        if (animationLoop.current) {
            animationLoop.current.stop();
        }
        // 말하기 정지하면 원래 크기(1)로 부드럽게 복귀
        Animated.timing(animationValue, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    };

    // 말하기 시작하면 제주도 여행 시나리오가 타이핑되듯 박히는 효과
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRecording) {
            setSpeechText('');
            // MVP 고정 문구
            const fullText = "   나 제주도 여행을 8월 30일에 갈거야. 한달 동안 30만원 모아야 돼.";
            let index = 0;

            timer = setInterval(() => {
                if (index < fullText.length) {
                    setSpeechText((prev) => prev + fullText.charAt(index));
                    index++;
                } else {
                    clearInterval(timer);
                }
            }, 120); // 타이핑 속도 살짝 상향
        } else {
            if (speechText.startsWith('제주도 여행')) {
                // 녹음이 끝났을 때는 텍스트 유지
            } else {
                setSpeechText('아래 버튼을 눌러 말씀해주세요.');
            }
        }

        return () => clearInterval(timer);
    }, [isRecording]);

    // 화면을 완전히 벗어날 때 마이크 자원 해제
    useEffect(() => {
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, [recording]);

    // 중앙 버튼 클릭 시 작동하는 통합 컨트롤러
    const handleRecordToggle = async () => {
        if (isRecording) {
            // 이미 녹음 중이었다면 -> 녹음 중지
            await stopRecordingFlow();
        } else {
            // 정지 상태였다면 -> 녹음 시작
            await startRecordingFlow();
        }
    };

// 녹음 시작 핵심 로직 변경
    const startRecordingFlow = async () => {
        try {
            setIsRecording(true);
            startWaveAnimation();
        } catch (err) {
            console.error(err);
        }
    };
    /*const startRecordingFlow = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert('권한 거부', '마이크 권한이 필요합니다.');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(newRecording);
            setIsRecording(true);
            startWaveAnimation(); // 안전하게 애니메이션 재생
        } catch (err) {
            console.error('녹음 가동 실패:', err);
        }
    };*/

// 녹음 중지 핵심 로직 변경
    const stopRecordingFlow = async () => {
        setIsRecording(false);
        stopWaveAnimation();

        // 알림창은 그대로 띄워서 다음 플로우 확인 가능하게
        Alert.alert('분석 준비 완료', '음성 녹음이 끝났습니다. AI 분석 화면으로 넘어갈까요?', [
            { text: '다시 말하기', style: 'cancel', onPress: () => setSpeechText('아래 버튼을 눌러 말씀해주세요.') },
            { text: '다음단계 (이동)', onPress: () => navigation.navigate('SearchGoalScreen') } //분석 화면으로 넘어가야됨 (여기에 추가해주세요)
        ]);
    };
   /* const stopRecordingFlow = async () => {
        if (!recording) return;

        setIsRecording(false);
        stopWaveAnimation(); // 애니메이션 중지

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log('🎵 최종 생성된 오디오 파일 경로(URI):', uri);  // 나중에 백엔드 AI 분석 화면 만들 때 들고갈 uri

            Alert.alert('분석 준비 완료', '음성 녹음이 끝났습니다. AI 분석 화면으로 넘어갈까요?', [
                { text: '다시 말하기', style: 'cancel', onPress: () => setSpeechText('아래 버튼을 눌러 말씀해주세요.') },
                { text: '다음단계 (이동)', onPress: () => navigation.goBack() } // 임시로 goBack 처리
            ]);
        } catch (error) {
            console.error('녹음 종료 실패:', error);
        } finally {
            setRecording(null);
        }
    };*/

    return (
        <SafeAreaView style={styles.container}>
            {/* 상단 헤더 영역 */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>말하기</Text>
                <View style={{ width: 26 }} />
            </View>

            <Text style={styles.subDescription}>
                필요한 목표를 음성으로 추가해보세요!
            </Text>

            {/* 중앙 음성 상태 및 파형 영역 */}
            <View style={styles.centerContainer}>
                <View style={styles.statusWrapper}>
                    <View style={[styles.statusDot, { backgroundColor: isRecording ? '#48C0A4' : '#718096' }]} />
                    <Text style={styles.statusText}>{isRecording ? 'LISTENING...' : 'READY'}</Text>
                </View>

                {/* 파형 애니메이션 */}
                <Animated.View style={[styles.waveformContainer, { transform: [{ scaleY: animationValue }] }]}>
                    {barHeights.map((height, index) => (
                        <View
                            key={index}
                            style={[
                                styles.waveBar,
                                {
                                    height: height,
                                    opacity: isRecording ? (index < 4 || index > 13 ? 0.3 : 1) : 0.15 // 녹음 안 할 땐 잔잔하게 처리
                                }
                            ]}
                        />
                    ))}
                </Animated.View>
            </View>

            {/* 실시간 텍스트 프리뷰 말풍선 */}
            <View style={styles.bubbleContainer}>
                <View style={styles.speechBubble}>
                    <Text style={styles.speechText}>{speechText}</Text>
                </View>
                <View style={styles.bubbleTriangle} />
            </View>

            {/* 하단 컨트롤러: 원형 녹음/정지 토글 버튼 */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[styles.stopButtonOuter, { borderColor: isRecording ? '#FF5E62' : '#48C0A4' }]}
                    activeOpacity={0.8}
                    onPress={handleRecordToggle}
                >
                    <View style={[styles.stopButtonInner, { backgroundColor: isRecording ? '#FF5E62' : '#48C0A4' }]}>
                        {isRecording ? (
                            <View style={styles.stopSquare} /> // 녹음 중일 땐 중지 네모박스
                        ) : (
                            <Ionicons name="mic" size={32} color="#FFFFFF" /> // 대기 중일 땐 마이크 아이콘
                        )}
                    </View>
                </TouchableOpacity>
                <Text style={styles.stopText}>{isRecording ? '말하기 중지' : '말하기 시작'}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#092C28', // 시안의 딥 그린 어두운 배경색 반영
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        marginTop: 10,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subDescription: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 20,
        letterSpacing: -0.5,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#48C0A4',
        marginRight: 8,
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
        letterSpacing: 1,
    },
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        width: '100%',
        paddingHorizontal: 30,
    },
    waveBar: {
        width: 4,
        borderRadius: 2,
        backgroundColor: '#5CE1E6', // 네온 민트/시안 컬러 반영
        marginHorizontal: 3,
        // 네온 글로우 효과 (iOS 전용)
        shadowColor: '#5CE1E6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 5, // Android용 대체
    },
    bubbleContainer: {
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 40,
    },
    speechBubble: {
        backgroundColor: 'rgba(18, 93, 83, 0.8)', // 반투명 맑은 딥민트 브러시 컬러
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 32,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(92, 225, 230, 0.2)',
    },
    speechText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    bubbleTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgba(18, 93, 83, 0.8)',
        transform: [{ rotate: '180deg' }], // 삼각형을 아래로 뒤집음
        marginTop: -1,
    },
    bottomContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    stopButtonOuter: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: '#FF5E62', // 시안 속 빨간 외각 라인
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    stopButtonInner: {
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: '#FF5E62', // 안쪽 붉은 원 채우기
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopSquare: {
        width: 22,
        height: 22,
        backgroundColor: '#FFFFFF', // 중앙 정지 네모 사각형
        borderRadius: 4,
    },
    stopText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.8,
    },
});