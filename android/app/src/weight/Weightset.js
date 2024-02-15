import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

const WeightSetPage = ({ route }) => {
  const navigation = useNavigation();
  const [weightData, setWeightData] = useState('');
  const [dateData, setDateData] = useState(new Date().toISOString().slice(0, 10)); // 오늘 날짜로 초기화

  const handleWeightChange = (inputWeight) => {
    setWeightData(inputWeight);
  }

  const handleDateChange = (inputDate) => {
    setDateData(inputDate);                                                                                                                      
  }


  
  //const , let차이점 
  //const: 재할당 x
  //let: 재할당 o
  const saveWeightData = async () => {
    try {
      const weightEntry = {
        weight: weightData,
        date: dateData
      };
    
    

      // 이전에 저장된 데이터 가져오기
      let storedData = await AsyncStorage.getItem('weightEntries');
      storedData = storedData ? JSON.parse(storedData) : [];
  
      // 동일한 날짜의 데이터가 이미 있는지 확인
      const existingDataIndex = storedData.findIndex(entry => entry.date === dateData);
  
      if (existingDataIndex !== -1) {
        // 동일한 날짜의 데이터가 있으면 최신 데이터로 업데이트
        storedData[existingDataIndex] = weightEntry;
      } else {
        // 동일한 날짜의 데이터가 없으면 새로운 데이터 추가
        storedData.push(weightEntry);
      }
  
      // 업데이트된 데이터 저장
      await AsyncStorage.setItem('weightEntries', JSON.stringify(storedData));
  
      navigation.goBack();
    } catch (error) {
      console.error('체중 데이터 저장 중 오류 발생:', error);
    }
  }
  
  

  return (
    <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center' }}>
      <View style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}>
        <Text style={styles.title}>체중 등록</Text>
      </View>
      <View style={{ alignSelf: 'center', width: '80%' }}>
        <View style={{ width: '100%' }}>
          <Text style={styles.title1}>날짜</Text>
          <TextInput
            style={styles.inputcontainer}
            onChangeText={handleDateChange}
            value={dateData}
            placeholder="날짜를 입력하세요"
            placeholderTextColor="gray"
            editable={false} // 수정 불가능하게 설정
          />
          <Text style={styles.title1}>체중</Text>
          <TextInput
            style={styles.inputcontainer}
            onChangeText={handleWeightChange}
            value={weightData}
            placeholder="체중을 입력하세요"
            placeholderTextColor="gray"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={saveWeightData}>
          <Text style={styles.addButtonText}>체중 설정</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'rgba(0,0,0,0.90)',
    fontSize: 35,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
  title1: {
    color: 'rgba(0,0,0,0.90)',
    fontSize: 25,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
  inputcontainer: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    color: 'black',
    width: '100%',
  },
  addButton: {
    alignSelf: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 38,
    width: '80%',
    marginTop: 'auto',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
})

export default WeightSetPage;