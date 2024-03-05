import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, View } from 'react-native';
import { RecoilRoot } from 'recoil';
import exercise from './android/app/src/assets/image/exercise.png';
import home from './android/app/src/assets/image/home.png';
import calendar from './android/app/src/assets/image/calendar.png';
import writing from './android/app/src/assets/image/writing.png';
import FlatList from './android/app/src/tabata/FlatList';
import Writepage from './android/app/src/writing/Writepage';
import StopWatch from './android/app/src/tabata/StopWatch';
import NonstopWatch from './android/app/src/tabata/NonstopWatch';
import BoardPage from './android/app/src/writing/BoardPage';
import MainPage from './android/app/src/home/MainPage';
import LookPage from './android/app/src/writing/LookPage';
import CalendarComponent from './android/app/src/calendar/CalendarPage';
import TimeLimit from './android/app/src/tabata/TimeLimit';
import QRCodeScanner from './android/app/src/components/QRCodeScanner';
import WeightSetPage from './android/app/src/weight/Weightset';
import WeightView from './android/app/src/weight/WeightView';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const WritingScreen = ({ route }) => {
  return <BoardPage route={route} />;
};

const TimeLimitScreen = ({ route }) => {
  return < TimeLimit route={route} />;

};

const CalendarScreen = ({ route }) => {
  return <CalendarComponent route={route} />;
};

const HomeScreen = ({ route }) => {
  return <MainPage route={route} />;
};

const TabNavigation = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-200} // 키보드가 나타날 때 UI를 위로 200만큼 올립니다.
      style={{ flex: 1 }}
    >
      <Tab.Navigator

        tabBarOptions={{
          style: { height: 70, borderTopColor: ' rgba(0,0,0,0.2)', borderTopWidth: 1 },
          labelStyle: { fontSize: 14 },

        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            unmountOnBlur: true,
            tabBarIcon: ({ focused }) => (
              <Image
                source={home}
                style={{ width: 30, height: 30, tintColor: focused ? '#1A6DFF' : 'gray' }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            unmountOnBlur: true,
            tabBarIcon: ({ focused }) => (
              <Image
                source={calendar}
                style={{ width: 30, height: 30, tintColor: focused ? '#1A6DFF' : 'gray' }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="TimeLimit"
          component={TimeLimitScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={exercise}
                style={{ width: 35, height: 35, tintColor: focused ? '#1A6DFF' : 'gray' }}
              />
            ),

          }}
        />

        <Tab.Screen
          name="BoardPage"
          component={WritingScreen}
          options={{
            unmountOnBlur: true,
            tabBarIcon: ({ focused }) => (
              <Image
                source={writing}
                style={{ width: 30, height: 30, tintColor: focused ? '#1A6DFF' : 'gray' }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
};
//탭네비게이션에 있는 애들은 스택네비에 있으면 안됨
const App = () => {
  return (
    <RecoilRoot>
      <NavigationContainer>

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigation} />
          <Stack.Screen name="FlatList" component={FlatList} options={{ headerShown: false }} />
          <Stack.Screen name="StopWatch" component={StopWatch} options={{ headerShown: true }} />
          <Stack.Screen name="NonstopWatch" component={NonstopWatch} options={{ headerShown: true }} />
          <Stack.Screen name="Writepage" component={Writepage} options={{ headerShown: false }} />
          <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} options={{ headerShown: true }} />
          <Stack.Screen name="LookPage" component={LookPage} options={{ headerShown: true }} />
          <Stack.Screen name="체중 기록" component={WeightView} options={{ headerShown: true, headerTitle: ({ children }) => (<View></View>), }} />
          <Stack.Screen name="체중 등록" component={WeightSetPage} options={{ headerShown: true, headerTitle: ({ children }) => (<View></View>), }} />
        </Stack.Navigator>

      </NavigationContainer>
    </RecoilRoot>

  );
};

export default App;