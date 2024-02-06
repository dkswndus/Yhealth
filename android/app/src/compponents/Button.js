import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, View, } from 'react-native';
import { theme } from '../compponents/theme';

const ExerciseStartContainer = styled(View)`
      width:100%;
      height: 42px;
      background-color: #1A6DFF;
      border-radius: 10px;
      align-items: center;
      justify-content: center;
      margin-top: -30px; 
`;

const ExerciseStartText = styled(Text)`
    font-size: 25px;
    font-weight: bold;
    color: #FFFFFF;

`;

export const ExerciseStart = props => {
    return (
        <ExerciseStartContainer>
            <ExerciseStartText>{props.title}</ExerciseStartText>
        </ExerciseStartContainer>

    );
};


const TimeOnButtonContainer = styled.View`
  width: 149px;
  height: 30px;
  background-color: 'rgba(171, 255, 195, 0.28)' ;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: row;

`;


const TimeOffButtonContainer = styled.View`
  width: 149px;
  height: 30px;
  background-color: rgba(255, 169, 169, 0.28);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: row;

`;

const TimeLimitText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.9);
`;
export const TimeLimitOn = props => {
    return (
        <TimeOnButtonContainer>
            <TimeLimitText>{props.title}</TimeLimitText>
        </TimeOnButtonContainer>
    );
};


export const TimeLimitOff = props => {
    return (
        <TimeOffButtonContainer>
            <TimeLimitText>{props.title}</TimeLimitText>
        </TimeOffButtonContainer>
    );
};


const ExerciseAddText = styled(Text)`
    font-size: 20px;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.9);
    padding-top: 5px;
    padding-right: 12px;


`;

export const ExerciseAdd = props => {
    return (
        <ExerciseAddText>{props.title}</ExerciseAddText>

    );
};












export default { ExerciseStart, ExerciseAdd, TimeLimitOff, TimeLimitOn };