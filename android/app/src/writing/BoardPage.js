import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TopBar1 } from '../compponents/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BoardPage = ({ route }) => {
  const navigation = useNavigation();
  const [boardData, setBoardData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const thumbsup = require("../assets/image/thumbsup.png");
  const messages = require("../assets/image/messages.png");
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('posts');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setBoardData(parsedData);
      }
    } catch (error) {
      console.error('데이터 불러오기 중 오류 발생:', error);
    }
  };

  const handleItemPress = (item) => {
    navigation.navigate('LookPage', { selectedItem: item });
  };

  const handleMorePress = () => {
    navigation.navigate('Writepage');
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const formatDateString = (dateString) => {
    // 날짜 문자열에서 요일 부분 제거
    const dateWithoutDay = new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
    return dateWithoutDay;
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <TopBar1 />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>게시판</Text>
          </View>
          <View style={{ paddingLeft: 5, paddingRight: 5 }}>
            {boardData.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleItemPress(item)}>
                <View key={index}>
                  <View>
                    <Text style={styles.textTitle}>{item.title}</Text>
                    <Text
                      style={styles.textcontent}
                      numberOfLines={1}
                      ellipsizeMode="tail">{item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text}</Text>
                    <View style={styles.textRow2}>
                      <View style={styles.textRow}>
                        <Text style={styles.textcontent2}>{item.nickname}</Text>
                        <Text style={styles.textcontent2}> | </Text>
                        <Text style={styles.textcontent2}>{formatDateString(item.time)}</Text>
                      </View>
                      <View style={styles.textRow}>
                        <View style={{ flexDirection: 'row' }}>
                          <Image source={thumbsup} style={{ width: 25, height: 25, marginRight: 15 }} />
                          <Text style={styles.textcontent3}>{item.like}</Text>
                        </View>

                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleMorePress}>
        <Text style={styles.addButtonText}>글 작성하기</Text>
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
    paddingRight: 2,
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

export default BoardPage;