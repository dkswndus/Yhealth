import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text } from 'react-native';
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
import QRCodeScanner from './android/app/src/compponents/QRCodeScanner';
import WeightSetPage from './android/app/src/weight/Weightset';
import WeightView from './android/app/src/weight/WeightView';





const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const WritingScreen = ({ route }) => {
  console.log("WritingScreen");
  return <BoardPage route={route} />;
};

const ExerciseScreen = ({ route }) => {
  return < TimeLimit route={route} />;
 
};

const CalendarScreen = ({ route }) => {
  console.log("CalendarScreen");
  return <CalendarComponent route={route} />;
};

const HomeScreen = ({ route }) => {
  console.log("HomeScreen");
  return <MainPage route={route} />;
};

const TabNavigation = () => {
  return (
    <Tab.Navigator

      tabBarOptions={{
        style: { height: 70 },
        labelStyle: { fontSize: 14 },
      
      }}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
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
        component={ExerciseScreen}
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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={home}
              style={{ width: 30, height: 30, tintColor: focused ? '#1A6DFF' : 'gray' }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BoardPage"
        component={WritingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={writing}
              style={{ width: 30, height: 30, tintColor: focused ? '#1A6DFF' : 'gray' }}
            />
          ),
        }}
      />
    </Tab.Navigator>
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
          <Stack.Screen name="LookPage" component={LookPage} options={{ headerShown: false }} />
          <Stack.Screen name="체중 기록" component={WeightView} options={{ headerShown: true }} />
          <Stack.Screen name="체중 등록" component={WeightSetPage} options={{ headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>

  );
};

export default App;
