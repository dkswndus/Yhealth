import React, { useState, useEffect, useRef } from 'react';
import { Picker } from '@react-native-picker/picker';
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
import { setsState, repsState, prepareTimeState, exerciseTimeState, restTimeState, exerciseLikesState, isTimeLimitOnState, selectedExercisesState, dropdownValueState, likedExercisesState, } from './Recoil';
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

const TimePicker = ({ time, onTimeChange, type }) => {
    const minutes = Array.from({ length: 60 }, (_, index) => index.toString().padStart(2, '0'));
    const seconds = Array.from({ length: 60 }, (_, index) => index.toString().padStart(2, '0'));

    const handleMinuteChange = (itemValue) => {
        const selectedMinutes = parseInt(itemValue);
        const selectedSeconds = parseInt(time.seconds);
        if (selectedMinutes === 0 && selectedSeconds < 10) {
            Alert.alert('경고', '10초 이상으로 선택해주세요.');
            return;
        }
        onTimeChange('minutes', itemValue, type);
    };

    const handleSecondChange = (itemValue) => {
        const selectedMinutes = parseInt(time.minutes);
        const selectedSeconds = parseInt(itemValue);
        if (selectedMinutes === 0 && selectedSeconds < 10) {
            Alert.alert('경고', '10초 이상으로 선택해주세요.');
            return;
        }
        onTimeChange('seconds', itemValue, type);
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Picker
                style={{ flex: 0.4 }}
                selectedValue={time.minutes}
                onValueChange={handleMinuteChange}
            >
                {minutes.map((minute) => <Picker.Item key={minute} label={minute} value={minute} />)}
            </Picker>
            <Text style={{ color: 'black' }}>분</Text>
            <Text style={{ color: 'black' }}>    :   </Text>
            <Picker
                style={{ flex: 0.4 }}
                selectedValue={time.seconds}
                onValueChange={handleSecondChange}
            >
                {seconds.map((second) => <Picker.Item key={second} label={second} value={second} />)}
            </Picker>
            <Text style={{ color: 'black' }}>초</Text>
        </View>
    );

};

const TimeLimit = ({ route }) => {
    const navigation = useNavigation();
    const [dropdownValue, setDropdownValue] = useRecoilState(dropdownValueState);
    const prevDropdownValue = useRef(dropdownValue);
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
    const time = "0초";
    const [initialSets, setInitialSets] = useState("3");
    const [initialReps, setInitialReps] = useState("25");

    useEffect(() => {
        // 드롭다운 값이 변경되면 실행되는 부분
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
        setDropdownValue(dropdownValue);
    }, [selectedExercises, dropdownValue]);


    const navigateToNextStopWatch = () => {
        if (!dropdownValue || (dropdownValue !== '1' && dropdownValue !== '2')) {
            Alert.alert('오류', '장소를 선택하세요.');
            return;
        }

        if (selectedExercises.length === 0) {
            Alert.alert('오류', '운동을 선택하세요.');
            return;
        }
        const exerciseInfoOn = selectedExercises.map(exercise => {
            const prepareMinutes = parseInt(prepareTime[exercise].minutes);
            const prepareSeconds = parseInt(prepareTime[exercise].seconds);
            const exerciseMinutes = parseInt(exerciseTime[exercise].minutes);
            const exerciseSeconds = parseInt(exerciseTime[exercise].seconds);
            const restMinutes = parseInt(restTime[exercise].minutes);
            const restSeconds = parseInt(restTime[exercise].seconds);

            const prepareTimeInSeconds = prepareMinutes * 60 + prepareSeconds;
            const exerciseTimeInSeconds = exerciseMinutes * 60 + exerciseSeconds;
            const restTimeInSeconds = restMinutes * 60 + restSeconds;

            const totalExerciseSeconds = (exerciseMinutes * 60 + exerciseSeconds) * sets[exercise];
            const totalExerciseMinutes = Math.floor(totalExerciseSeconds / 60);
            const totalExerciseRemainingSeconds = totalExerciseSeconds % 60;

            return {
                name: exercise,
                sets: sets[exercise],
                reps: reps[exercise],
                prepareTime: { minutes: prepareMinutes, seconds: prepareSeconds },
                exerciseTime: { minutes: exerciseMinutes, seconds: exerciseSeconds },
                totalExerciseTime: { minutes: totalExerciseMinutes, seconds: totalExerciseRemainingSeconds },
                restTime: { minutes: restMinutes, seconds: restSeconds },
                prepareTimeInSeconds: `${prepareTimeInSeconds}`,
                exerciseTimeInSeconds: `${exerciseTimeInSeconds}`,
                restTimeInSeconds: `${restTimeInSeconds}`,
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
        const updatedExerciseOrder = [...exerciseOrder];
        updatedExerciseOrder.splice(index, 1); // 해당 인덱스의 운동을 배열에서 제거

        setExerciseOrder(updatedExerciseOrder); // 운동 순서 업데이트
    };








    const moveExerciseUp = (index) => {
        if (index === 0) return; // 운동이 첫 번째 항목이면 위로 이동할 수 없음
        const updatedExerciseOrder = [...exerciseOrder];
        const tempExercise = updatedExerciseOrder[index]; // 선택한 운동을 저장
        updatedExerciseOrder[index] = updatedExerciseOrder[index - 1]; // 선택한 운동을 한 칸 위로 이동
        updatedExerciseOrder[index - 1] = tempExercise; // 이전 운동 위치에 저장된 운동을 넣음

        setExerciseOrder(updatedExerciseOrder);
    };

    const moveExerciseDown = (index) => {
        if (index === exerciseOrder.length - 1) return; // 운동이 마지막 항목이면 아래로 이동할 수 없음
        const updatedExerciseOrder = [...exerciseOrder];
        const tempExercise = updatedExerciseOrder[index]; // 선택한 운동을 저장
        updatedExerciseOrder[index] = updatedExerciseOrder[index + 1]; // 선택한 운동을 한 칸 아래로 이동
        updatedExerciseOrder[index + 1] = tempExercise; // 다음 운동 위치에 저장된 운동을 넣음

        setExerciseOrder(updatedExerciseOrder);
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
        setInitialSets(value);
    };

    const handleRepsChange = (exercise, value) => {
        setReps((prevReps) => ({ ...prevReps, [exercise]: value }));
        setInitialReps(value);
    };

    const handlePrepareTimeChange = (exercise, field, value) => {
        setPrepareTime((prevPrepareTime) => ({
            ...prevPrepareTime,
            [exercise]: {
                ...prevPrepareTime[exercise],
                [field]: value,
            },
        }));
    };

    const handleExerciseTimeChange = (exercise, field, value) => {
        setExerciseTime((prevExerciseTime) => ({
            ...prevExerciseTime,
            [exercise]: {
                ...prevExerciseTime[exercise],
                [field]: value,
            },
        }));
    };

    const handleRestTimeChange = (exercise, field, value) => {
        setRestTime((prevRestTime) => ({
            ...prevRestTime,
            [exercise]: {
                ...prevRestTime[exercise],
                [field]: value,
            },
        }));
    };

    const initialSetsValue = "3";
    const initialRepsValue = "25";
    const initialPrepareTime = { minutes: "00", seconds: "10" };
    const initialExerciseTime = { minutes: "01", seconds: "00" };
    const initialRestTime = { minutes: "00", seconds: "10" };
    useEffect(() => {
        setSets((prevSets) => {
            const newSets = {};
            selectedExercises.forEach((exercise) => {
                newSets[exercise] = initialSetsValue;
            });
            return { ...prevSets, ...newSets };
        });

        setReps((prevReps) => {
            const newReps = {};
            selectedExercises.forEach((exercise) => {
                newReps[exercise] = initialRepsValue;
            });
            return { ...prevReps, ...newReps };
        });
        setPrepareTime((prevPrepareTime) => {
            const newPrepareTime = {};
            selectedExercises.forEach((exercise) => {
                newPrepareTime[exercise] = initialPrepareTime;
            });
            return { ...prevPrepareTime, ...newPrepareTime };
        });
        setExerciseTime((prevExerciseTime) => {
            const newExerciseTime = {};
            selectedExercises.forEach((exercise) => {
                newExerciseTime[exercise] = initialExerciseTime;
            });
            return { ...prevExerciseTime, ...newExerciseTime };
        });
        setRestTime((prevRestTime) => {
            const newRestTime = {};
            selectedExercises.forEach((exercise) => {
                newRestTime[exercise] = initialRestTime;
            });
            return { ...prevRestTime, ...newRestTime };
        });
    }, [selectedExercises, setSets, setReps, setExerciseTime, setPrepareTime, setRestTime]);


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
                                <View style={styles.combine}>
                                    <Text style={styles.information}>  세트 :</Text>

                                    <Picker
                                        selectedValue={sets[exercise]}
                                        onValueChange={(value) => handleSetsChange(exercise, value)}
                                        style={{ flex: 0.4 }}
                                    >
                                        {Array.from({ length: 99 }, (_, index) => index + 1).map((value) => (
                                            <Picker.Item key={value} label={value.toString()} value={value.toString()} />
                                        ))}
                                    </Picker>
                                    <Text style={styles.information}> 횟수 :  </Text>
                                    <Picker
                                        selectedValue={reps[exercise]}
                                        onValueChange={(value) => handleRepsChange(exercise, value)}
                                        style={{ flex: 0.4 }}
                                    >
                                        {Array.from({ length: 99 }, (_, index) => index + 1).map((value) => (
                                            <Picker.Item key={value} label={value.toString()} value={value.toString()} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={styles.srcombine}>
                                    <Text style={styles.information}>준비시간:</Text>
                                    <TimePicker
                                        time={prepareTime[exercise] || initialPrepareTime}
                                        onTimeChange={(field, value) => handlePrepareTimeChange(exercise, field, value)}
                                    />

                                </View>
                                <View style={styles.srcombine}>
                                    <Text style={styles.information}>운동시간:</Text>
                                    <TimePicker
                                        time={exerciseTime[exercise] || initialExerciseTime}
                                        onTimeChange={(field, value) => handleExerciseTimeChange(exercise, field, value)}
                                    />
                                </View>
                                <View style={styles.srcombine}>
                                    <Text style={styles.information}>휴식시간:</Text>
                                    <TimePicker
                                        time={restTime[exercise] || initialRestTime}
                                        onTimeChange={(field, value) => handleRestTimeChange(exercise, field, value)}
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
                                <View style={styles.combine}>
                                    <Text style={styles.information}>세트:</Text>
                                    <Picker
                                        selectedValue={sets[exercise]}
                                        onValueChange={(value) => handleSetsChange(exercise, value)}
                                        style={{ flex: 0.5 }}>
                                        {Array.from({ length: 99 }, (_, index) => index + 1).map((value) => (
                                            <Picker.Item key={value} label={value.toString()} value={value.toString()} />
                                        ))}
                                    </Picker>
                                    <Text style={styles.information}>횟수:</Text>
                                    <Picker
                                        selectedValue={reps[exercise]}
                                        onValueChange={(value) => handleRepsChange(exercise, value)}
                                        style={{ flex: 0.5 }}>
                                        {Array.from({ length: 99 }, (_, index) => index + 1).map((value) => (
                                            <Picker.Item key={value} label={value.toString()} value={value.toString()} />
                                        ))}
                                    </Picker>
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
        flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: -25
    },
    pcombine: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: -25
    },
    information: {
        color: 'black',

    },
    combine: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: -15,
        marginBottom: -10,

    },
});



export default TimeLimit;