import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TopBar1 } from '../components/TopBar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // axios 추가
import API_URL from './URl';

const Writepage = ({ route }) => {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setdescription] = useState('');
  const [user_id, setName] = useState(route.params?.initialNickname || '익명');
  const [user_pwd, setuser_pwd] = useState('');
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleNameChange = (inputName) => {
    setName(inputName);
  };

  const handleuser_pwdChange = (inputPwd) => {
    setuser_pwd(inputPwd);
  };

  const handleTitleChange = (inputTitle) => {
    setTitle(inputTitle);
  };

  const handledescriptionChange = (inputdescription) => {
    setdescription(inputdescription);
  };

  const clearNickname = () => {
    setName('');
  };

  const canclehandleButtonPress = () => {
    navigation.goBack();
  };

  const cancelModal = () => {
    setModalVisible(!isModalVisible);
  }

  const toggleModal = async () => {




    setModalVisible(!isModalVisible);
    if (title.trim() === '') {
      alert('제목을 입력하세요.');
      return;
    } else if (description.trim() === '') {
      alert('내용을 입력하세요.');
      return;
    }
    if (!isModalVisible) {
      // 모달이 꺼져있을 때

    } else {
      // 모달이 켜져있을 때
      if (user_id.trim() === '') {
        alert('닉네임을 입력하세요.');
        return;
      } else if (user_pwd.length < 4) {
        alert('비밀번호는 최소 4자리 이상이어야 합니다.');
        return;
      }
      try {
        const post = {
          title,
          description,
          user_id,
          user_pwd,
        };

        // axios를 사용하여 백엔드에 글 생성 요청 보내기
        const response = await axios.post(API_URL + '/forum/', post,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
        navigation.goBack(); // 성공 시 화면 이동

      } catch (error) {
        console.error('글 생성 중 오류 발생:', error);
        alert('글 생성 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={canclehandleButtonPress}>
      <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 }}>
        <TopBar1 />
        <View style={styles.viewcontainer}>
          <TextInput
            style={styles.inputcontainer}
            onChangeText={handleTitleChange}
            value={title}
            placeholder="제목을 입력하세요"
            placeholderTextColor="gray"
          />
        </View>
        <View style={[styles.viewcontainer, { flex: 1 }]}>
          <TextInput
            style={[styles.inputcontainer, { flex: 1, textAlignVertical: 'top' }]}
            onChangeText={handledescriptionChange}
            value={description}
            multiline={true}
            placeholder="내용을 입력하세요"
            placeholderTextColor="gray"
          />
        </View>

        <View style={{ padding: 10, flexDirection: 'row' }}>
          <TouchableOpacity style={styles.buttonStyle} onPress={canclehandleButtonPress}>
            <Text style={{ color: 'white', textAlign: 'center' }}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={toggleModal}>
            <Text style={{ color: 'white', textAlign: 'center' }}>확인</Text>
          </TouchableOpacity>
        </View>

        {/* 모달 */}
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={() => { }}>
                <View style={styles.modalContent}>
                  <View>
                    <TextInput
                      style={styles.inputcontainer}
                      onChangeText={handleNameChange}
                      onFocus={clearNickname}
                      value={user_id}
                      placeholder="닉네임"
                      placeholderTextColor="gray"
                    />
                    <TextInput
                      style={styles.inputcontainer}
                      onChangeText={handleuser_pwdChange}
                      value={user_pwd}
                      placeholder="비밀번호"
                      placeholderTextColor="gray"
                    />
                  </View>

                  <View style={{ padding: 10, flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={cancelModal}>
                      <Text style={{ color: 'white', textAlign: 'center' }}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={toggleModal}>
                      <Text style={{ color: 'white', textAlign: 'center' }}>확인</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  viewcontainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputcontainer: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    color: 'black',
  },
  buttonStyle: {
    height: 40,
    width: '50%',
    borderRadius: 10,
    backgroundColor: '#1A6DFF',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default Writepage;
