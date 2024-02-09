import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenWidth = Dimensions.get('window').width / 1.2;

const ExerciseGraph = () => {
  const [exerciseData, setExerciseData] = useState({ date: '', totalTime: 0 });

  const loadSavedData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('appDataOn');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('운동시간그래프 데이터:', parsedData);
        // date와 time만 추출
        const formattedDate = parsedData[0].date.substring(5, 10); // 첫 번째 날짜만 저장 ///// 2024-02-06에서 02-06 을 추출  >>>>>>>>>>암기 
        const totalTime = parsedData.reduce((total, item) => total + parseInt(item.time), 0); // 모든 시간을 합침

        // 날짜와 시간을 출력
       console.log('날짜:', formattedDate);
       console.log('총 시간:', totalTime);

        // 날짜와 시간만을 상태에 저장
        setExerciseData({ date: formattedDate, totalTime });
      }
    } catch (error) {
      console.error('데이터 불러오기 오류', error);
    }
  };

  useEffect(() => {
 
    loadSavedData();
  }, []);

  const data = {
    labels: [exerciseData.date],
    datasets: [
      {
        data: [exerciseData.totalTime],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>운동시간 그래프</Text>
      <BarChart
        data={data}
        width={screenWidth}
        height={200}
        yAxisSuffix="분"
        fromZero={true}
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 0,
          barPercentage: 0.8,
          color: (opacity = 1.0) => `rgba(0, 0, 255, ${opacity})`,
        }}
        style={{
          marginVertical: 2,
          borderRadius: 16,
          paddingRight: 50,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
  container: {
    padding: 10,
  },
});

export default ExerciseGraph;