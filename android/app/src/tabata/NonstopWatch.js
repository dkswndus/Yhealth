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

const PlayerControl = styled.View`
  position: absolute;
  top: 450px;
  left: -30px;
  padding-top: 30px;
  padding-left: 90px;
  flex-direction: row;
`;

const ImageContainer = styled.View`
  margin-right: 90px;
`;

const NonstopWatch = ({ route }) => {
  const navigation = useNavigation();
  const exerciseInfoOff = route.params?.exerciseInfoOff || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completionStatus, setCompletionStatus] = useState(Array(exerciseInfoOff.length).fill(false));
  const [reps, setReps] = useState(exerciseInfoOff.length > 0 ? exerciseInfoOff[0].reps : 0);
  const [sets, setSets] = useState(exerciseInfoOff.length > 0 ? exerciseInfoOff[0].sets : 0);
  const [name, setName] = useState(exerciseInfoOff.length > 0 ? exerciseInfoOff[0].name : 0);


  const exerciseOrder = exerciseInfoOff.length > 0 ? exerciseInfoOff[0].exerciseOrder : '';


  useEffect(() => {
    console.log('exerciseInfoOff 정보:', exerciseInfoOff);
  }, [exerciseInfoOff]);
  
  useEffect(() => {
    const saveDataToStorage = async (data) => {
      try {
        await AsyncStorage.setItem('appData', JSON.stringify(data));
      } catch (error) {
        console.error('오류', error);
      }
    };
  
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
  
    // transformedData를 이용하여 저장
    saveDataToStorage(transformedData);
  
    if (completionStatus.every((status) => status === true)) {
      Alert.alert('종료', '운동이 완료되었습니다.');
      navigation.goBack();
      console.log('저장된 dsf데이터:', {
        transformedData
      });
    }
  }, [completionStatus, exerciseInfoOff]);
  
  



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
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };





  return (
    <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 }}>
   {selectedExercises.map((exerciseInfoOff, index) => (
  <View key={index}>
    <ExerciseInformation>
      <Text style={index === 0 ? styles.currentbigText : styles.currentmediumText}>
        {currentIndex + index + 1}/{exerciseInfoOff.length}
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
      <PlayerControl>
        <ImageContainer>
          <TouchableOpacity onPress={handlePrevious}>
            <Image source={previousbutton} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </ImageContainer>
        <ImageContainer>
          <CompleteContainer completed={completionStatus[currentIndex]} onPress={handleCompletion}>
            <CompleteText completed={completionStatus[currentIndex]}>완료</CompleteText>
          </CompleteContainer>
        </ImageContainer>
        <ImageContainer>
          <TouchableOpacity onPress={handleNext}>
            <Image source={nextbutton} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </ImageContainer>
      </PlayerControl>

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