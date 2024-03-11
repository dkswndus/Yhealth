import React, { useState, useEffect } from 'react';
import { StatusBar, View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const previousbutton = require("../assets/image/previousbutton.png");
const nextbutton = require("../assets/image/nextbutton.png");

const CompleteContainer = styled.TouchableOpacity`
  border: 1px solid black;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  margin-top: -4px;
  background-color: ${({ completed }) => (completed ? 'black' : 'transparent')};
`;

const ImageContainer = styled.View`

`;
const CompleteText = styled.Text`
  color: ${({ completed }) => (completed ? 'white' : 'black')};
`;

const ExerciseInformation = styled.View`
  margin-top: 200px;
  margin-bottom: -150px;
  justify-content: center;
  align-items: center;
  padding-bottom: 5px;
`;

const NonstopWatch = ({ route }) => {
  const navigation = useNavigation();
  const exerciseInfoOff = route.params?.exerciseInfoOff || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completionStatus, setCompletionStatus] = useState(Array(exerciseInfoOff.length).fill(false));

  const length = exerciseInfoOff.length;

  useEffect(() => {
    const saveDataToStorage = async (data, key) => {
      try {
        if (completionStatus.every(status => status === true)) {
          Alert.alert('종료', '운동이 완료되었습니다.');
          navigation.goBack();
          // 한 번만 저장하기 위해 조건 추가
          if (exerciseInfoOff.length > 0) {
            // 이전 데이터 불러오기
            const existingData = await AsyncStorage.getItem(`appData${key}`);
            const parsedExistingData = existingData ? JSON.parse(existingData) : [];

            // exerciseInfoOff를 기반으로 transformedData 생성
            const transformedData = exerciseInfoOff.map(item => {
              const { name, reps, sets, time } = item;
              const currentDate = new Date();
              const formattedDate = currentDate.toISOString().split('T')[0];

              return {
                name: name,
                date: formattedDate,
                sets: sets,
                reps: reps,
                time: time,
              };
            });

            // 일주일 이전의 날짜 계산
            const currentDate = new Date();
            const oneWeekAgo = new Date(currentDate);
            oneWeekAgo.setDate(currentDate.getDate() - 7);

            // 이전 데이터 중 일주일 이전의 데이터 제거
            const filteredExistingData = parsedExistingData.filter(item => {
              const itemDate = new Date(item.date);
              return itemDate > oneWeekAgo;
            });

            // 이전 데이터와 새로운 데이터 합치기
            const combinedData = [...filteredExistingData, ...transformedData];
            // 데이터 저장
            await AsyncStorage.setItem(`appData${key}`, JSON.stringify(combinedData));
          }
        }

      } catch (error) {
        console.error('오류', error);
      }
    };

    saveDataToStorage([], 'Off'); // 초기 실행 시 빈 배열을 전달
  }, [completionStatus]); // completionStatus만 종속성으로 설정










  const handleCompletion = () => {
    const updatedStatus = [...completionStatus];
    updatedStatus[currentIndex] = !completionStatus[currentIndex];
    setCompletionStatus(updatedStatus);
  };

  const selectedExercises = exerciseInfoOff.slice(currentIndex, currentIndex + 2);

  const handleNext = () => {
    if (currentIndex < exerciseInfoOff.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    else {
      Alert.alert('경고', '모든 운동이 완료되지않았습니다.\n완료버튼을 눌러주세요.');

    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };





  return (
    <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 }}>
      <View style={{ flex: 1 }}>
        {selectedExercises.map((exerciseInfoOff, index) => (
          <View key={index}>
            <ExerciseInformation>
              <Text style={index === 0 ? styles.currentbigText : styles.currentmediumText}>
                {currentIndex + index + 1}/{length}
              </Text>
              <Text style={index === 0 ? styles.currentbigText : styles.currentmediumText}>
                {exerciseInfoOff.name}
              </Text>
              <Text style={index === 0 ? styles.currentbigText : styles.currentmediumText}>
                {exerciseInfoOff.sets} x {exerciseInfoOff.reps}
              </Text>
            </ExerciseInformation>
          </View>
        ))}
      </View>

      <View style={{ alignSelf: 'center', flexDirection: 'row', flex: 1, paddingTop: 350 }}>
        <ImageContainer>
          <TouchableOpacity onPress={handlePrevious}>
            <Image source={previousbutton} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </ImageContainer>
        <View style={{ marginLeft: 80, marginRight: 80 }}>
          <CompleteContainer completed={completionStatus[currentIndex]} onPress={handleCompletion}>
            <CompleteText completed={completionStatus[currentIndex]}>완료</CompleteText>
          </CompleteContainer>
        </View>
        <ImageContainer>
          <TouchableOpacity onPress={handleNext}>
            <Image source={nextbutton} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </ImageContainer>
      </View>

      <StatusBar backgroundColor="black" />
    </View>
  );
};

const styles = {
  currentmediumText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: 'black',
  },
  currentbigText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
  },
};

export default NonstopWatch;