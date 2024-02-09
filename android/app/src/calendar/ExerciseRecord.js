import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExerciseRecord = ({ selectedDate }) => {
  const [exerciseDataOn, setExerciseDataOn] = useState([]);
  const [exerciseDataOff, setExerciseDataOff] = useState([]);

  const loadSavedData = async (key, setter) => {
    try {
      const storedData = await AsyncStorage.getItem(`appData${key}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log(` ${key} 데이터:`, parsedData);
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

  const renderExerciseData = (filteredData) => {
    return filteredData.map((exercise, index) => (
      <View style={styles.row} key={index}>
        <Text style={styles.cell}>{exercise.date}</Text>
        <Text style={styles.cell}>{exercise.name}</Text>
        <Text style={styles.cell}>{exercise.reps}</Text>
        <Text style={styles.cell}>{exercise.sets}</Text>
        <Text style={styles.cell}>{exercise.time}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>운동 기록</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>날짜</Text>
          <Text style={styles.cell}>운동이름</Text>
          <Text style={styles.cell}>횟수</Text>
          <Text style={styles.cell}>세트</Text>
          <Text style={styles.cell}>시간</Text>
        </View>

        {/* 'On' 데이터 표시 */}
        {renderExerciseData(exerciseDataOn)}

        {/* 'Off' 데이터 표시 */}
        {renderExerciseData(exerciseDataOff)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
  table: {
    flexDirection: 'column',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
  },
});

export default ExerciseRecord;