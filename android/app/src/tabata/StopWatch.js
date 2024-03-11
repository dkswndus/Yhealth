import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, View, Image, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from "../components/theme";
import { Alert } from 'react-native';

import { ProgressCircle } from 'react-native-svg-charts';


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
  padding-top: 40px;
  justify-content: center;
  align-items: center;
  padding-bottom: 5px;
`;

//소리
const SpeakerContainer = styled.View`
  padding-left: 30px;
  padding-top: 25px;
  padding-right:400px;
`;


const formatTime = (seconds, sets) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}' ${formattedSeconds}'`;
};
const StopWatch = ({ route }) => {
  const navigation = useNavigation();
  const exerciseInfoOn = route.params?.exerciseInfoOn || [];
  const [isPaused, setIsPaused] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speakerImage, setSpeakerImage] = useState(speakerfilled);
  const [completion, setCompletion] = useState(0);
  const [name, setName] = useState('');
  const [sets, setSets] = useState(exerciseInfoOn[0].sets);
  const [reps, setReps] = useState(exerciseInfoOn[0].reps);
  const [prepareTimeInSeconds, setprepareTimeInSeconds] = useState(exerciseInfoOn[0].prepareTimeInSeconds);
  const [exerciseTimeInSeconds, setexerciseTimeInSeconds] = useState(exerciseInfoOn[0].exerciseTimeInSeconds);
  const [restTimeInSeconds, setrestTimeInSeconds] = useState(exerciseInfoOn[0].restTimeInSeconds);
  const [initialExerciseTimeInSeconds, setInitialExerciseTimeInSeconds] = useState(exerciseInfoOn[0].exerciseTimeInSeconds);
  const [initialRestTimeInSeconds, setInitialRestTimeInSeconds] = useState(exerciseInfoOn[0].restTimeInSeconds);

  const [progress, setProgress] = useState(0);
  const [currentColor, setCurrentColor] = useState('rgba(80, 196, 237,1)');
  const [exerciseTime, setExerciseTime] = useState(exerciseTimeInSeconds);
  const [prepareTime, setPrepareTime] = useState(prepareTimeInSeconds);
  const [restTime, setRestTime] = useState(restTimeInSeconds);

  useEffect(() => {

    const saveDataToStorage = async (data, key) => {
      try {
        if (completion === 1) {

          const existingData = await AsyncStorage.getItem(`appData${key}`);
          const parsedExistingData = existingData ? JSON.parse(existingData) : [];

          const transformedData = exerciseInfoOn.map(item => {
            const { name, reps, sets, totalExerciseTime } = item;
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            const formattedTime = `${parseInt(totalExerciseTime.minutes)}분 ${parseInt(totalExerciseTime.seconds)}초`;

            return {
              name: name,
              date: formattedDate,
              sets: sets,
              reps: reps,
              time: formattedTime,

            };
          });


          const currentDate = new Date();
          const tenYearsAgo = new Date(currentDate);
          tenYearsAgo.setFullYear(currentDate.getFullYear() - 10);


          const filteredExistingData = parsedExistingData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate > tenYearsAgo;
          });

          // 이전 데이터와 새로운 데이터 합치기
          const combinedData = [...filteredExistingData, ...transformedData];
          // 데이터 저장
          await AsyncStorage.setItem(`appData${key}`, JSON.stringify(combinedData));
        }

      } catch (error) {
        console.error('오류', error);
      }
    };

    saveDataToStorage([], 'On');
  }, [exerciseInfoOn, completion]);



  useEffect(() => {
    let intervalId;
    if (!isPaused) {
      intervalId = setInterval(() => {
        if (prepareTimeInSeconds > 0) {

          setprepareTimeInSeconds(prevTime => prevTime - 1);
          setProgress(prevProgress => prevProgress + (1 / prepareTime));
          setCurrentColor('rgb(255, 181, 52)'); // 준비 시간 색상
          if (prepareTimeInSeconds <= 1) {
            setCurrentColor('rgb(54, 82, 173)');
          }
        } else if (exerciseTimeInSeconds > 0) {

          setexerciseTimeInSeconds(prevTime => prevTime - 1);
          setProgress(prevProgress => prevProgress + (1 / exerciseTime));
          setCurrentColor('rgb(54, 82, 173)'); // 운동 시간 색상
          if (exerciseTimeInSeconds <= 1) {
            setProgress(0);
          }
        } else if (restTimeInSeconds > 0) {

          setrestTimeInSeconds(prevTime => prevTime - 1);
          setProgress(prevProgress => prevProgress + (1 / restTime));
          setCurrentColor('rgb(230, 126, 126)'); // 휴식 시간 색상
          if (restTimeInSeconds <= 1) {
            setCurrentColor('rgb(230, 126, 126)');
          }
        }
      }, 1000);
    }
    if ((prepareTimeInSeconds === 0 && exerciseTimeInSeconds === 0 && restTimeInSeconds === 0) && !isPaused) {
      if (currentSet < sets) {
        setCurrentSet(prevSet => prevSet + 1);
        setexerciseTimeInSeconds(initialExerciseTimeInSeconds);
        setrestTimeInSeconds(initialRestTimeInSeconds);
      } else {
        if (currentIndex < exerciseInfoOn.length - 1) {
          setCurrentIndex(currentIndex + 1);
          const nextExercise = exerciseInfoOn[currentIndex + 1];
          setName(nextExercise.name);
          setSets(nextExercise.sets);
          setReps(nextExercise.reps);
          setprepareTimeInSeconds(nextExercise.prepareTimeInSeconds);
          setexerciseTimeInSeconds(nextExercise.exerciseTimeInSeconds);
          setrestTimeInSeconds(nextExercise.restTimeInSeconds);
          setInitialExerciseTimeInSeconds(nextExercise.exerciseTimeInSeconds);
          setInitialRestTimeInSeconds(nextExercise.restTimeInSeconds);
          setExerciseTime(nextExercise.exerciseTimeInSeconds);
          setPrepareTime(nextExercise.prepareTimeInSeconds);
          setRestTime(nextExercise.restTimeInSeconds);
          setCurrentSet(1);
          setIsPaused(true);
          setProgress(0);
        } else {
          Alert.alert('종료', '운동이 완료되었습니다.');
          navigation.goBack();
          setCompletion(1);
        }
      }
    }
    if ((prepareTimeInSeconds === 1 || exerciseTimeInSeconds === 1 || restTimeInSeconds === 1) && !isPaused) {
      BoxingBellSound.play();
    }
    return () => {
      clearInterval(intervalId);
    };

  }, [prepareTimeInSeconds, exerciseTimeInSeconds, restTimeInSeconds, isPaused]);

  const handleNext = () => {
    if (currentIndex < exerciseInfoOn.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextExercise = exerciseInfoOn[currentIndex + 1];
      setProgress(0);
      setName(nextExercise.name);
      setSets(nextExercise.sets);
      setReps(nextExercise.reps);
      setprepareTimeInSeconds(nextExercise.prepareTimeInSeconds);
      setexerciseTimeInSeconds(nextExercise.exerciseTimeInSeconds);
      setrestTimeInSeconds(nextExercise.restTimeInSeconds);
      setCurrentSet(1);
      setExerciseTime(nextExercise.exerciseTimeInSeconds);
      setPrepareTime(nextExercise.prepareTimeInSeconds);
      setRestTime(nextExercise.restTimeInSeconds);
      setInitialExerciseTimeInSeconds(nextExercise.exerciseTimeInSeconds);
      setInitialRestTimeInSeconds(nextExercise.restTimeInSeconds);
      if (!isPaused) {
        setIsPaused(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const previousExercise = exerciseInfoOn[currentIndex - 1];
      setProgress(0);
      setName(previousExercise.name);
      setSets(previousExercise.sets);
      setReps(previousExercise.reps);
      setprepareTimeInSeconds(previousExercise.prepareTimeInSeconds);
      setexerciseTimeInSeconds(previousExercise.exerciseTimeInSeconds);
      setrestTimeInSeconds(previousExercise.restTimeInSeconds);
      setPrepareTime(previousExercise.prepareTimeInSeconds);
      setExerciseTime(previousExercise.exerciseTimeInSeconds);
      setRestTime(previousExercise.restTimeInSeconds);
      setInitialExerciseTimeInSeconds(previousExercise.exerciseTimeInSeconds);
      setInitialRestTimeInSeconds(previousExercise.restTimeInSeconds);
      setCurrentSet(1);
      if (!isPaused) {
        setIsPaused(true);
      }
    }
  };


  const toggleStart = () => {
    if (isPaused && (prepareTimeInSeconds <= 1 || exerciseTimeInSeconds <= 1 || restTimeInSeconds <= 1)) {
      // 일시정지 상태에서 버튼을 눌러서 재생할 때
      BoxingBellSound.play();
    } else {
      // 재생 중일 때 버튼을 눌러서 일시정지할 때
      BoxingBellSound.pause();
    }
    setIsPaused(!isPaused);
  };
  const toggleSpeaker = () => {

    setIsSoundOn(!isSoundOn);
    setSpeakerImage(isSoundOn ? speakerunfilled : speakerfilled);
    if (isSoundOn) {
      BoxingBellSound.setVolume(0);
    } else {
      BoxingBellSound.setVolume(1);
    }
  };


  return (
    <View style={styles.entire}>
      <SpeakerContainer>
        <TouchableOpacity onPress={toggleSpeaker}>
          <Image source={isSoundOn ? speakerfilled : speakerunfilled} style={styles.speakerIcon} />
        </TouchableOpacity>
      </SpeakerContainer>
      <ProgressCircle
        style={{
          marginTop: 30,
          height: 380,
          justifyContent: 'center',
          alignItems: 'center',
          strokeWidth: 20,
        }}
        progress={progress > 1 ? 1 : progress}
        progressColor={currentColor}
      >
        {route.params?.exerciseInfoOn?.slice(currentIndex, currentIndex + 1).map((exercise, index) => (
          <View key={index}>
            <ExerciseInformation>
              <Text style={styles.setText}>
                {currentSet} / {exercise.sets}
              </Text>
              <Text style={styles.exerciseText}>{exercise.name} </Text>
              <Text style={styles.numberText}>횟수: {exercise.reps}</Text>
              {prepareTimeInSeconds > 0 && (
                <Text style={styles.durationText}>{formatTime(prepareTimeInSeconds)}</Text>
              )}
              {prepareTimeInSeconds === 0 && exerciseTimeInSeconds > 0 && (
                <Text style={styles.durationText}>{formatTime(exerciseTimeInSeconds)}</Text>
              )}
              {exerciseTimeInSeconds === 0 && restTimeInSeconds > 0 && (
                <Text style={styles.durationText}>{formatTime(restTimeInSeconds)}</Text>
              )}
            </ExerciseInformation>
          </View>
        ))}
      </ProgressCircle>
      <View style={styles.musicContainer}>
        <TouchableOpacity onPress={handlePrevious}>
          <Image source={previousbutton} style={styles.previousbutton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleStart}>
          <Image source={isPaused ? stop : play} style={styles.isPaused} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Image source={nextbutton} style={styles.nextButton} />
        </TouchableOpacity>
      </View>
      <StatusBar backgroundColor="black" />
    </View>
  );
};

const styles = {
  circular: {
    flex: 1,
  },
  entire: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  speakerIcon: {
    width: 33,
    height: 33,
  },
  eiContainer: {

    alignSelf: 'center',
  },
  //현재,전체 세트 
  setText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'rgba(0,0,0,0.7)',
    paddingTop: 30,
  },
  //현재 운동 이름 
  exerciseText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: theme.main,
  },
  //횟수
  numberText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.7)',
  },
  //운동시간,준비시간,휴식시간 t
  durationText: {
    fontSize: 100,
    fontWeight: 'bold',
    color: theme.main,
  },
  musicContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 60,
    paddingTop: 60,

  },
  previousbutton: {
    width: 33,
    height: 33,

  },
  isPaused: {
    width: 33,
    height: 33,

  },
  nextButton: {
    width: 33,
    height: 33,
  },
};

export default StopWatch;