import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { css } from 'styled-components';
import { TextInput } from 'react-native';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GeneralGymScroll } from '../scrollview/ScrollView';
import { FlatList } from 'react-native';
const thumbsup = require("../assets/image/thumbsup.png")
const messages = require("../assets/image/messages.png")


const paperplane = require("../assets/image/paperplane.png")

const ellipsis = require("../assets/image/ellipsis.png")


//작성한 게시글 
const StyledInput5Container = styled.View`
  width: 365px;
  height: 145px;
  border-radius: 10px;
`;

const StyledInput5 = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.main,
}))`
  width: 100%;
  height: 100%;
  font-size: 15px;
  font-weight: normal;
  padding-left: 14px;
`;

const IconContainer = styled.View`
  flex-direction: row;

  left: 14px;
  bottom: 10px; 

`;

const Input5 = ({ placeholder }) => {
  const width = Dimensions.get('window').width;
  return (
    <StyledInput5Container>
      <StyledInput5 width={width} placeholder={placeholder} maxLength={50} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <IconContainer>
          <Image source={thumbsup} style={{ width: 25, height: 25, marginRight: 30 }} />
          <Image source={messages} style={{ width: 25, height: 25 }} />
        </IconContainer>
        <Text> 수정 | 삭제</Text>
      </View>
    </StyledInput5Container>
  );
};





// 게시글 댓글 
const StyledInput6 = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.main,
}))`
width: 365px;
height: 209px;
border-radius: 10px;
background-color: ${({ theme }) => theme.itemBackground};
font-weight: bold;
font-weight: normal;
padding-left:14px;
margin-bottom: 10px;
padding-bottom: 26px;

`;
const Input6 = ({ placeholder }) => {
  const width = Dimensions.get('window').width;
  return <StyledInput6 width={width} placeholder={placeholder} maxLength={50} />
};





// 닉네임, 비밀번호, 댓글 입력
const StyledInput7Container = styled.View`
width: 182.5px;
height: 40px;
background-color: ${({ theme }) => theme.itemBackground};
border-right-width: 1px; 
border-right-color: ${({ theme }) => theme.solidLine};
`;
const StyledInput8Container = styled.View`
width: 182.5px;
height: 40px;
background-color: ${({ theme }) => theme.itemBackground};


`;
const RowContainer1 = styled.View`
flex-direction: row;

`;
const StyledInput9Container = styled.View`
  width: 365px;
  height: 40px;
  background-color: ${({ theme }) => theme.itemBackground};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.solidLine};
  flex-direction: row;
  align-items: center;
  justify-content: space-between; 
  padding-right: 12px; 
`;
const RowContainer2 = styled.View`
  align-items: center;
  flex-direction: row;

`;

const Input7 = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');

  const styles = {
    TextInputStyle: {
      fontSize: 15,
      fontWeight: 'normal',
      paddingLeft: 20,
      paddingRight: 20,

    },
  };

  return (
    <>
      <RowContainer1>
        <StyledInput7Container>
          <TextInput
            style={styles.TextInputStyle}
            placeholder="닉네임 "
            value={nickname}
            onChangeText={(text) => setNickname(text)}
          />
        </StyledInput7Container>

        <StyledInput8Container>
          <TextInput
            style={styles.TextInputStyle}
            placeholder="비밀번호 "
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </StyledInput8Container>
      </RowContainer1>

      <RowContainer2>
        <StyledInput9Container>
          <TextInput
            style={styles.TextInputStyle}
            placeholder="댓글을 입력하세요 "
            value={comment}
            onChangeText={(text) => setComment(text)}
          />
          <Image source={paperplane} style={{ width: 24.58, height: 22 }} />
        </StyledInput9Container>
      </RowContainer2>
    </>
  );
};











export { Input5, Input6, Input7 };