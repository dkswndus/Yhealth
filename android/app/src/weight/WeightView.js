import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const WeightView = ({ route }) => {
  const navigation = useNavigation();
  const [weightData, setWeightData] = useState([]);

 

  const handleMorePress = () => {
    navigation.navigate('체중 등록');
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>체중 기록</Text>
      </View>
      <ScrollView>
        {weightData.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.textRow2}>
              <Text style={styles.textTitle}>날짜:</Text>
              <Text style={styles.textcontent}>{item.date}</Text>
            </View>
            <View style={styles.textRow2}>
              <Text style={styles.textTitle}>체중:</Text>
              <Text style={styles.textcontent}>{item.weight}</Text>
            </View>
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
    flexDirection: 'row', // 가로로 배치
    padding: 5,
    borderBottomWidth: 1,
    borderColor: 'black',

  },
  textRow: {
    flexDirection: 'row',
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
  textcontent2: {
    color: '#767676',
    fontSize: 15,
    fontFamily: 'Noto Sans',
    fontWeight: '400',
  },
  textcontent3: {
    color: 'rgba(0,0,0, 0.50)',
    fontSize: 15,
    fontFamily: 'Noto Sans',
    fontWeight: '900',
  },
  addButton: {
    position: 'absolute',
    bottom: 20, // 조절 가능한 값으로 변경
    alignSelf: 'center', // 가운데 정렬
    backgroundColor: 'blue', // 적절한 배경색 설정
    padding: 10,
    borderRadius: 38,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
})

export default WeightView;