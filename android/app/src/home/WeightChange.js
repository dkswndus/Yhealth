import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width - 8;
const Weight = () => {
  const navigation = useNavigation();
  const [weightData, setWeightData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('weightEntries');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setWeightData(parsedData);
        console.log('체중 데이터:', parsedData);
      }
    } catch (error) {
      console.error('데이터 불러오기 중 오류 발생:', error);
    }
  };
  // const weightData = [
  //   { date: '월', weight: 12 },
  //   { date: '화', weight: 30 },
  //   { date: '수', weight: 30 },
  //   { date: '목', weight: 60 },
  //   { date: '금', weight: 30 },
  //   { date: '화', weight: 18 },
  //   { date: '화', weight: 15 },
  // ]
  const limitedweightData = weightData.slice(-7);
  const data = {
    labels: limitedweightData.map((dataPoint) => dataPoint.date),
    datasets: [
      {
        data: limitedweightData.map((dataPoint) => dataPoint.weight),
      },
    ],
  };
  const handleMorePress = () => {
    navigation.navigate('체중 기록');
  };
  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={styles.title}>체중 변화</Text>
        <TouchableOpacity onPress={handleMorePress}>
          <Text style={{ paddingRight: 20, color: '#FF0000', fontSize: 16, fontFamily: 'Noto Sans', fontWeight: '400' }}>
            더보기 {'>'}
          </Text>
        </TouchableOpacity>
      </View>
      {weightData.length > 1 ? (
        <LineChart
          data={data}
          width={screenWidth}
          height={200}
          fromZero={true}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2, // 소수점 자리수
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 선 색상 설정
            style: {
              borderRadius: 16,
            },
          }}
          bezier={false}
          style={{ borderRadius: 16, alignSelf: 'center' }}
        />
      ) : (
        <Text style={{color:'black',fontSize:20}}>체중을 2개 이상 입력하세요</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
    marginBottom: 10,
  },
  boardItem: {
    flexDirection: 'row', // 가로로 배치
    justifyContent: 'space-between', // 각 항목 사이의 공간을 균등하게 배치
    alignItems: 'center', // 수직 정렬을 가운데로
    padding: 5,
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  itemText: {
    marginRight: 10,
    color: 'black',
  },

});

export default Weight;