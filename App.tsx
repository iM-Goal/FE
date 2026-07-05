import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';



import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddGoalScreen from "./src/screens/AddGoalScreen";
import ChatScreen from "./src/screens/ChatScreen";
import VoiceRecordScreen from "./src/screens/VoiceRecordScreen";
import SearchGoalScreen from "./src/screens/SearchGoalScreen";
import CheckGoalScreen from "./src/screens/CheckGoalScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        'IM_Hyemin-Bold': require('./assets/fonts/IM_Hyemin-Bold.otf'),
        'IM_Hyemin-Regular': require('./assets/fonts/IM_Hyemin-Regular.otf'),
    });
    if (!fontsLoaded) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator
       /* initialRouteName="Login" // 첫 시작점은 로그인 화면!
        screenOptions={{
          headerShown: false, // 피그마 커스텀 헤더를 쓸 것이므로 네이티브 상단 바는 숨김
          cardStyle: { backgroundColor: "#F8FAFC" },
        }}*/
      >
        {/*<Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />*/}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddGoal" component={AddGoalScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="VoiceRecord" component={VoiceRecordScreen} />
        <Stack.Screen name="SearchGoalScreen" component={SearchGoalScreen} />
        <Stack.Screen name="CheckGoalScreen" component={CheckGoalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
