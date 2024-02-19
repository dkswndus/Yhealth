import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Text, Image, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { TopBar1 } from '../components/TopBar';
import axios from 'axios'; // axios 추가
import API_URL from './URl';
  
const LookPage = ({ route, navigation }) => {
  const [selectedItem, setSelectedItem] = useState(route.params.selectedItem);
  const [user_id, setuser_id] = useState('');
  const [user_pwd, setuser_pwd] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [ckPwd, setCkPwd] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const paperplane = require("../assets/image/paperplane.png");
  const thumbsup = require("../assets/image/thumbsup.png");
  const messages = require("../assets/image/messages.png");

  useEffect(() => {

    const fetchData = async () => {
      try {
        // 백엔드에서 게시글과 댓글 데이터를 가져오는 요청
        const response = await axios.get(API_URL+'/forum/comments');
        const data = response.data;
        setSelectedItem(data.selectedItem);
        setComments(data.comments);
      } catch (error) {
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    };

    fetchData(); // 함수 호출

    // 마운트 해제 시 cleanup 함수
    return () => {
      // cleanup 코드 작성
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 한 번만 마운트될 때만 실행

  const handleCkPwd = (inputpwd) => {
    setCkPwd(inputpwd);
  };

  const toggleModal = () => {
    if (selectedItem.user_pwd !== ckPwd) {
      Alert.alert('비밀번호가 다릅니다.');
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

  const handleCommentDelete = (index) => {
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
          onPress: () => {
            const updatedComments = [...comments.slice(0, index), ...comments.slice(index + 1)];
            setComments(updatedComments);
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
  

  const handleSend = () => {
    const newComment = { author: user_id, content: comment };
    setComments([...comments, newComment]);
    setuser_id('');
    setuser_pwd('');
    setComment('');
    const updatedSelectedItem = {
      ...selectedItem,
      comments: selectedItem.comments + 1,
    };
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
          <Text style={{ color: 'black', fontWeight: 'bold' }}>{selectedItem.title}</Text>
          <Text style={{ color: 'black' }}>{selectedItem.description}</Text>
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

      {/* 모달 */}
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

// import React, { useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Text, Image, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
// import { TopBar1 } from '../components/TopBar';

// const LookPage = ({ route, navigation }) => {
//   useEffect(() => {
//     // 게시글이 변경될 때마다 댓글 상태 초기화
//     setComments([]);
//   }, [selectedItem]);
//   const [selectedItem, setSelectedItem] = useState(route.params.selectedItem); // 게시글 상태 추가

//   const paperplane = require("../assets/image/paperplane.png");
//   const thumbsup = require("../assets/image/thumbsup.png");
//   const messages = require("../assets/image/messages.png");
//   const [nickname, setNickname] = useState('');
//   const [password, setPassword] = useState('');
//   const [comment, setComment] = useState('');
//   const [comments, setComments] = useState([]); // 댓글을 저장할 상태 변수
//   const [ckPwd, setCkPwd] = useState('');
//   const [isModalVisible, setModalVisible] = useState(false);

//   const handleCkPwd = (inputpwd) => {
//     setCkPwd(inputpwd);
//   };
//   const comparePwd = () => {

//   };
//   const toggleModal = () => {
//     if (selectedItem.pwd != ckPwd){
//       Alert.alert('비밀번호가 다릅니다.')
//       console.log(selectedItem);
//     }else{
//       handleEditDelete();
//       console.log(selectedItem);
//     }
    
//   };
//   const handleThumbsUp = () => {
//     // 여기에 좋아요 증가 로직을 추가
//     const updatedSelectedItem = {
//       ...selectedItem,
//       like: selectedItem.like + 1, // 좋아요 수를 1 증가
//     };


//     // 업데이트된 게시글 정보를 상태에 반영
//     setSelectedItem(updatedSelectedItem);
//   };
//   const handleNameChange = (inputName) => {
//     setNickname(inputName);
//   };
//   const handlePwdChange = (inputPwd) => {
//     setPassword(inputPwd);
//   };
//   const handleTextChange = (inputText) => {
//     setComment(inputText);
//   };
//   const cancelModal = () => {
//     setModalVisible(!isModalVisible);
//   }
//   const handleCommentDelete = (index) => {
//     // 댓글 삭제를 위해 index를 인자로 받습니다.
//     Alert.alert(
//       '댓글 삭제',
//       '정말로 삭제하시겠습니까?',
//       [
//         {
//           text: '취소',
//           style: 'cancel',
//         },
//         {
//           text: '삭제',
//           onPress: () => {
//             // 선택된 인덱스의 댓글을 제외한 새로운 댓글 목록을 생성
//             const updatedComments = [...comments.slice(0, index), ...comments.slice(index + 1)];
//             // 업데이트된 댓글 목록 반영
//             setComments(updatedComments);
//           },
//         },
//       ],
//       { cancelable: false }
//     );
//   };
//   const handleEditDelete = () => {
//     //삭제 기능
//     Alert.alert(
//       '글 삭제',
//       '정말로 삭제하시겠습니까?',
//       [
//         {
//           text: '취소',
//           style: 'cancel',
//         },
//         {
//           text: '삭제',
//           onPress: async () => {
//             try {
//               // 삭제할 글의 ID를 기준으로 글 목록에서 해당 글을 제외한 새로운 목록을 생성
//               const existingPosts = await AsyncStorage.getItem('posts');
//               const posts = existingPosts ? JSON.parse(existingPosts) : [];
//               const updatedPosts = posts.filter(post => post.id !== selectedItem.id);

//               // 업데이트된 글 목록을 저장
//               await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));

//               // 삭제 후 게시판 화면으로 이동
//               navigation.navigate('BoardPage');
//             } catch (error) {
//               console.error('글 삭제 중 오류 발생:', error);
//             }
//           },
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   const handleEditEdit = () => {
//     console.log("수정 버튼이 눌렸습니다.");
//   };
//   const handleSend = () => {
//     console.log("전송 버튼이 눌렸습니다.");

//     // 전송 로직을 추가하세요.
//     // 댓글을 추가할 때마다 comments 상태를 업데이트합니다.
//     const newComment = { author: nickname, content: comment };

//     setComments([...comments, newComment]);

//     // 댓글 작성 후 입력 필드 초기화
//     setNickname('');
//     setPassword('');
//     setComment('');

//     // 댓글 수를 업데이트
//     const updatedSelectedItem = {
//       ...selectedItem,
//       comments: selectedItem.comments + 1, // 댓글 수를 1 증가
//     };
//   };

//   return (
//     <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 }}>
//       <TopBar1 />
//       <ScrollView>
//         <View style={[styles.viewcontainer, styles.editdeletecontainer]}>
//           <Text style={{ color: 'black' }}>작성자 : {selectedItem.nickname}</Text>
//           <Text style={{ color: 'black' }}>작성시간 :  {selectedItem.time}</Text>
//         </View>

//         <View style={[styles.viewcontainer, styles.editdeletecontainer]}>
//           <Text style={{ color: 'black', fontWeight: 'bold' }}>{selectedItem.title}</Text>
//           <Text style={{ color: 'black' }}>{selectedItem.text}</Text>
//           <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
//             <View style={{ flexDirection: 'row' }}>
//               <TouchableOpacity onPress={handleThumbsUp}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                   <Image source={thumbsup} style={{ width: 25, height: 25, marginRight: 15 }} />
//                   <Text style={{ color: 'black', margin: 5 }}>{selectedItem.like}</Text>
//                 </View>
//               </TouchableOpacity>
//               <Image source={messages} style={{ width: 25, height: 25, marginRight: 15 }} />
//               <Text style={{ color: 'black' }}>{comments.length}</Text>
//             </View>
//             <View style={{ flexDirection: 'row' }}>
//               {/* <TouchableOpacity onPress={handleEditEdit}>
//                 <View>
//                   <Text style={{ color: 'blue' }}>수정</Text>
//                 </View>
//               </TouchableOpacity>
//               <Text style={{ color: 'blue', paddingRight: 5, paddingLeft: 5 }}>/</Text> */}
//               <TouchableOpacity onPress={cancelModal}>
//                 <View>
//                   <Text style={{ color: 'blue' }}>삭제</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* 댓글을 출력하는 부분 */}
//         <View style={styles.viewcontainer}>
//           {comments.map((item, index) => (
//             <View key={index} style={styles.commentContainer}>
//               <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                 <Text style={{ color: 'black', fontWeight: 'bold' }}>
//                   {item.author}
//                 </Text>

//                 <TouchableOpacity onPress={() => handleCommentDelete(index)}>
//                   <Text style={{ color: 'blue', marginLeft: 10 }}>삭제</Text>
//                 </TouchableOpacity>
//               </View>
//               <Text style={{ color: 'black' }}>{item.content}</Text>
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       {/* 댓글을 작성하는 부분 */}
//       <View style={[styles.viewcontainer, { justifyContent: 'flex-end', alignItems: 'center' }]}>
//         <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
//           <TextInput
//             style={[styles.inputcontainer, { flex: 1 }]}
//             onChangeText={handleNameChange}
//             value={nickname}
//             placeholder="닉네임"
//             placeholderTextColor="gray"
//           />

//           <TextInput
//             style={[styles.inputcontainer, { flex: 1 }]}
//             onChangeText={handlePwdChange}
//             value={password}
//             placeholder="비밀번호"
//             placeholderTextColor="gray"
//           />
//         </View>

//         <View style={[{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
//           <TextInput
//             style={[styles.inputcontainer, { flex: 1 }]}
//             onChangeText={handleTextChange}
//             value={comment}
//             placeholder="내용을 입력하세요"
//             placeholderTextColor="gray"
//           />
//           <TouchableOpacity onPress={handleSend}>
//             <View style={{ padding: 10, borderRadius: 5 }}>
//               <Image source={paperplane} style={{ width: 24.58, height: 22 }} />
//             </View>
//           </TouchableOpacity>
//         </View>

//       </View>

//       {/* 모달 */}
//       <Modal visible={isModalVisible} animationType="slide" transparent={true}>
//         <TouchableWithoutFeedback onPress={toggleModal}>
//           <View style={styles.modalContainer}>
//             <TouchableWithoutFeedback onPress={() => { }}>
//               <View style={styles.modalContent}>
//                 <View>
//                   <TextInput
//                     style={styles.inputcontainer}
//                     onChangeText={handleCkPwd}
//                     value={ckPwd}
//                     placeholder="글 비밀번호"
//                     placeholderTextColor="gray"
//                   />
//                 </View>

//                 <View style={{ padding: 10, flexDirection: 'row' }}>
//                   <TouchableOpacity style={styles.buttonStyle} onPress={cancelModal}>
//                     <Text style={{ color: 'white', textAlign: 'center' }}>취소</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.buttonStyle} onPress={toggleModal}>
//                     <Text style={{ color: 'white', textAlign: 'center' }}>확인</Text>
//                   </TouchableOpacity>
//                 </View>

//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   viewcontainer: {
//     marginLeft: 25,
//     marginRight: 25,
//   },
//   inputcontainer: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 5,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     color: 'black',
//   },
//   editdeletecontainer: {
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 5,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     color: 'black',
//   },
//   titlecontentcontainer: {
//     height: 200,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 5,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     color: 'black',
//   },
//   commentContainer: {
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 5,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     color: 'black',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     elevation: 5,
//   },
//   buttonStyle: {
//     height: 40,
//     width: '50%',
//     borderRadius: 10,
//     backgroundColor: '#1A6DFF',
//     padding: 10,
//   },
// });

// export default LookPage;