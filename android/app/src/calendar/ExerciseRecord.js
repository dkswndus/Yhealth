import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExerciseRecord = ({  }) => {
  const [exerciseData, setExerciseData] = useState([]);


// 저장된 데이터 불러오기
const loadSavedData = async () => {
  try {
    const storedData = await AsyncStorage.getItem('appData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log('파싱된 sdfsf데이터:', parsedData); // parsedData 확인을 위해 이 줄을 추가
      setExerciseData(parsedData);

    }
  } catch (error) {
    console.error('데이터 불러오기 오류', error);
  }
};


  useEffect(() => {
    // 저장된 데이터 불러오기
    loadSavedData();
  }, []);

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

   
        {exerciseData.map((exercise, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.cell}>{exercise.date}</Text>
            <Text style={styles.cell}>{exercise.name}</Text>
            <Text style={styles.cell}>{exercise.reps}</Text>
            <Text style={styles.cell}>{exercise.sets}</Text>
            <Text style={styles.cell}>{exercise.time}</Text>
          </View>
        ))}
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