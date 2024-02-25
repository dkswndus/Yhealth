import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

const WeightView = ({ route }) => {
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

  const handleMorePress = () => {
    navigation.navigate('체중 등록');
    console.log(weightData);
  };

  const handleDelete = async (index) => {
    try {
      const updatedData = weightData.filter((item, idx) => idx !== index);
      await AsyncStorage.setItem('weightEntries', JSON.stringify(updatedData));
      setWeightData(updatedData);
    } catch (error) {
      console.error('데이터 삭제 중 오류 발생:', error);
      Alert.alert('삭제 오류', '체중을 삭제하는 중에 오류가 발생했습니다.');
    }
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>체중 기록</Text>
      </View>
      <ScrollView>
        {weightData.map((data, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.textRow2}>
              <Text style={styles.textTitle}>날짜:</Text>
              <Text style={styles.textcontent}> {data.date}</Text>
            </View>
            <View style={styles.textRow2}>
              <Text style={styles.textTitle}>체중:</Text>
              <Text style={styles.textcontent}> {data.weight}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleMorePress}>
        <Text style={styles.addButtonText}>기록 추가</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'rgba(0,0,0,0.90)',
    fontSize: 30,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
  titleContainer: {
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: 'black',
    justifyContent: 'space-between',
  },
  textRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textTitle: {
    color: 'rgba(0,0,0, 0.90)',
    fontSize: 17,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
  textcontent: {
    color: 'rgba(0,0,0, 0.70)',
    fontSize: 15,
    fontFamily: 'Noto Sans',
    fontWeight: '400',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#1A6DFF',
    padding: 10,
    borderRadius: 38,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default WeightView;