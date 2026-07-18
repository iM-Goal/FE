import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen'; // 기존 실제 ChatScreen 연결
import DepositDetailScreen from './DepositDetailScreen'; // 기존 실제 Deposit 화면 연결
import SpendingReport from './SpendingReport';
const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                // iM뱅크 액티브 컬러 맵핑 (선택 시 iM민트, 비선택 시 그레이)
                tabBarActiveTintColor: '#009D8B',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0, // 선을 없애고 섀도우로 더 깔끔하게 처리
                    height: 64,        // 바 자체 높이 살짝 확장

                    // 하단 바를 살짝 위로 띄우기 위한 여백 및 라운드 처리
                    marginBottom: Platform.OS === 'ios' ? 12 : 8,
                    marginHorizontal: 16,
                    borderRadius: 20,

                    // 공중에 뜬 듯한 고급스러운 그림자(Glow/Shadow) 효과
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    elevation: 5, // 안드로이드용 그림자

                    paddingBottom: 8,
                    paddingTop: 8,
                    position: 'absolute', // 하단 대시보드 내용 위에 싹 얹어지도록 설정
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    fontFamily: 'IM_Hyemin-Bold', // 폰트 정체성 일치화
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.prototype.keys = 'home';

                    if (route.name === '홈') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === '소비분석') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'AI알림') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === '토큰미션') {
                        iconName = focused ? 'key' : 'key-outline';
                    }

                    return <Ionicons name={iconName} size={22} color={color} />;
                },
            })}
        >

            <Tab.Screen name="홈" component={HomeScreen} />
            <Tab.Screen name="소비분석" component={SpendingReport} />
            <Tab.Screen name="AI알림" component={ChatScreen} />
            <Tab.Screen name="토큰미션" component={DepositDetailScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        backgroundColor: '#F4F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    placeholderTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
        fontFamily: 'IM_Hyemin-Bold',
    },
    placeholderDesc: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: 'IM_Hyemin-Regular',
    },
});