// Board.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // axios 추가
import API_URL from '../writing/URl';
const Board = () => {
  const navigation = useNavigation();
  const [limitedBoardData, setLimitedBoardData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // AsyncStorage에서 데이터를 가져와서 state 업데이트
    fetchBoardData();
  }, []); // []를 전달하여 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 설정

  const fetchBoardData = async () => {
    try {
      // 백엔드에서 게시글 데이터를 가져오는 요청
      setLoading(true);
      const response = await axios.get(API_URL+'/forum/', {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      // 가져온 데이터를 state에 저장
      //setLimitedBoardData(sortedData);
      setLimitedBoardData(sortedData.slice(0, 5)); // 최신 5개의 글만 가져오도록 수정
      setLoading(false); // 데이터 가져오기 완료 후 로딩 상태 변경
    } catch (error) {
      console.error('데이터 불러오기 중 오류 발생:', error);
      setLoading(false); // 데이터 가져오기 실패 시 로딩 상태 변경
    }
  };
  const formatDateString = (dateString) => {
    // 날짜 문자열에서 요일 부분 제거
    const dateWithoutDay = new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
    return dateWithoutDay;
  };

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
            {item.title.length > 10 ? `${item.title.substring(0, 10)}...` : item.title}
            </Text>
            <Text style={styles.itemText}>{formatDateString(item.created_at)}</Text>
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