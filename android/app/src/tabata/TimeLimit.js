import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StatusBar, TouchableOpacity, View, Text, Image } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TopBar1 } from "../compponents/TopBar";
import { ExerciseStart, ExerciseAdd, TimeLimitOn, TimeLimitOff } from "../compponents/Button";
import { PlaceDropdown } from '../compponents/DropDown';
import DraggableFlatList from 'react-native-draggable-flatlist';
import remove from "../assets/image/remove.png";
import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import up from "../assets/image/up.png";
import down from "../assets/image/down.png";



import {
    setsState,
    repsState,
    prepareTimeState,
    exerciseTimeState,
    restTimeState,
    exerciseLikesState,
    isTimeLimitOnState,
    selectedExercisesState,
    remainingExercisesState,
    dropdownValueState,
    likedExercisesState,

} from './Recoil';
//드롭다운 
const Dropdown = styled.View`
padding-left: 20px;
padding-right: 20px;
`;




// 세트, 횟수, 준비시간,운동시간,휴식시간 
const ExerciseInformation = styled.View`
padding-left: 20px;
padding-right: 20px;  
padding-top:20px;
`;



//운동추가하기 
const ExerciseContainer = styled.View`
padding-left: 20px;
padding-right: 20px;  
margin-bottom: 80px;
`;

//운동추가하기 선 
const ExerciseLine = styled.View`
margin-bottom:-20px;
border-top-width: 1px;
border-top-color:' rgba(0,0,0,0.2)';
`;


//운동시작 버튼 
const ExerciseStartContainer = styled.View`       
padding-left: 20px;
padding-right: 20px; 
margin-bottom: 30px;


`;


//횟수,세트 통합
const InputContainer = styled.View`
  flex-direction: row;
  padding-left: 8px;

  margin-top: -10px;
`;
//횟수,
const TextInput = styled.TextInput`
  margin-right: 1px;
  text-align: left; 
`;

//운동 이름
const ExerciseText = styled.Text`
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 5px;
  font-size: 15px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.9);
`;



// 운동이름, 휴지통 통합 
const IntegreatedContainer = styled.View`
flex-direction: row;
justify-content: space-between;
border-top-width: 1px; 
border-top-color:' rgba(0,0,0,0.2)';
padding-top: 7px;
`;
const SettingContainer = styled.View`
flex-direction: row;
 padding-top:10px;

`;


const TimeLimit = ({ route }) => {
    const navigation = useNavigation();
    const [dropdownValue, setDropdownValue] = useRecoilState(dropdownValueState);
    const [sets, setSets] = useRecoilState(setsState);
    const [reps, setReps] = useRecoilState(repsState);
    const [prepareTime, setPrepareTime] = useRecoilState(prepareTimeState);
    const [exerciseTime, setExerciseTime] = useRecoilState(exerciseTimeState);
    const [restTime, setRestTime] = useRecoilState(restTimeState);
    const [likedExercises, setLikedExercises] = useRecoilState(likedExercisesState);
    const [isTimeLimitOn, setIsTimeLimitOn] = useRecoilState(isTimeLimitOnState);
    const [exerciseOrder, setExerciseOrder] = useState([]);
    const [exerciseLikes, setExerciseLikes] = useRecoilState(exerciseLikesState);
    const [selectedExercises, setSelectedExercises] = useRecoilState(selectedExercisesState);
    const [remainingExercises, setRemainingExercises] = useRecoilState(remainingExercisesState);
    const prevDropdownValue = useRef(dropdownValue);



    useEffect(() => {
        // 드롭다운 값이 변경되면 실행되는 부분
        console.log(`dropdownValue가 변경됨: ${prevDropdownValue.current} -> ${dropdownValue}`);
        if (prevDropdownValue.current !== dropdownValue) {
            setSelectedExercises([]);
            setLikedExercises([]);
            prevDropdownValue.current = dropdownValue;
        }
    }, [dropdownValue, setSelectedExercises, setLikedExercises]);
    const toggleTimeLimit = () => {
        setIsTimeLimitOn((prevIsTimeLimitOn) => !prevIsTimeLimitOn);

    };

    useEffect(() => {
        setExerciseOrder(selectedExercises || []);
    }, [selectedExercises]);



    useEffect(() => {
        setDropdownValue(dropdownValue);
    }, [dropdownValue]);



    const navigateToNextStopWatch = () => {
        if (!dropdownValue || (dropdownValue !== '1' && dropdownValue !== '2')) {
            alert('장소를 선택하세요.');
            return;
        }
        if (selectedExercises.length === 0) { // 운동이 선택되지 않았을 때
            alert('운동을 선택하세요.');
            return;
        }
        const missingInputs = selectedExercises.filter(exercise => {
            return (
                !sets[exercise] ||
                !reps[exercise] ||
                !prepareTime[exercise] ||
                !exerciseTime[exercise] ||
                !restTime[exercise]
            );
        });

        if (missingInputs.length > 0) {
            alert('입력하세요.');
            return;
        }

        const exerciseInfoOn = selectedExercises.map(exercise => {
            return {
                name: exercise,
                sets: sets[exercise],
                reps: reps[exercise],
                prepareTime: prepareTime[exercise],
                exerciseTime: exerciseTime[exercise],
                restTime: restTime[exercise],
            };
        });
        navigation.navigate('StopWatch', { exerciseInfoOn });
    };

    const navigateToNextNonstopWatch = () => {
        if (!dropdownValue || (dropdownValue !== '1' && dropdownValue !== '2')) {
            alert('장소를 선택하세요.');
            return;
        }

        // 횟수와 세트가 입력되지 않았을 때 경고 메시지 표시
        const missingInputs = selectedExercises.filter(exercise => !sets[exercise] || !reps[exercise]);

        if (missingInputs.length > 0) {
            alert('입력하세요.');
            return;
        }
        if (selectedExercises.length === 0) { // 운동이 선택되지 않았을 때
            alert('운동을 선택하세요.');
            return;
        }
        const exerciseInfoOff = selectedExercises.map(exercise => ({
            name: exercise,
            sets: sets[exercise],
            reps: reps[exercise],
        }));

        navigation.navigate('NonstopWatch', { exerciseInfoOff });
    };




    const removeExercise = (index) => {
        // 선택한 운동에서 운동을 삭제한 후, 업데이트된 상태를 반영
        const updatedExercises = [...selectedExercises];
        updatedExercises.splice(index, 1);
        setSelectedExercises(updatedExercises);
    };

    const moveExerciseUp = (index) => {
        if (index > 0) {
            const newOrder = [...exerciseOrder];
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
            setExerciseOrder(newOrder);
        }
    };

    const moveExerciseDown = (index) => {
        if (index < exerciseOrder.length - 1) {
            const newOrder = [...exerciseOrder];
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
            setExerciseOrder(newOrder);
        }
    };






    const navigateToFlatList = () => {
        if (!dropdownValue || (dropdownValue !== '1' && dropdownValue !== '2')) {
            alert('장소를 선택하세요.');
            return;
        }

        // FlatList 스크린으로 이동하면서 직렬화 가능한 함수를 직접 전달
        navigation.navigate('FlatList', {
            dropdownValue: dropdownValue,

        });
    };







    const handleSetsChange = (exercise, value) => {
        setSets((prevSets) => ({ ...prevSets, [exercise]: value }));
        console.log(`세트: ${value}`);
    };

    const handleRepsChange = (exercise, value) => {
        setReps((prevReps) => ({ ...prevReps, [exercise]: value }));
        console.log(`횟수: ${value}`);
    };

    const handlePrepareTimeChange = (exercise, value) => {
        setPrepareTime((prevPrepareTime) => ({ ...prevPrepareTime, [exercise]: value }));
        console.log(`준비 시간: ${value}`);
    };

    const handleRestTimeChange = (exercise, value) => {
        setRestTime((prevRestTime) => ({ ...prevRestTime, [exercise]: value }));
        console.log(`휴식 시간: ${value}`);
    };

    const handleExerciseTimeChange = (exercise, value) => {
        setExerciseTime((prevExerciseTime) => ({ ...prevExerciseTime, [exercise]: value }));
        console.log(`운동 시간: ${value}`);
    };



    const onExerciseOrderChange = ({ data }) => {
        setExerciseOrder(data.map(item => item.exercise));
    };




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 1)' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 1)' }}
            >
                <View style={{ flex: 1 }}>
                    <TopBar1 />
                    <Dropdown>
                        <PlaceDropdown value={dropdownValue} setValue={setDropdownValue} enabled={false} />
                    </Dropdown>
                    <TouchableOpacity onPress={toggleTimeLimit} style={{ alignItems: 'flex-end', paddingRight: 22 }}>
                        {isTimeLimitOn ? (
                            <TimeLimitOn title="Time Limit ON" />
                        ) : (
                            <TimeLimitOff title="Time Limit OFF" />
                        )}
                    </TouchableOpacity>

                    <ScrollView>
                        {isTimeLimitOn ? (
                            <ExerciseInformation>
                                {exerciseOrder.map((exercise, index) => (
                                    <View key={index}>
                                        <IntegreatedContainer>
                                            <ExerciseText>{exercise}</ExerciseText>


                                            <SettingContainer>
                                                <TouchableOpacity onPress={() => moveExerciseUp(index)}>
                                                    <Image source={up} style={{ width: 18, height: 18, marginTop: -5, marginLeft: 8 }} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => moveExerciseDown(index)}>
                                                    <Image source={down} style={{ width: 18, height: 18, marginTop: -5, marginLeft: 8 }} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => removeExercise(index)}>
                                                    <Image source={remove} style={{ width: 18, height: 18, marginTop: -5, marginLeft: 8 }} />
                                                </TouchableOpacity>
                                            </SettingContainer>






                                        </IntegreatedContainer>
                                        <InputContainer>
                                            <TextInput
                                                placeholder="세트"
                                                keyboardType="numeric"
                                                color="black"
                                                value={sets[exercise]}
                                                onChangeText={(value) => handleSetsChange(exercise, value)}
                                            />
                                            <TextInput
                                                placeholder="횟수"
                                                keyboardType="numeric"
                                                color="black"
                                                value={reps[exercise]}
                                                onChangeText={(value) => handleRepsChange(exercise, value)}
                                            />
                                            <TextInput
                                                placeholder="준비시간"
                                                keyboardType="numeric"
                                                color="black"
                                                value={prepareTime[exercise]}
                                                onChangeText={(value) => handlePrepareTimeChange(exercise, value)}
                                            />
                                            <TextInput
                                                placeholder="운동시간"
                                                keyboardType="numeric"
                                                color="black"
                                                value={exerciseTime[exercise]}
                                                onChangeText={(value) => handleExerciseTimeChange(exercise, value)}
                                            />
                                            <TextInput
                                                placeholder="휴식시간"
                                                keyboardType="numeric"
                                                color="black"
                                                value={restTime[exercise]}
                                                onChangeText={(value) => handleRestTimeChange(exercise, value)}
                                            />
                                        </InputContainer>
                                    </View>
                                ))}
                            </ExerciseInformation>
                        ) : (
                            <ExerciseInformation>
                                {exerciseOrder.map((exercise, index) => (
                                    <View key={index}>
                                        <IntegreatedContainer>
                                            <ExerciseText>{exercise}</ExerciseText>
                                            <TouchableOpacity onPress={() => removeExercise(index)}>
                                                <Image source={remove} style={{ width: 18, height: 18 }} />
                                            </TouchableOpacity>
                                        </IntegreatedContainer>
                                        <InputContainer>
                                            <TextInput
                                                placeholder="세트"
                                                keyboardType="numeric"
                                                value={sets[exercise]}
                                                onChangeText={(value) => handleSetsChange(exercise, value)}
                                            />
                                            <TextInput
                                                placeholder="횟수"
                                                keyboardType="numeric"
                                                value={reps[exercise]}
                                                onChangeText={(value) => handleRepsChange(exercise, value)}
                                            />
                                        </InputContainer>
                                    </View>
                                ))}
                            </ExerciseInformation>
                        )}
                    </ScrollView>



                    <ExerciseContainer>
                        <ExerciseLine>
                            <TouchableOpacity onPress={navigateToFlatList}>
                                <ExerciseAdd title={`+ 운동 추가하기 `} />
                            </TouchableOpacity>
                        </ExerciseLine>
                    </ExerciseContainer>

                    <ExerciseStartContainer>
                        <TouchableOpacity onPress={() => {
                            if (isTimeLimitOn) {
                                navigateToNextStopWatch();
                            } else {
                                navigateToNextNonstopWatch();
                            }
                        }}>
                            <ExerciseStart title="운동 시작" />
                        </TouchableOpacity>
                    </ExerciseStartContainer>

                    <StatusBar backgroundColor="black" />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default TimeLimit;