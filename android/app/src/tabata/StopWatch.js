import React, { useState, useEffect } from 'react';
import { StatusBar, View, Image, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from "../components/theme";
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


const formatTime = (seconds, sets) => {

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
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
  const [sets, setSets] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].sets : 0);
  const [reps, setReps] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].reps : 0);
  const [prepareTimeInSeconds, setprepareTimeInSeconds] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].prepareTimeInSeconds : 0);
  const [exerciseTimeInSeconds, setexerciseTimeInSeconds] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].exerciseTimeInSeconds : 0);
  const [restTimeInSeconds, setrestTimeInSeconds] = useState(exerciseInfoOn.length > 0 ? exerciseInfoOn[0].restTimeInSeconds : 0);
  const initialExerciseTimeInSeconds = exerciseInfoOn.length > 0 ? exerciseInfoOn[0].exerciseTimeInSeconds : 0;
  const initialRestTimeInSeconds = exerciseInfoOn.length > 0 ? exerciseInfoOn[0].restTimeInSeconds : 0;

  useEffect(() => {

    const saveDataToStorage = async (data, key) => {
      try {
        if (completion === 1) {
          // 이전 데이터 불러오기
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

          // 10년 전의 날짜 계산
          const currentDate = new Date();
          const tenYearsAgo = new Date(currentDate);
          tenYearsAgo.setFullYear(currentDate.getFullYear() - 10);

          // 이전 데이터 중 10년 이전의 데이터 제거
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

    saveDataToStorage([], 'On'); // 초기 실행 시 빈 배열을 전달
  }, [exerciseInfoOn, completion]);




  useEffect(() => {
    let intervalId;
    if ((prepareTimeInSeconds > 0 || exerciseTimeInSeconds > 0 || restTimeInSeconds > 0) && !isPaused) {
      intervalId = setInterval(() => {
        if (prepareTimeInSeconds > 0) {
          setprepareTimeInSeconds((prevTime) => prevTime - 1);
        } else if (exerciseTimeInSeconds > 0) {
          setexerciseTimeInSeconds((prevTime) => prevTime - 1);
        } else if (restTimeInSeconds > 0) {
          setrestTimeInSeconds((prevTime) => prevTime - 1);
        }
      }, 1000);
    }


    if (prepareTimeInSeconds === 0 && exerciseTimeInSeconds === 0 && restTimeInSeconds === 0 && !isPaused) {
      if (currentSet < sets) {
        setCurrentSet((prevSet) => prevSet + 1);
        setexerciseTimeInSeconds(initialExerciseTimeInSeconds);
        setrestTimeInSeconds(initialRestTimeInSeconds);
      } else {
        // 모든 세트가 완료되면 다음 운동으로 전환
        if (currentIndex < exerciseInfoOn.length - 1) {
          setCurrentIndex((prevIndex) => prevIndex + 1);
          setprepareTimeInSeconds(exerciseInfoOn[currentIndex + 1].prepareTimeInSeconds);
          setName(exerciseInfoOn[currentIndex + 1].name);
          setSets(exerciseInfoOn[currentIndex + 1].sets);
          setReps(exerciseInfoOn[currentIndex + 1].reps);
          setCurrentSet(1);
          setexerciseTimeInSeconds(exerciseInfoOn[currentIndex + 1].exerciseTimeInSeconds);
          setrestTimeInSeconds(exerciseInfoOn[currentIndex + 1].restTimeInSeconds);
          if (!isPaused) {
            setIsPaused(true);
          }
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
      setName(nextExercise.name);
      setSets(nextExercise.sets);
      setReps(nextExercise.reps);
      setprepareTimeInSeconds(nextExercise.prepareTimeInSeconds);
      setexerciseTimeInSeconds(nextExercise.exerciseTimeInSeconds);
      setrestTimeInSeconds(nextExercise.restTimeInSeconds);
      setCurrentSet(1);
      if (!isPaused) {
        setIsPaused(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const previousExercise = exerciseInfoOn[currentIndex - 1];
      setName(previousExercise.name);
      setSets(previousExercise.sets);
      setReps(previousExercise.reps);
      setprepareTimeInSeconds(previousExercise.prepareTimeInSeconds);
      setexerciseTimeInSeconds(previousExercise.exerciseTimeInSeconds);
      setrestTimeInSeconds(previousExercise.restTimeInSeconds);
      setCurrentSet(1);
      if (!isPaused) {
        setIsPaused(true);
      }
    }
  };
  const toggleStart = () => {
    if (isPaused && (prepareTimeInSeconds <= 1 || exerciseTimeInSeconds <= 1 || restTimeInSeconds <= 1)) {
      // 일시정지 상태에서 버튼을 눌러서 재생할 때
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
      BoxingBellSound.setVolume(0); // 소리를 끔
    } else {
      BoxingBellSound.setVolume(1); // 소리를 켬
    }
  };


  return (
    <View style={styles.entire}>
      <SpeakerContainer>
        <TouchableOpacity onPress={toggleSpeaker}>
          <Image source={isSoundOn ? speakerfilled : speakerunfilled} style={styles.speakerIcon} />
        </TouchableOpacity>
      </SpeakerContainer>
      <View style={styles.eiContainer}>
        {route.params?.exerciseInfoOn?.slice(currentIndex, currentIndex + 1).map((exercise, index) => (
          <View key={index}>
            <ExerciseInformation>
              <Text style={styles.setText}>
                {currentSet} / {exercise.sets}
              </Text>
              <Text style={styles.exerciseText}>{exercise.name} </Text>
              <Text style={styles.numberText}>횟수: {exercise.reps}</Text>
              <Text style={styles.exercisedurationText}>운동시간: {formatTime(exerciseTimeInSeconds)} </Text>
              <View style={styles.timeContainer}>
                <View style={styles.prepareContainer}>
                  <Text style={styles.prepareText}>준비 {formatTime(prepareTimeInSeconds)}</Text>
                </View>
                <View style={styles.restContainer}>
                  <Text style={styles.restText}>휴식 {formatTime(restTimeInSeconds)}</Text>
                </View>
              </View>
            </ExerciseInformation>
          </View>
        ))}
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
      </View>
      <StatusBar backgroundColor="black" />
    </View>
  );
};

const styles = {
  entire: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flex: 1,
  },
  speakerIcon: {
    width: 30,
    height: 30,
  },
  eiContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  //현재,전체 세트 
  setText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.main,
    paddingTop: 50,
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
    paddingTop: 50,
  },
  //준비시간, 휴식시간 통합 
  timeContainer: {
    flexDirection: 'row',

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
  musicContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    paddingTop: 70,
  },
  previousbutton: {
    width: 30,
    height: 30,
  },
  isPaused: {
    width: 30,
    height: 30,
  },
  nextButton: {
    width: 30,
    height: 30,
  },
};

export default StopWatch;