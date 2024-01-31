import React, { useState, useEffect } from 'react';
import { StatusBar, View, Image, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from "../compponents/theme";
import { Alert } from 'react-native';


const speakerfilled = require("../assets/image/speakerfilled.png");
const speakerunfilled = require("../assets/image/speakerunfilled.png");
const play = require("../assets/image/play.png");
const previousbutton = require("../assets/image/previousbutton.png");
const nextbutton = require("../assets/image/nextbutton.png");
const stop = require("../assets/image/stop.png");
const soundFilePath = require("../assets/sound/boxingbellsound.mp3");
const BoxingBellSound = new Sound(soundFilePath, Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.error('Failed to load the sound', error);
  }
});

//횟수,운동시간,준비,휴식
const ExerciseInformation = styled.View`
  padding-top: 60px;
  justify-content: center;
  align-items: center;
  padding-bottom: 5px;
`;

//소리
const SpeakerContainer = styled.View`
  padding-left: 30px;
  padding-top: 25px;
`;


// privious,일시정지,next 통합
const PlayerControl = styled.View`
  position: absolute;
  top: 450px;
  left: -30px;
  padding-top: 30px;
  padding-left: 90px;
  flex-direction: row;
`;


// privious,일시정지,next 이미지 
const ImageContainer = styled.View`
  
`;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

const StopWatch = ({ route }) => {
  const exerciseInfoOn = route.params?.exerciseInfoOn || [];
  const [isPaused, setIsPaused] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reps, setReps] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].reps : 0);
  const [prepareTime, setPrepareTime] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].prepareTime : 0);
  const [exerciseTime, setExerciseTime] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].exerciseTime : 0);
  const [restTime, setRestTime] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].restTime : 0);
  const [name, setName] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].name : 0);


  const [sets, setSets] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].sets : 0);
  const [speakerImage, setSpeakerImage] = useState(speakerfilled);

  const initialExerciseTime = exerciseInfoOn.length > 0 ? exerciseInfoOn[0].exerciseTime : 0;
  const initialRestTime = exerciseInfoOn.length > 0 ? exerciseInfoOn[0].restTime : 0;
  const exercises = route.params?.exerciseInfoOn || [];
  const exerciseOrder = exercises.length > 0 ? exercises[0].exerciseOrder : '';

  const saveDataToStorage = async () => {
    try {

      const dataToSave = {
        sets: sets,
        reps: reps,
        prepareTime: prepareTime,
        exerciseTime: exerciseTime,
        restTime: restTime,
        date: new Date().toLocaleString(),
        name: name,

      };


      await AsyncStorage.setItem('appData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };


  // 상태가 변경될 때마다 데이터 저장
  useEffect(() => {
    saveDataToStorage();
  }, [sets, reps, prepareTime, exerciseTime, restTime, name]);

















  useEffect(() => {
    let intervalId;

    const startNextSet = () => {
      if (currentIndex < exerciseInfoOn.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setPrepareTime(exerciseInfoOn[currentIndex + 1].prepareTime);
        setSets(exerciseInfoOn[currentIndex + 1].sets);
        setCurrentSet(1);
        setExerciseTime(exerciseInfoOn[currentIndex + 1].exerciseTime);
        setRestTime(exerciseInfoOn[currentIndex + 1].restTime);
        if (!isPaused) {
          setIsPaused(true);
        }
      }
    };

    if ((prepareTime > 0 || exerciseTime > 0 || restTime > 0) && !isPaused) {
      intervalId = setInterval(() => {
        if (prepareTime > 0) {
          setPrepareTime((prevTime) => prevTime - 1);
        } else if (exerciseTime > 0) {
          setExerciseTime((prevTime) => prevTime - 1);
        } else if (restTime > 0) {
          setRestTime((prevTime) => prevTime - 1);
        }
      }, 1000);
    }



    if (prepareTime === 0 && exerciseTime === 0 && restTime === 0 && !isPaused) {
      BoxingBellSound.play();
      if (currentSet < sets) {
        setCurrentSet((prevSet) => prevSet + 1);

        setExerciseTime(initialExerciseTime);
        setRestTime(initialRestTime);
      } else {
        Alert.alert('운동 종료!', '축하합니다. 운동이 완료되었습니다.');
      }
    }
    if ((prepareTime === 1 || exerciseTime === 1 || restTime === 1) && !isPaused) {
      BoxingBellSound.play();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [prepareTime, exerciseTime, restTime, isPaused]);






  const handleNext = () => {
    if (currentIndex < exerciseInfoOn.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPrepareTime(exerciseInfoOn[currentIndex + 1].prepareTime);
      setSets(exerciseInfoOn[currentIndex + 1].sets);
      setCurrentSet(1);
      setExerciseTime(exerciseInfoOn[currentIndex + 1].exerciseTime);
      setRestTime(exerciseInfoOn[currentIndex + 1].restTime);
      if (!isPaused) {
        setIsPaused(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPrepareTime(exerciseInfoOn[currentIndex - 1].prepareTime);
      setSets(exerciseInfoOn[currentIndex - 1].sets);
      setExerciseTime(exerciseInfoOn[currentIndex - 1].exerciseTime);
      setRestTime(exerciseInfoOn[currentIndex - 1].restTime);
      setCurrentSet(1);
      if (!isPaused) {
        setIsPaused(true);
      }
    }
  };
  const toggleStart = () => {
    if (isPaused && (prepareTime <= 1 || exerciseTime <= 1 || restTime <= 1)) {
      // 일시정지 상태에서 버튼을 눌러서 재생할 때
      BoxingBellSound.play();
    } else {
      // 재생 중일 때 버튼을 눌러서 일시정지할 때
      BoxingBellSound.pause();
    }
    setIsPaused(!isPaused);
  };
  const toggleSpeaker = () => {
    setIsSoundOn(!isSoundOn); // 상태를 반전시킴

    // 스피커 아이콘 이미지 업데이트 (isSoundOn 값에 따라 다른 이미지로 변경)
    setSpeakerImage(isSoundOn ? speakerunfilled : speakerfilled);

    // 소리를 켜거나 끔
    if (isSoundOn) {
      BoxingBellSound.setVolume(0); // 소리를 끔
    } else {
      BoxingBellSound.setVolume(1); // 소리를 켬
    }
  };
  return (
    <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 }}>
      <SpeakerContainer>
        <TouchableOpacity onPress={toggleSpeaker}>
          <Image source={isSoundOn ? speakerfilled : speakerunfilled} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </SpeakerContainer>

      {route.params?.exerciseInfoOn?.slice(currentIndex, currentIndex + 1).map((exercise, index) => (
        <View key={index}>
          <ExerciseInformation>
            <Text style={styles.setText}>
              {currentSet} / {sets}
            </Text>

            <Text style={styles.exerciseText}>{name} </Text>
            <Text style={styles.numberText}>
              횟수: {reps}
            </Text>

            <Text style={styles.exercisedurationText}>
              운동시간: {formatTime(exerciseTime)}
            </Text>

            <View style={styles.timeContainer}>
              <View style={styles.prepareContainer}>
                <Text style={styles.prepareText}>
                  준비 {formatTime(prepareTime)}
                </Text>
              </View>
              <View style={styles.restContainer}>
                <Text style={styles.restText}>
                  휴식 {formatTime(restTime)}
                </Text>
              </View>
            </View>
          </ExerciseInformation>
        </View>
      ))}


      <View style={{ alignSelf: 'center', flexDirection: 'row', flex: 1, marginTop: 20 }}>
        <ImageContainer>
          <TouchableOpacity onPress={handlePrevious}>
            <Image source={previousbutton} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        </ImageContainer>
        <View style={{ marginLeft: 80, marginRight: 80 }}>
          <TouchableOpacity onPress={toggleStart}>
            <Image source={isPaused ? stop : play} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
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
  //현재,전체 세트 
  setText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.main,
  },
  //현재 운동 이름 
  exerciseText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: theme.main,
  },
  //횟수
  numberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.main,
  },
  //운동시간
  exercisedurationText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: theme.main,
    paddingTop: 40,
  },
  //준비시간, 휴식시간 통합 
  timeContainer: {
    flexDirection: 'row',
    paddingTop: 80,
  },
  //준비시간t
  prepareText: {
    fontSize: 25,
    color: 'white',
  },
  //준비시간c
  prepareContainer: {
    backgroundColor: 'red',
    padding: 5,
    marginVertical: 10,
    marginRight: 30,
  },
  //휴식시간t
  restText: {
    fontSize: 25,
    color: 'white',
  },
  //휴식시간c
  restContainer: {
    backgroundColor: 'green',
    padding: 5,
    marginVertical: 10,
  },
};

export default StopWatch;