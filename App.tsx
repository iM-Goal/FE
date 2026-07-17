import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddGoalScreen from "./src/screens/AddGoalScreen";
import ChatScreen from "./src/screens/ChatScreen";
import VoiceRecordScreen from "./src/screens/VoiceRecordScreen";
import SearchGoalScreen from "./src/screens/SearchGoalScreen";
import CheckGoalScreen from "./src/screens/CheckGoalScreen";
import DepositDetailScreen from "./src/screens/DepositDetailScreen";
import MainTabNavigator from "./src/screens/MainTabNavigator";
import GoalDetailScreen from "./src/screens/GoalDetailScreen";
import AlramChatScreen from "./src/screens/AlramChatScreen";
import SpendAlertScreen from "./src/screens/SpendAlertScreen";
import SuccessGoalScreen from "./src/screens/SuccessGoalScreen";
import SpendingReport from "./src/screens/SpendingReport";
import SpendingDate from "./src/screens/SpendingDate";
import SpendingCategory from "./src/screens/SpendingCategory";
import MissionDetail from "./src/screens/MissionDetailScreen";
import SalaryDistribution from "./src/screens/SalaryDistributioinScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "IM_Hyemin-Bold": require("./assets/fonts/IM_Hyemin-Bold.otf"),
    "IM_Hyemin-Regular": require("./assets/fonts/IM_Hyemin-Regular.otf"),
  });
  if (!fontsLoaded) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login" // 첫 시작점은 로그인 화면!
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#F8FAFC" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
       {/* <Stack.Screen name="Home" component={HomeScreen} />*/}
        <Stack.Screen name="AddGoal" component={AddGoalScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="VoiceRecord" component={VoiceRecordScreen} />
        <Stack.Screen name="SearchGoalScreen" component={SearchGoalScreen} />
        <Stack.Screen name="CheckGoalScreen" component={CheckGoalScreen} />
        <Stack.Screen name="DepositDetail" component={DepositDetailScreen} />
        <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
        <Stack.Screen name="AlramChatScreen" component={AlramChatScreen} />
        <Stack.Screen name="SpendAlert" component={SpendAlertScreen} />
        <Stack.Screen name="SuccessGoalScreen" component={SuccessGoalScreen} />
        <Stack.Screen name="SpendingReport" component={SpendingReport} />
        <Stack.Screen name="SpendingDate" component={SpendingDate} />
        <Stack.Screen name="SpendingCategory" component={SpendingCategory} />
        <Stack.Screen name="MissionDetail" component={MissionDetail} />
        <Stack.Screen name="SalaryDistribution" component={SalaryDistribution} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
