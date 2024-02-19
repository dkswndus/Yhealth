// CalendarComponent.js

import React, { useState,useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

import ExerciseRecord from './ExerciseRecord';
import ExerciseGraph from './ExerciseGraph';
import { TopBar1 } from '../components/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CalendarComponent = ({ route }) => {

  const [selectedDate, setSelectedDate] = useState('');
  const [exerciseDataOn, setExerciseDataOn] = useState([]);
  const [exerciseDataOff, setExerciseDataOff] = useState([]);

  const loadSavedData = async (key, setter) => {
    try {
      const storedData = await AsyncStorage.getItem(`appData${key}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        //console.log(` ${key} 데이터:`, parsedData);
        setter(parsedData);
      }
    } catch (error) {
      console.error('데이터 불러오기 오류', error);
    }
  };

  useEffect(() => {
    loadSavedData('On', setExerciseDataOn);
    loadSavedData('Off', setExerciseDataOff);
  }, [selectedDate]);










  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };
  const renderHeader = (date) => {
    const month = date.toString('M월');
    return (
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 25 }}>{month}</Text>
      </View>
    );
  };
  const markedDates = {};
  exerciseDataOn.forEach((data) => {
    markedDates[data.date] = { marked: true };
  });


  exerciseDataOff.forEach((data) => {
    markedDates[data.date] = { marked: true };
  
    
  });


  return (
    <ScrollView style={{ backgroundColor: 'white', flex: 1 }} >

      <View>
        <TopBar1 />
        <View style={styles.Container}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, selectedColor: 'blue' },
            }}
            renderHeader={renderHeader}
            style={{ borderRadius: 30, padding: 12 }}
          /></View>
        <View style={styles.Container}>
          <ExerciseGraph />
        </View>
        <View style={styles.Container}>
          <ExerciseRecord  exerciseDataOn={exerciseDataOn}
            exerciseDataOff={exerciseDataOff} selectedDate={selectedDate} />
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  Container: {
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
    marginTop: 8,
  },
  chartContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
export default CalendarComponent;