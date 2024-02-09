import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import ExerciseRecord from './ExerciseRecord';
import ExerciseGraph from './ExerciseGraph';
import { TopBar1 } from '../components/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarComponent = ({ route }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [exerciseData, setExerciseData] = useState([]);




  const loadSavedData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('appDataOn');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('파싱된 데이터:', parsedData); 
        setExerciseData(parsedData);

      }
    } catch (error) {
      console.error('데이터 불러오기 오류', error);
    }
  };


  useEffect(() => {
   
    loadSavedData();
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

       <View style={{ backgroundColor: 'white', flex: 1 }}>
        <TopBar1 />
        <ScrollView >
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
        </ScrollView>
         </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1,
    marginLeft: 3,
    marginRight: 3,
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