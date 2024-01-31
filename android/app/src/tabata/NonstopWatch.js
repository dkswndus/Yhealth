import React, { useState, useEffect } from 'react';
import { StatusBar, View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const stop = require("../assets/image/stop.png");
const previousbutton = require("../assets/image/previousbutton.png");
const nextbutton = require("../assets/image/nextbutton.png");
const play = require("../assets/image/play.png");

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
  const [playImage, setPlayImage] = useState(play);
  const exercises = route.params?.exerciseInfoOff || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completionStatus, setCompletionStatus] = useState(Array(exercises.length).fill(false));
  const [reps, setReps] = useState(exercises.length > 0 ? exercises[0].reps : 0);
  const [sets, setSets] = useState(exercises.length > 0 ? exercises[0].sets : 0);
  const [name, setName] = useState(exercises.length > 0 ? exercises[0].name : 0);


  const exerciseOrder = exercises.length > 0 ? exercises[0].exerciseOrder : '';
  const time = 0;

  const saveDataToStorage = async () => {
    const updatedStatus = [...completionStatus];
    updatedStatus[currentIndex] = !completionStatus[currentIndex];
    setCompletionStatus(updatedStatus);

    if (!completionStatus[currentIndex]) {
      try {
        const dataToSave = {
          name: name,
          time: time,
          sets: sets,
          reps: reps,
          date: new Date().toLocaleString(),
        };

        await AsyncStorage.setItem('appData', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    }
  };




  useEffect(() => {
    saveDataToStorage();
  }, [sets, reps, name, time]);

  const handleCompletion = () => {
    const updatedStatus = [...completionStatus];
    updatedStatus[currentIndex] = !completionStatus[currentIndex];
    setCompletionStatus(updatedStatus);
  };

  const selectedExercises = exercises.slice(currentIndex, currentIndex + 2);

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    setCompletionStatus(Array(exercises.length).fill(false));

    if (route.params?.completed) {
      setCompletionStatus(route.params.completed);
    }
  }, [exercises]);

  useEffect(() => {
    if (completionStatus.every((status) => status === true)) {

      Alert.alert('운동 종료!', '축하합니다. 운동이 완료되었습니다.');
    }
  }, [completionStatus]);

  return (
    <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 }}>
      {selectedExercises.map((exercise, index) => (
        <View key={index}>
          <ExerciseInformation>
            <Text style={index === 0 ? styles.currentbigText : styles.currentmediumText}>
              {currentIndex + index + 1}/{exercises.length}
            </Text>
            <Text style={index === 0 ? styles.currentbigText : styles.currentmediumText}>
              {name}
            </Text>
            <Text style={index === 0 ? styles.currentbigText : styles.currentmediumText}>
              {sets} x {reps}
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
