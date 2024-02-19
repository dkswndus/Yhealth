import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExerciseRecord = ({ exerciseDataOff,exerciseDataOn ,selectedDate }) => {
  
  // 선택된 날짜를 기반으로 운동 데이터 필터링
  const filteredExerciseDataOff = exerciseDataOff.filter(
    (data) => data.date === selectedDate
  );
  const filteredExerciseDataOn = exerciseDataOn.filter(
    (data) => data.date === selectedDate
  );
  const combinedData = [...filteredExerciseDataOn, ...filteredExerciseDataOff];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>운동 기록</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>운동 이름</Text>
          <Text style={styles.cell}>운동 시간</Text>
          <Text style={styles.cell}>세트</Text>
          <Text style={styles.cell}>횟수</Text>
        </View>
        {combinedData.map((data, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{data.name}</Text>
            <Text style={styles.cell}>{data.time}</Text>
            <Text style={styles.cell}>{data.sets}</Text>
            <Text style={styles.cell}>{data.reps}</Text>
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