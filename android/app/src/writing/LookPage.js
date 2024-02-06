import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Text, Image, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TopBar1 } from '../compponents/TopBar';

const LookPage = ({ route, navigation }) => {
  useEffect(() => {
    // 게시글이 변경될 때마다 댓글 상태 초기화
    setComments([]);
  }, [selectedItem]);

  const [selectedItem, setSelectedItem] = useState(route.params.selectedItem);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const paperplane = require("../assets/image/paperplane.png");
  const thumbsup = require("../assets/image/thumbsup.png");
  const messages = require("../assets/image/messages.png");

  const handleThumbsUp = () => {
    const updatedSelectedItem = {
      ...selectedItem,
      like: selectedItem.like + 1,
    };
    setSelectedItem(updatedSelectedItem);
  };

  const handleNameChange = (inputName) => {
    setNickname(inputName);
  };

  const handlePwdChange = (inputPwd) => {
    setPassword(inputPwd);
  };

  const handleTextChange = (inputText) => {
    setComment(inputText);
  };

  const handleCommentDelete = (index) => {
    setDeleteModalVisible(true);
  };

  const handleEditDelete = () => {
    setEditModalVisible(true);
  };

  const handleEditEdit = () => {
    console.log("수정 버튼이 눌렸습니다.");
  };

  const handleSend = () => {
    const newComment = { author: nickname, content: comment };
    setComments([...comments, newComment]);
    setNickname('');
    setPassword('');
    setComment('');
    const updatedSelectedItem = {
      ...selectedItem,
      comments: selectedItem.comments + 1,
    };
  };

  const handleConfirmDelete = () => {
    if (password !== '비밀번호') {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    setDeleteModalVisible(false);
    // 삭제 로직 추가
    const updatedComments = [...comments.slice(0, index), ...comments.slice(index + 1)];
    setComments(updatedComments);
  };

  const handleConfirmEdit = () => {
    if (password !== '비밀번호') {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    setEditModalVisible(false);
    // 수정 로직 추가
  };

  return (
    <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 }}>
      <TopBar1 />
      <ScrollView>
        <View style={[styles.viewcontainer, styles.editdeletecontainer]}>
          <Text style={{ color: 'black' }}>작성자 : {selectedItem.writer}</Text>
          <Text style={{ color: 'black' }}>작성시간 :  {selectedItem.time}</Text>
        </View>

        <View style={[styles.viewcontainer, styles.editdeletecontainer]}>
          <Text style={{ color: 'black', fontWeight: 'bold' }}>{selectedItem.title}</Text>
          <Text style={{ color: 'black' }}>{selectedItem.content}</Text>
          <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={handleThumbsUp}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={thumbsup} style={{ width: 25, height: 25, marginRight: 15 }} />
                  <Text style={{ color: 'black', margin: 5 }}>{selectedItem.like}</Text>
                </View>
              </TouchableOpacity>
              <Image source={messages} style={{ width: 25, height: 25, marginRight: 15 }} />
              <Text style={{ color: 'black' }}>{comments.length}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={handleEditEdit}>
                <View>
                  <Text style={{ color: 'blue' }}>수정</Text>
                </View>
              </TouchableOpacity>
              <Text style={{ color: 'blue', paddingRight: 5, paddingLeft: 5 }}>/</Text>
              <TouchableOpacity onPress={handleEditDelete}>
                <View>
                  <Text style={{ color: 'blue' }}>삭제</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 댓글을 출력하는 부분 */}
        <View style={styles.viewcontainer}>
          {comments.map((item, index) => (
            <View key={index} style={styles.commentContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                  {item.author}
                </Text>

                <TouchableOpacity onPress={() => handleCommentDelete(index)}>
                  <Text style={{ color: 'blue', marginLeft: 10 }}>삭제</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ color: 'black' }}>{item.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 댓글을 작성하는 부분 */}
      <View style={[styles.viewcontainer, { justifyContent: 'flex-end', alignItems: 'center' }]}>
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
          <TextInput
            style={[styles.inputcontainer, { flex: 1 }]}
            onChangeText={handleNameChange}
            value={nickname}
            placeholder="닉네임"
            placeholderTextColor="gray"
          />

          <TextInput
            style={[styles.inputcontainer, { flex: 1 }]}
            onChangeText={handlePwdChange}
            value={password}
            placeholder="비밀번호"
            placeholderTextColor="gray"
          />
        </View>

        <View style={[{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
          <TextInput
            style={[styles.inputcontainer, { flex: 1 }]}
            onChangeText={handleTextChange}
            value={comment}
            placeholder="내용을 입력하세요"
            placeholderTextColor="gray"
          />
          <TouchableOpacity onPress={handleSend}>
            <View style={{ padding: 10, borderRadius: 5 }}>
              <Image source={paperplane} style={{ width: 24.58, height: 22 }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 댓글 삭제를 위한 모달 */}
      <Modal
        visible={deleteModalVisible}
        transparent
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.inputcontainer}
              onChangeText={handlePwdChange}
              value={password}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor="gray"
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleConfirmDelete}>
                <Text style={styles.button}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.button}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 글 수정을 위한 모달 */}
      <Modal
        visible={editModalVisible}
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.inputcontainer}
              onChangeText={handlePwdChange}
              value={password}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor="gray"
             
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.button}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmEdit}>
                <Text style={styles.button}>확인</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  viewcontainer: {
    marginLeft: 25,
    marginRight: 25,
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
  editdeletecontainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    color: 'black',
  },
  commentContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    color: 'white',
  },
});

export default LookPage;
