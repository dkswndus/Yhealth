import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 16;

const exerciseData = [
  { day: '월', time: 20 },
  { day: '화', time: 11 },
  { day: '수', time: 80 },
  { day: '목', time: 35 },
  { day: '금', time: 20 },
  { day: '토', time: 46 },
  { day: '일', time: 12 },
];

const limitedexerciseData = exerciseData.slice(-7);

const data = {
  labels: limitedexerciseData.map((dataPoint) => dataPoint.day),
  datasets: [
    {
      data: limitedexerciseData.map((dataPoint) => dataPoint.time),
    },
  ],
};

const ExerciseGraph = () => {

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
          backgroundColor: 'white', // 배경색을 흰색으로 설정
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 0,
          barPercentage: 1.3,
          color: (opacity = 1.0) => `rgba(0, 0, 255, ${opacity})`, // 파란색으로 설정
        }}
        style={{
          marginVertical: 2,
          borderRadius: 16,
          paddingRight: 40,
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