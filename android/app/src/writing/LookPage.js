import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Text, Image, Alert } from 'react-native';
import { TopBar1 } from '../compponents/TopBar';

const LookPage = ({ route, navigation }) => {
  useEffect(() => {
    // 게시글이 변경될 때마다 댓글 상태 초기화
    setComments([]);
  }, [selectedItem]);
  const [selectedItem, setSelectedItem] = useState(route.params.selectedItem); // 게시글 상태 추가
 
  const paperplane = require("../assets/image/paperplane.png");
  const thumbsup = require("../assets/image/thumbsup.png");
  const messages = require("../assets/image/messages.png");
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]); // 댓글을 저장할 상태 변수
  
  const handleThumbsUp = () => {
    // 여기에 좋아요 증가 로직을 추가
    const updatedSelectedItem = {
      ...selectedItem,
      like: selectedItem.like + 1, // 좋아요 수를 1 증가
    };

    // 여기에서 업데이트된 게시글 정보를 AsyncStorage 또는 서버에 저장해야 합니다.

    // 업데이트된 게시글 정보를 상태에 반영
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
  const handleEditDelete = () => {
    // 여기에 삭제 기능을 추가
    // 글 삭제 로직을 추가하세요.
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
              // 삭제할 글의 ID를 기준으로 글 목록에서 해당 글을 제외한 새로운 목록을 생성
              const existingPosts = await AsyncStorage.getItem('posts');
              const posts = existingPosts ? JSON.parse(existingPosts) : [];
              const updatedPosts = posts.filter(post => post.id !== selectedItem.id);

              // 업데이트된 글 목록을 저장
              await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));

              // 삭제 후 게시판 화면으로 이동
              navigation.navigate('BoardPage');
            } catch (error) {
              console.error('글 삭제 중 오류 발생:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditEdit = () => {
    // 여기에 수정 기능을 추가.
    console.log("수정 버튼이 눌렸습니다.");
  };
  const handleSend = () => {
    console.log("전송 버튼이 눌렸습니다.");

    // 전송 로직을 추가하세요.
    // 댓글을 추가할 때마다 comments 상태를 업데이트합니다.
    const newComment = { author: nickname, content: comment };

    setComments([...comments, newComment]);

    // 댓글 작성 후 입력 필드 초기화
    setNickname('');
    setPassword('');
    setComment('');

    // 댓글 수를 업데이트
    const updatedSelectedItem = {
      ...selectedItem,
      comments: selectedItem.comments + 1, // 댓글 수를 1 증가
    };
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
              <Text style={{ color: 'black' }}>
                {item.author}
                {'\n'}
                {item.content}</Text>
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
});

export default LookPage;