import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {

  generalGymbackExercisesData,
  generalGymbicepsExercisesData, generalGymchestExercisesData,
  generalGymlowerBodyExercisesData, generalGymshoulderExercisesData,
  generalGymtricepsExercisesData, martialArtsgymbackExercisesData,
  martialArtsgymbicepsExercisesData, martialArtsgymchestExercisesData,
  martialArtsgymlowerBodyExercisesData, martialArtsgymshoulderExercisesData,
  martialArtsgymtricepsExercisesData, generalGymData, martialArtsGymData
} from '../components/data';

import redheart from "../assets/image/redheart.png";
import emptyheart from "../assets/image/emptyheart.png";
import x from "../assets/image/x.png";
import { useRecoilState } from 'recoil';
import {
  selectedExercisesState,
  isTimeLimitOnState,
  remainingExercisesState,
  likedExercisesState,
  dropdownValueState,
} from './Recoil';

const FlatList = ({ route }) => {
  const navigation = useNavigation();
  const [currentData, setCurrentData] = useState([]);
  const [isTimeLimitOn, setIsTimeLimitOn] = useRecoilState(isTimeLimitOnState);
  const [likedExercises, setLikedExercises] = useRecoilState(likedExercisesState);
  const [selectedExercises, setSelectedExercises] = useRecoilState(selectedExercisesState);
  const [dropdownValue, setDropdownValue] = useRecoilState(dropdownValueState);


  const saveDataToStorage = async () => {
    try {
      const dataToSave = {
        likedExercises: likedExercises,
      };

      await AsyncStorage.setItem(`appData_${dropdownValue}`, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('오류', error);
    }
  };

  const loadDataFromStorage = async () => {
    try {
      const savedData = await AsyncStorage.getItem(`appData_${dropdownValue}`);
      if (savedData !== null) {
        const parsedData = JSON.parse(savedData);
        setLikedExercises(parsedData.likedExercises || []);
      }
    } catch (error) {
      console.error('오류:', error);
    }
  };


  // 화면이 나타날 때와 dropdownValue가 변경될 때 데이터 불러오기
  useEffect(() => {
    loadDataFromStorage();
  }, [dropdownValue]);

  // 상태가 변경될 때마다 데이터 저장
  useEffect(() => {
    saveDataToStorage();
  }, [likedExercises]);


  useEffect(() => {
    // 드롭다운 값에 따라 현재 데이터 설정
    switch (dropdownValue) {
      case '1':
        setCurrentData(generalGymData);
        break;
      case '2':
        setCurrentData(martialArtsGymData);
        break;
      default:
        setCurrentData([]);
    };

  }, [dropdownValue]);


  const showSelectedExercise = (category) => {
    switch (dropdownValue) {
      case '1':
        switch (category) {
          case '즐겨찾기':
            showLikedExercises();
            break;
          case '가슴':
            setCurrentData(generalGymchestExercisesData);
            break;
          case '등':
            setCurrentData(generalGymbackExercisesData);
            break;
          case '하체':
            setCurrentData(generalGymlowerBodyExercisesData);
            break;
          case '어께':
            setCurrentData(generalGymshoulderExercisesData);
            break;
          case '삼두':
            setCurrentData(generalGymtricepsExercisesData);
            break;
          case '이두':
            setCurrentData(generalGymbicepsExercisesData);
            break;

        }
        break;
      case '2':
        switch (category) {
          case '즐겨찾기':
            showLikedExercises();
            break;
          case '가슴':
            setCurrentData(martialArtsgymchestExercisesData);
            break;
          case '등':
            setCurrentData(martialArtsgymbackExercisesData);
            break;
          case '하체':
            setCurrentData(martialArtsgymlowerBodyExercisesData);
            break;
          case '어께':
            setCurrentData(martialArtsgymshoulderExercisesData);
            break;
          case '삼두':
            setCurrentData(martialArtsgymtricepsExercisesData);
            break;
          case '이두':
            setCurrentData(martialArtsgymbicepsExercisesData);
            break;
        }
        break;
      default:
        setCurrentData([]);
    }
  };

  const navigateTimeLimit = () => {
    if (isTimeLimitOn) {
      navigation.navigate('TimeLimit', {
      });
    }
    else {
      navigation.navigate('TimeLimit', {
      });
    }
  }

  const toggleLike = (exerciseTitle) => {
    setLikedExercises((prevLikedExercises) =>
      prevLikedExercises.includes(exerciseTitle)
        ? prevLikedExercises.filter((title) => title !== exerciseTitle)
        : [...prevLikedExercises, exerciseTitle]
    );
  };

  const showLikedExercises = () => {
    let allExercises = [];

    switch (dropdownValue) {
      case '1':
        allExercises = [
          ...generalGymData,
          ...generalGymchestExercisesData,
          ...generalGymbackExercisesData,
          ...generalGymlowerBodyExercisesData,
          ...generalGymshoulderExercisesData,
          ...generalGymtricepsExercisesData,
          ...generalGymbicepsExercisesData,

        ];
        break;
      case '2':
        allExercises = [
          ...martialArtsGymData,
          ...martialArtsgymchestExercisesData,
          ...martialArtsgymbackExercisesData,
          ...martialArtsgymlowerBodyExercisesData,
          ...martialArtsgymshoulderExercisesData,
          ...martialArtsgymtricepsExercisesData,
          ...martialArtsgymbicepsExercisesData,

        ];
        break;
      default:
        break;
    }

    // 중복 제거를 위해 Set을 활용하여 중복된 운동을 제거
    const uniqueExercises = [...new Set(allExercises.map((exercise) => exercise.title))].map((title) =>
      allExercises.find((exercise) => exercise.title === title)
    );

    // 모든 카테고리의 운동 중에서 좋아요를 누른 운동만 필터링
    const allLikedExercisesInCategories = uniqueExercises.filter((exercise) => likedExercises.includes(exercise.title));

    // 필터링된 데이터를 현재 데이터로 설정
    setCurrentData(allLikedExercisesInCategories);
  };







  const MAX_SELECTION = 10;

  const toggleSelection = (exerciseTitle) => {
    // 이미 선택된 운동인지 확인
    const isSelected = selectedExercises.includes(exerciseTitle);

    // 선택된 운동이면 제거, 아니면 추가
    if (isSelected) {
      // 이미 선택된 경우, 선택 해제 로직 수행
      setSelectedExercises((prevSelected) => prevSelected.filter((title) => title !== exerciseTitle));
    } else {
      // 선택되지 않은 경우, 선택 추가 전에 최대 선택 개수 확인
      if (selectedExercises.length < MAX_SELECTION) {
        // 최대 선택 개수에 도달하지 않은 경우에만 선택 추가
        setSelectedExercises((prevSelected) => [...prevSelected, exerciseTitle]);
      } else {
        // 이미 최대 선택 개수에 도달한 경우, 경고 표시
        Alert.alert('최대 선택 개수 초과', `${MAX_SELECTION}개까지 선택할 수 있습니다.`);
      }
    }
  };




  return (
    <View style={styles.container}>
      <View style={styles.addButtonContainer}>
        <Text style={styles.addButtonText}>운동 추가하기</Text>
        <TouchableOpacity onPress={navigateTimeLimit} >
          <Image source={x} style={styles.Ximage} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true} style={styles.horizontaaScrollView}>
        <View style={styles.exerciseContainer}>
          <TouchableOpacity onPress={() => showLikedExercises("즐겨찾기")}>
            <Part title={"즐겨찾기"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showSelectedExercise("가슴")}>
            <Part title={"가슴"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showSelectedExercise("등")}>
            <Part title={"등"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showSelectedExercise("하체")}>
            <Part title={"하체"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showSelectedExercise("어께")}>
            <Part title={"어께"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showSelectedExercise("삼두")}>
            <Part title={"삼두"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showSelectedExercise("이두")}>
            <Part title={"이두"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ScrollView style={styles.scrollView}>
        {currentData.map((exercise, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleSelection(exercise.title)}
            style={{
              backgroundColor: selectedExercises.includes(exercise.title) ? 'rgba(230, 230, 230, 0.5)' : 'rgba(252, 253, 255, 0.49)',
              paddingHorizontal: 20,
            }}>
            <View style={styles.GeneralGymData}>
              <Text>{exercise.title}</Text>
              <TouchableOpacity onPress={() => toggleLike(exercise.title)}>
                <Image
                  source={likedExercises.includes(exercise.title) ? redheart : emptyheart}
                  style={styles.Heartimage}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{paddingBottom:10}}>
        <AdditionDone title={"추가 완료"} onPress={navigateTimeLimit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Heartimage: {
    width: 25, height: 25
  },
  Ximage: {
    width: 20, height: 20, marginRight: 10
  },
  container: {
    height: '100%',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(252, 253, 255, 0.49)',
    borderRadius: 30,
  },
  scrollView: {
    marginTop: 25,
    flexDirection: 'column',
  },
  GeneralGymData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#bbb',
    borderBottomWidth: 0.5,
    height: 50,
  },
  todoText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.9)',
    marginTop: -5,
    marginLeft: 100,
  },

  horizontaaScrollView: {
    marginTop: 20,
    flexDirection: 'row',
    height: 50,


  },
  exerciseContainer: {
    flexDirection: 'row',
  },
});

const AdditionDoneContainer = styled(TouchableOpacity)`
width: 100%;
  height: 42px;
  background-color: #1A6DFF;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  
`;

const AdditionDoneTitle = styled(Text)`
  font-size: 27px;
  font-weight: bold;
  color: #FFFFFF;
`;

const PartContainer = styled(View)`
  width: 100px;
  height: 35px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  border: 2px solid #6FA1FF;
`;

const PartTitle = styled(Text)`
  font-size: 20px;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.9);
`;

export const Part = (props) => {
  return (
    <PartContainer onPress={props.onPress}>
      <PartTitle>{props.title}</PartTitle>
    </PartContainer>
  );
};

export const AdditionDone = (props) => {
  return (
    <AdditionDoneContainer onPress={props.onPress}>
      <AdditionDoneTitle>{props.title}</AdditionDoneTitle>
    </AdditionDoneContainer>
  );
};

export default FlatList;