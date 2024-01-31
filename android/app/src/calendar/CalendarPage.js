import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import ExerciseRecord from './ExerciseRecord';
import ExerciseGraph from './ExerciseGraph';
import { TopBar1 } from '../compponents/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarComponent = ({ route }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [exerciseData, setExerciseData] = useState([]);

useEffect(() => {
  const loadDataFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('appData');
      console.log('저장된 데이터:', storedData);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('파싱된 데이터:', parsedData);

        setExerciseData((prevData) => [...prevData, parsedData]);
      }
    } catch (error) {
      console.error('AsyncStorage에서 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  // 컴포넌트가 마운트될 때 데이터 로드
  loadDataFromStorage();
}, []);


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
  exerciseData.forEach((data) => {
    markedDates[data.date] = { marked: true };
  });

  return (
    <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
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
          />
        </View>
        <View style={styles.Container}>
          <ExerciseGraph />
        </View>
        <View style={styles.Container}>
          <ExerciseRecord exerciseData={exerciseData} selectedDate={selectedDate} />
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
    marginLeft: 1,
    marginRight: 1,
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
