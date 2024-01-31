// Board.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Board = () => {
  const navigation = useNavigation();
  const [limitedBoardData, setLimitedBoardData] = useState([]);

  useEffect(() => {
    // AsyncStorage에서 데이터를 가져와서 state 업데이트
    const fetchBoardData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('posts');
        const parsedData = storedData ? JSON.parse(storedData) : [];
        // 최신 데이터부터 가져오기 위해 reverse()
        setLimitedBoardData(parsedData.reverse().slice(0, 5)); // 최신 5개의 글만 가져오도록 수정
      } catch (error) {
        console.error('게시판 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchBoardData();
  }, []); // []를 전달하여 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 설정

  const handleMorePress = () => {
    navigation.navigate('BoardPage');
  };

  const handleItemPress = (item) => {
    navigation.navigate('LookPage', { selectedItem: item });
  };

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={styles.title}>게시판</Text>
        <TouchableOpacity onPress={handleMorePress}>
          <Text style={{ paddingRight: 20, color: '#FF0000', fontSize: 16, fontFamily: 'Noto Sans', fontWeight: '400' }}>
            더보기 {'>'}
          </Text>
        </TouchableOpacity>
      </View>

      {limitedBoardData.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handleItemPress(item)}>
          <View key={index} style={styles.boardItem}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>
              {item.title}
            </Text>
            <Text style={styles.itemText}>{item.time}</Text>
          </View>
        </TouchableOpacity>
      ))}
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

export default Board;