import React, { useState } from 'react';
import { ScrollView, StatusBar, TouchableOpacity, View, TextInput, Text } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import { theme } from "../compponents/theme";
import { TopBar1 } from "../compponents/TopBar";
import { Button2, Button6 } from "../compponents/Button";
import { DropdownComponent2 } from '../compponents/DropDown';

const Container1 = styled.View`
  background-color: ${({ theme }) => theme.background};
`;

const Container2 = styled.View`
  align-items: center;
`;

const Container3 = styled.View`
  padding-right: 22px;
  align-items: flex-end;
  padding-bottom: 300px;
`;

const Container4 = styled.View`
  padding-bottom: 80px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.solidLine};
`;

const InputRow = styled.View`
  flex-direction: row;
  padding-left: 14px;
  marginBottom: -10px;
`;

const InputLabel = styled.Text`
  font-size: 15px;
  margin-right: 80px;
`;

const InputField = styled.TextInput`
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
`;

const TimeOffButtonContainer = styled(TouchableOpacity)`
  width: 149px;
  height: 30px;
  background-color: rgba(255, 169, 169, 0.28);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const TimeOffButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.9);
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TimeLimitOFF = ({ route }) => {
  const navigation = useNavigation();
  const selectedItems = route.params?.selectedItems || [];

  const navigateToTimeLimitON = () => {
    navigation.navigate('TimeLimitON');
  };
  const navigateToFlatList = () => {
    navigation.navigate('FlatList');
  };
  const [currentInput, setCurrentInput] = useState({
    sets: '',
    reps: '',
  });

  const validateAndSetInput = (inputName, text) => {
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 10) {
      setCurrentInput((prevInput) => ({ ...prevInput, [inputName]: text }));
    } else {
      setCurrentInput((prevInput) => ({ ...prevInput, [inputName]: 'error' }));
    }
  };

  return (
    <ScrollView>
      <ThemeProvider theme={theme}>
        <Container1>
          <TopBar1 />
          <Container2>
            <DropdownComponent2 />
          </Container2>

          <Container3>
            <TimeOffButtonContainer onPress={navigateToTimeLimitON}>
              <TimeOffButtonText>Time Limit OFF</TimeOffButtonText>
            </TimeOffButtonContainer>
          </Container3>

          <Container2>
            <Container4>
              {selectedItems.map((exercise) => (
                <InputContainer key={exercise.id}>
                  <InputLabel>{exercise.title}</InputLabel>
                  <InputRow>
                    <InputField
                      placeholder="횟수 입력"
                      value={currentInput.reps}
                      onChangeText={(text) => {
                        validateAndSetInput('reps', text);
                        setCurrentInput((prevInput) => ({ ...prevInput, reps: text }));
                      }}
                      style={{ fontSize: 15, color: theme.main, marginRight: 80, marginLeft: -4 }}
                      keyboardType="numeric"
                    />
                    <InputField
                      placeholder="세트 입력"
                      value={currentInput.sets}
                      onChangeText={(text) => {
                        validateAndSetInput('sets', text);
                        setCurrentInput((prevInput) => ({ ...prevInput, sets: text }));
                      }}
                      style={{ fontSize: 15, color: theme.main, paddingLeft: -55 }}
                      keyboardType="numeric"
                    />
                  </InputRow>
                </InputContainer>
              ))}
              <TouchableOpacity onPress={navigateToFlatList}>
                <Button6 title={`+ 운동 추가하기 `} />
              </TouchableOpacity>
            </Container4>

            <Button2 title="운동 시작" />
          </Container2>

          <StatusBar backgroundColor="black" />
        </Container1>
      </ThemeProvider>
    </ScrollView>
  );
};

export default TimeLimitOFF;