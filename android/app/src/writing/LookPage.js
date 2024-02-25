import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Text, Image, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { TopBar1 } from '../components/TopBar';
import axios from 'axios'; // axios 추가
import API_URL from './URl';

const LookPage = ({ route, navigation }) => {
  const [selectedItem, setSelectedItem] = useState(route.params.selectedItem);
  const [user_id, setuser_id] = useState(route.params?.initialNickname || '익명');
  const [user_pwd, setuser_pwd] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [ckPwd, setCkPwd] = useState('');
  const [commentId, setCommentId] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleC, setModalVisibleC] = useState(false);
  const paperplane = require("../assets/image/paperplane.png");
  const thumbsup = require("../assets/image/thumbsup.png");
  const messages = require("../assets/image/messages.png");

  useEffect(() => {

    fetchData(); // 함수 호출

    // 마운트 해제 시 cleanup 함수
    return () => {
      // cleanup 코드 작성
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 한 번만 마운트될 때만 실행

  const fetchData = async () => {
    try {
      const itemId = selectedItem.id;
      const response = await axios.get(`${API_URL}/comment/${itemId}`);

      const commentdata = response.data; // 서버에서 받아온 데이터

      setComments(commentdata);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // 404 오류 처리: 댓글이 없는 경우
        setComments([]); // 빈 배열로 설정하여 댓글이 없음을 표시
      } else {
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    }
  };

  const handleCkPwd = (inputpwd) => {
    setCkPwd(inputpwd);
  };

  const toggleModal = () => {
    if (selectedItem.user_pwd !== ckPwd) {
      Alert.alert('비밀번호가 다릅니다.');
      return
    } else {

      handleEditDelete();
    }
  };

  const handleThumbsUp = () => {
    const updatedSelectedItem = {
      ...selectedItem,
      like: selectedItem.like + 1,
    };
    setSelectedItem(updatedSelectedItem);
  };

  const handleNameChange = (inputName) => {
    setuser_id(inputName);
  };

  const handlePwdChange = (inputPwd) => {
    setuser_pwd(inputPwd);
  };

  const handleTextChange = (inputText) => {
    setComment(inputText);
  };

  const cancelModal = () => {
    setModalVisible(!isModalVisible);
  };

  // const handleCommentDelete = (index) => {
  //   Alert.alert(
  //     '댓글 삭제',
  //     '정말로 삭제하시겠습니까?',
  //     [
  //       {
  //         text: '취소',
  //         style: 'cancel',
  //       },
  //       {
  //         text: '삭제',
  //         onPress: () => {
  //           const updatedComments = [...comments.slice(0, index), ...comments.slice(index + 1)];
  //           setComments(updatedComments);
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };

  const handleCommentDelete = async () => {
    if (commentId.user_pwd !== ckPwd) {
      Alert.alert('비밀번호가 다릅니다.');
      return
    }
    Alert.alert(
      '댓글 삭제',
      '정말로 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: async () => {
            try {
              const response = await axios.delete(`${API_URL}/comment/${commentId.id}`, {
                withCredentials: true,
              });
              console.log('댓글 삭제 성공:', response.data);
              // 삭제 후에 필요한 작업 수행
              setModalVisibleC(false);
              setCkPwd('');
              fetchData();
            } catch (error) {
              console.error('댓글 삭제 중 오류 발생:', error);
              // 오류 처리
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditDelete = async () => {
    Alert.alert(
      '글 삭제',
      '정말로 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: async () => {
            try {
              const response = await axios.delete(`${API_URL}/forum/${selectedItem.id}`, {
                withCredentials: true,
              });
              console.log('글 삭제 성공:', response.data);
              navigation.navigate('BoardPage');
            } catch (error) {
              console.error('글 삭제 중 오류 발생:', error);
              // 오류 처리
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  // const handleSend = () => {
  //   const newComment = { author: user_id, content: comment };
  //   setComments([...comments, newComment]);
  //   setuser_id('');
  //   setuser_pwd('');
  //   setComment('');
  //   const updatedSelectedItem = {
  //     ...selectedItem,
  //     comments: selectedItem.comments + 1,
  //   };
  // };

  const handleSend = async () => {

    if (user_id.trim() === '') {
      alert('닉네임을 입력하세요.');
      return;
    } else if (user_pwd.length < 4) {
      alert('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    } else if (comment.trim() === '') {
      alert('글을 입력하세요.');
      return;
    } else {
      try {
        // 댓글 데이터 생성
        const newCommentData = {
          user_id: user_id,
          description: comment,
          user_pwd: user_pwd,
          forum_id: selectedItem.id,
          // 다른 필요한 데이터도 추가할 수 있음
        };

        // 서버에 POST 요청 보내기
        const response = await axios.post(`${API_URL}/comment/`, newCommentData);

        // 서버로부터 응답 받은 데이터 사용
        const newComment = response.data;

        // 기존 댓글 리스트에 새로운 댓글 추가
        setComments([...comments, newComment]);

        // 입력 필드 초기화
        setuser_id('');
        setComment('');
        setuser_pwd('');
        fetchData();
      } catch (error) {
        console.error('댓글 보내기 중 오류 발생:', error);
      }
    }
  };

  const clearNickname = () => {
    setuser_id('');
  };

  const formatDateString = (dateString) => {
    // 날짜 문자열에서 요일 부분 제거
    const dateWithoutDay = new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
    return dateWithoutDay;
  };
  return (
    <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 }}>
      <TopBar1 />
      <ScrollView>
        <View style={[styles.viewcontainer, styles.editdeletecontainer]}>
          <Text style={{ color: 'black' }}>작성자 : {selectedItem.user_id}</Text>
          <Text style={{ color: 'black' }}>작성시간 :  {formatDateString(selectedItem.created_at)}</Text>
        </View>

        <View style={[styles.viewcontainer, styles.editdeletecontainer]}>
          <Text style={{fontSize:20 , color: 'black', fontWeight: 'bold' }}>{selectedItem.title}</Text>
          <Text style={{fontSize:17 , color: 'black' }}>{selectedItem.description}</Text>
          <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              {/* <TouchableOpacity onPress={handleThumbsUp}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={thumbsup} style={{ width: 25, height: 25, marginRight: 15 }} />
                  <Text style={{ color: 'black', margin: 5 }}>{selectedItem.like}</Text>
                </View>
              </TouchableOpacity> */}
              <Image source={messages} style={{ width: 25, height: 25, marginRight: 15 }} />
              <Text style={{ color: 'black' }}>{comments.length}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={cancelModal}>
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
                <Text style={{fontSize:17 ,color: 'black', fontWeight: 'bold' }}>
                  {item.user_id}
                </Text>

                <TouchableOpacity onPress={() => {setCommentId(item);setModalVisibleC(true);}}>
                  <Text style={{ color: 'blue', marginLeft: 10 }}>삭제</Text>
                </TouchableOpacity>
              </View>
              <Text style={{fontSize:15 , color: 'black' }}>{item.description}</Text>
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
            onFocus={clearNickname}
            value={user_id}
            placeholder="닉네임"
            placeholderTextColor="gray"
          />

          <TextInput
            style={[styles.inputcontainer, { flex: 1 }]}
            onChangeText={handlePwdChange}
            value={user_pwd}
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

      {/*글 모달 */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalContent}>
                <View>
                  <TextInput
                    style={styles.inputcontainer}
                    onChangeText={handleCkPwd}
                    value={ckPwd}
                    placeholder="글 비밀번호"
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

      {/*댓글 모달 */}
      <Modal visible={isModalVisibleC} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={handleCommentDelete}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalContent}>
                <View>
                  <TextInput
                    style={styles.inputcontainer}
                    onChangeText={handleCkPwd}
                    value={ckPwd}
                    placeholder="댓글 비밀번호"
                    placeholderTextColor="gray"
                  />
                </View>

                <View style={{ padding: 10, flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.buttonStyle} onPress={() => {setModalVisibleC(false);}}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonStyle} onPress={handleCommentDelete}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>확인</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  titlecontentcontainer: {
    height: 200,
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
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  buttonStyle: {
    height: 40,
    width: '50%',
    borderRadius: 10,
    backgroundColor: '#1A6DFF',
    padding: 10,
  },
});

export default LookPage;