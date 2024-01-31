// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Image } from 'react-native';
// import exercise from '../assets/image/exercise.png';
// import home from '../assets/image/home.png';
// import calendar from '../assets/image/calendar.png';
// import writing from '../assets/image/writing.png';
// import { createStackNavigator } from '@react-navigation/stack';

// import BoardPage from '../writing/BoardPage';
// import MainPage from '../home/MainPage';
// import CalendarComponent from '../calendar/CalendarPage';
// import TimeLimitON from '../tabata/TimeLimitON';
// import TimeLimitOFF from '../tabata/TimeLimitOFF';

// const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();

// const WritingScreen = ({ route }) => {
//   return <BoardPage route={route} />;
// };

// const ExerciseScreen = ({ route }) => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="TimeLimitON"
//         component={TimeLimitON}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="TimeLimitOFF"
//         component={TimeLimitOFF}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// };

// const CalendarScreen = ({ route }) => {
//   return <CalendarComponent route={route} />;
// };

// const HomeScreen = ({ route }) => {
//   return <MainPage route={route} />;
// };

// const TabNavigation = () => {
//   return (
//     <Tab.Navigator
//       tabBarOptions={{
//         style: { height: 70 },
//         labelStyle: { fontSize: 14 },
//       }}
//     >
//       <Tab.Screen
//         name="Calendar"
//         component={CalendarScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={calendar}
//               style={{ width: 30, height: 30, tintColor: focused ? '#1A6DFF' : 'gray' }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Exercise"
//         component={ExerciseScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={exercise}
//               style={{ width: 35, height: 35, tintColor: focused ? '#1A6DFF' : 'gray' }}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={home}
//               style={{ width: 30, height: 30, tintColor: focused ? '#1A6DFF' : 'gray' }}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="Writing"
//         component={WritingScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={writing}
//               style={{ width: 30, height: 30, tintColor: focused ? '#1A6DFF' : 'gray' }}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default TabNavigation;
