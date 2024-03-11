import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, RefreshControl, Image, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TopBar1 } from '../components/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios'; // axios 추가
import API_URL from './URl';

const BoardPage = ({ route }) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [boardData, setBoardData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const thumbsup = require("../assets/image/thumbsup.png");
  const messages = require("../assets/image/messages.png");

  useFocusEffect(
    React.useCallback(() => {
      fetchData(); // 화면이 focus되면 fetchData 함수 호출
    }, [])
  );
  const formatDateString = (dateString) => {
    // 날짜 문자열에서 요일 부분 제거
    const dateWithoutDay = new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
    const [month, day, year] = dateWithoutDay.split('/');
    return `${year}/${month}/${day}`;
  };

  const fetchData = async () => {
    try {
      // 백엔드에서 게시글 데이터를 가져오는 요청
      setLoading(true);
      const response = await axios.get(API_URL + '/forum/', {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      // 가져온 데이터를 state에 저장
      setBoardData(sortedData);

      setLoading(false); // 데이터 가져오기 완료 후 로딩 상태 변경
    } catch (error) {
      console.error('데이터 불러오기 중 오류 발생:', error);
      setLoading(false); // 데이터 가져오기 실패 시 로딩 상태 변경
    }
  };

  const handleItemPress = (item) => {
    navigation.navigate('LookPage', { selectedItem: item });
  };

  const handleMorePress = () => {
    navigation.navigate('Writepage');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
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
          {loading ? (
            <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
          ) : (
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              {boardData.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleItemPress(item)}>
                  <View key={index} style={{ paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.2)' }}>
                    <View>
                      <Text numberOfLines={1} style={styles.textTitle}>{item.title.length > 20 ? `${item.title.substring(0, 10)}...` : item.title}</Text>
                      <View style={styles.textRow2}>
                        <Text numberOfLines={2} style={styles.textcontent}>{item.description}</Text>
                        <View style={styles.textRow}>

                          <Text style={styles.textcontent2}>{formatDateString(item.created_at)}</Text>
                          <Text style={styles.textcontent2}> | </Text>
                          <Text style={styles.textcontent2}>{item.user_id}</Text>

                        </View>
                        {/* <View style={styles.textRow}>
                          <Image source={thumbsup} style={{ width: 25, height: 25, marginRight: 15 }} />
                          <Text style={styles.textcontent3}>{item.like}</Text>
                        </View> */}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleMorePress}>
        <Text style={styles.addButtonText}>+</Text>
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
  },
  textRow: {
    flexDirection: 'row',
  },
  textRow2: {

    justifyContent: 'space-between',
  },
  textTitle: {
    color: 'rgba(0,0,0, 0.90)',
    fontSize: 17,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
  textcontent: {
    color: 'rgba(0,0,0, 1)',
    fontSize: 15,
    fontFamily: 'Noto Sans',
    fontWeight: '400',
  },
  textcontent2: {
    color: 'rgba(0,0,0, 0.50)',
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
    right: 20,
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#1A6DFF',
    padding: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default BoardPage;