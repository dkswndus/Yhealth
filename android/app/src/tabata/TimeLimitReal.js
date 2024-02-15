/*
import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StatusBar, TouchableOpacity, View, Image, Alert, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { TopBar1 } from "../components/TopBar";
import { ExerciseStart, ExerciseAdd, TimeLimitOn, TimeLimitOff } from "../components/Button";
import { PlaceDropdown } from '../components/DropDown';
import remove from "../assets/image/remove.png";
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

    dropdownValueState,
    likedExercisesState,

} from './Recoil';
import { stopUpload } from 'react-native-fs';
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



//횟수,
const TextInput = styled.TextInput`
flex-direction: row;
 
`;
//횟수,세트 통합
const InputContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: 8px;
  margin-top: -10px;
`;

const TextInputContainer = styled.View`
  flex: 1;
  margin-right: 10px;  // 텍스트 인풋 사이의 간격을 조절
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
    const [initialSets, setInitialSets] = useState("3");
    const [initialPrepareTime, setInitialPrepareTime] = useState("10");
    const [initialReps, setInitialReps] = useState("25");
    const [initialRestTime, setInitialRestTime] = useState("10");
    const [initialExerciseTime, setInitialExerciseTime] = useState("70");
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

    const prevDropdownValue = useRef(dropdownValue);
    const time = "0분";


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

        setSets((prevSets) => selectedExercises.reduce((acc, exercise) => ({ ...acc, [exercise]: prevSets[exercise] || initialSets }), {}));
        setReps((prevReps) => selectedExercises.reduce((acc, exercise) => ({ ...acc, [exercise]: prevReps[exercise] || initialReps }), {}));
        setPrepareTime((prevPrepareTime) => selectedExercises.reduce((acc, exercise) => ({ ...acc, [exercise]: prevPrepareTime[exercise] || initialPrepareTime }), {}));
        setRestTime((prevRestTime) => selectedExercises.reduce((acc, exercise) => ({ ...acc, [exercise]: prevRestTime[exercise] || initialRestTime }), {}));
        setExerciseTime((prevExerciseTime) => selectedExercises.reduce((acc, exercise) => ({ ...acc, [exercise]: prevExerciseTime[exercise] || initialExerciseTime }), {}));
        setDropdownValue(dropdownValue);
    }, [dropdownValue, initialSets, initialReps, selectedExercises, setSets, setReps, setRestTime, setPrepareTime]);



    const navigateToNextStopWatch = () => {
        if (!dropdownValue || (dropdownValue !== '1' && dropdownValue !== '2')) {
            Alert.alert('오류', '장소를 선택하세요.');
            return;
        }
        if (selectedExercises.length === 0) { // 운동이 선택되지 않았을 때
            Alert.alert('오류', '운동을 선택하세요.');
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
            Alert.alert('오류', '입력하세요.');
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
            Alert.alert('오류', '장소를 선택하세요.');
            return;
        }

        // 횟수와 세트가 입력되지 않았을 때 경고 메시지 표시
        const missingInputs = selectedExercises.filter(exercise => !sets[exercise] || !reps[exercise]);

        if (missingInputs.length > 0) {
            Alert.alert('오류', '입력하세요.');
            return;
        }
        if (selectedExercises.length === 0) { // 운동이 선택되지 않았을 때
            Alert.alert('오류', '운동을 선택하세요.');
            return;
        }
        const exerciseInfoOff = selectedExercises.map(exercise => ({
            name: exercise,
            sets: sets[exercise],
            reps: reps[exercise],
            time: time,
        }));

        navigation.navigate('NonstopWatch', { exerciseInfoOff });
    };


    const removeExercise = (index) => {
        // 선택한 운동에서 운동을 삭제한 후, 업데이트된 상태를 반영
        const updatedExercises = [...selectedExercises];
        updatedExercises.splice(index, 1);
        setSelectedExercises(updatedExercises);

        // 운동 삭제 시 해당 운동의 세트, 횟수 등 초기화
        setSets((prevSets) => {
            const newSets = { ...prevSets };
            delete newSets[selectedExercises[index]];
            return newSets;
        });

        setReps((prevReps) => {
            const newReps = { ...prevReps };
            delete newReps[selectedExercises[index]];
            return newReps;
        });

        setPrepareTime((prevPrepareTime) => {
            const newPrepareTime = { ...prevPrepareTime };
            delete newPrepareTime[selectedExercises[index]];
            return newPrepareTime;
        });

        setExerciseTime((prevExerciseTime) => {
            const newExerciseTime = { ...prevExerciseTime };
            delete newExerciseTime[selectedExercises[index]];
            return newExerciseTime;
        });

        setRestTime((prevRestTime) => {
            const newRestTime = { ...prevRestTime };
            delete newRestTime[selectedExercises[index]];
            return newRestTime;
        });
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
        console.log(`준비 시간: ${value} `);
    };

    const handleRestTimeChange = (exercise, value) => {
        setRestTime((prevRestTime) => ({ ...prevRestTime, [exercise]: value }));
        console.log(`휴식 시간: ${value}`);
    };

    const handleExerciseTimeChange = (exercise, value) => {
        setExerciseTime((prevExerciseTime) => ({ ...prevExerciseTime, [exercise]: value }));
        console.log(`운동 시간: ${value}`);
    };





    return (

        <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 1)' }}>
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
                                <View style={styles.srcombine}>
                                    <Text style={styles.information}>세트: </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={sets[exercise]}
                                        onChangeText={(value) => handleSetsChange(exercise, value)}
                                    />
                                    <Text style={styles.information}>횟수: </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={reps[exercise]}
                                        onChangeText={(value) => handleRepsChange(exercise, value)}
                                    />
                                </View>
                                <View style={styles.percombine}>
                                    <Text style={styles.information}>준비시간: </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={prepareTime[exercise]}
                                        onChangeText={(value) => handlePrepareTimeChange(exercise, value)}
                                    />
                                    <Text style={styles.information}>운동시간: </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={exerciseTime[exercise]}
                                        onChangeText={(value) => handleExerciseTimeChange(exercise, value)}
                                    />
                                    <Text style={styles.information}>휴식시간:  </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={restTime[exercise]}
                                        onChangeText={(value) => handleRestTimeChange(exercise, value)}
                                    />
                                </View>
                            </View>
                        ))}
                    </ExerciseInformation>
                ) : (
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
                                <View style={styles.srcombine}>
                                    <Text style={styles.information}>세트: </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={sets[exercise]}
                                        onChangeText={(value) => handleSetsChange(exercise, value)}
                                    />
                                    <Text style={styles.information}>횟수: </Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={reps[exercise]}
                                        onChangeText={(value) => handleRepsChange(exercise, value)}
                                    />
                                </View>
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

    );
};

const styles = StyleSheet.create({
    srcombine: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginTop: -20,
    },
    information: {
        color: 'black',

    },
    percombine: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginTop: -45,
    },
});



export default TimeLimit;*/