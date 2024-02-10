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
  const [text, setText] = useState('');
  const [nickname, setName] = useState(route.params?.initialNickname || '익명');
  const [pwd, setPwd] = useState('');
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleNameChange = (inputName) => {
    setName(inputName);
  };

  const handlePwdChange = (inputPwd) => {
    setPwd(inputPwd);
  };

  const handleTitleChange = (inputTitle) => {
    setTitle(inputTitle);
  };

  const handleTextChange = (inputText) => {
    setText(inputText);
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

    if (!isModalVisible) {
      // 모달이 꺼져있을 때

    } else {
      // 모달이 켜져있을 때
      if (nickname.trim() === '') {
        alert('닉네임을 입력하세요.');
        return;
      } else if (pwd.length < 4) {
        alert('비밀번호는 최소 4자리 이상이어야 합니다.');
        return;
      }
      try {
        const post = {
          title,
          text,
          nickname,
          pwd,
          time: new Date().toLocaleString(),
          like: 0,
        };

        // axios를 사용하여 백엔드에 글 생성 요청 보내기
        const response = await axios.post(API_URL, post);
        console.log('글 생성 성공:', response.data);

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
            style={[styles.inputcontainer, { flex: 1 }]}
            onChangeText={handleTextChange}
            value={text}
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
                      value={nickname}
                      placeholder="닉네임"
                      placeholderTextColor="gray"
                    />
                    <TextInput
                      style={styles.inputcontainer}
                      onChangeText={handlePwdChange}
                      value={pwd}
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

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { TopBar1 } from '../components/TopBar';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';

// const Writepage = ({ route }) => {
//   const navigation = useNavigation();

//   const [title, setTitle] = useState('');
//   const [text, setText] = useState('');
//   const [nickname, setName] = useState(route.params?.initialNickname || '익명');
//   const [pwd, setPwd] = useState('');
//   const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);
//   const [isModalVisible, setModalVisible] = useState(false);


//   const handleNameChange = (inputName) => {
//     setName(inputName);
//   };

//   const handlePwdChange = (inputPwd) => {
//     setPwd(inputPwd);
//   };

//   const handleTitleChange = (inputTitle) => {
//     setTitle(inputTitle);
//   };

//   const handleTextChange = (inputText) => {
//     setText(inputText);
//   };

//   const clearNickname = () => {
//     setName('');
//   };

//   const canclehandleButtonPress = () => {
//     navigation.goBack();
//   };

//   // const OKhandleButtonPress = () => {
//   //   // 제목과 내용이 둘 다 빈 칸이면 메시지를 띄움
//   //   if (title.trim() === '' || text.trim() === '') {
//   //     alert('제목과 내용을 입력하세요.');
//   //   } else {
//   //     toggleModal();
//   //   }
//   // };
//   const cancelModal = () => {
//     setModalVisible(!isModalVisible);
//   }
//   const toggleModal = async () => {
//     setModalVisible(!isModalVisible);

//     if (!isModalVisible) {
//       // 모달이 꺼져있을 때

//     } else {
//       // 모달이 켜져있을 때
//       if (nickname.trim() === '') {
//         alert('닉네임을 입력하세요.');
//        return;
//       } else if (pwd.length < 4) {
//         alert('비밀번호는 최소 4자리 이상이어야 합니다.');
//         return;
//       }
//       try {
//         const post = {
//           id: new Date().getTime().toString(),
//           title,
//           text,
//           nickname,
//           pwd,
//           time: new Date().toLocaleString(), // 작성 시간 추가
//           like: 0, // 추천 수 초기값
//         };

//         //     const response = await fetch('https://your-backend-url.com/post', {
//         //     method: 'POST',
//         //     headers: {
//         //       'Content-Type': 'application/json',
//         //     },
//         //     body: JSON.stringify(post),
//         //   });

//         //   // 서버로부터의 응답을 확인합니다.
//         //   if (response.ok) {
//         //     console.log('글이 성공적으로 저장되었습니다.');
//         //     // 서버로부터의 추가 작업에 대한 처리를 이어서 진행할 수 있습니다.
//         //   } else {
//         //     console.error('글 저장 중 오류 발생:', response.statusText);
//         //   }

//         // } catch (error) {
//         //   console.error('글 저장 중 오류 발생:', error);
//         // }
//         // 이전에 저장된 글 목록을 가져와서 배열에 추가

//         {/*저장형태
//        {"id": "1707234408198", "like": 0, "nickname": "익명", "pwd": "1234", "text": "비밀번호 1234",
//        "time": "Wed Feb  7 00:46:48 2024", "title": "비밀번호 1234"} */}

//         {/*백엔드 연결시 삭제 */ }
//         const existingPosts = await AsyncStorage.getItem('posts');
//         const posts = existingPosts ? JSON.parse(existingPosts) : [];
//         posts.push(post);

//         // 업데이트된 글 목록을 저장
//         await AsyncStorage.setItem('posts', JSON.stringify(posts));

//         // 모달 닫기

//         // 게시판 화면으로 이동

//       } catch (error) {
//         console.error('글 저장 중 오류 발생:', error);
//       }
//       console.log('제목:', title);
//       console.log('내용:', text);
//       console.log('이름:', nickname);
//       console.log('비번:', pwd);
//       {/*백엔드 연결시 삭제 */ }

//       navigation.goBack();
//     }
//   };


//   const OKhandleButtonPress = async () => {
//     // 제목과 내용이 둘 다 빈 칸이면 메시지를 띄움
//     if (title.trim() === '' || text.trim() === '') {
//       alert('제목과 내용을 입력하세요.');
//     } else {
//       // 작성된 글을 로컬 저장소에 저장
//       toggleModal();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={canclehandleButtonPress}>
//       <View style={{ backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1 }}>
//         <TopBar1 />
//         <View style={styles.viewcontainer}>
//           <TextInput
//             style={styles.inputcontainer}
//             onChangeText={handleTitleChange}
//             value={title}
//             placeholder="제목을 입력하세요"
//             placeholderTextColor="gray"
//           />
//         </View>
//         <View style={[styles.viewcontainer, { flex: 1 }]}>
//           <TextInput
//             style={[styles.inputcontainer, { flex: 1 }]}
//             onChangeText={handleTextChange}
//             value={text}
//             placeholder="내용을 입력하세요"
//             placeholderTextColor="gray"
//           />
//         </View>

//         <View style={{ padding: 10, flexDirection: 'row' }}>
//           <TouchableOpacity style={styles.buttonStyle} onPress={canclehandleButtonPress}>
//             <Text style={{ color: 'white', textAlign: 'center' }}>취소</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.buttonStyle} onPress={OKhandleButtonPress}>
//             <Text style={{ color: 'white', textAlign: 'center' }}>확인</Text>
//           </TouchableOpacity>
//         </View>

//         {/* 모달 */}
//         <Modal visible={isModalVisible} animationType="slide" transparent={true}>
//           <TouchableWithoutFeedback onPress={toggleModal}>
//             <View style={styles.modalContainer}>
//               <TouchableWithoutFeedback onPress={() => { }}>
//                 <View style={styles.modalContent}>
//                   <View>
//                     <TextInput
//                       style={styles.inputcontainer}
//                       onChangeText={handleNameChange}
//                       onFocus={clearNickname}
//                       value={nickname}
//                       placeholder="닉네임"
//                       placeholderTextColor="gray"
//                     />
//                     <TextInput
//                       style={styles.inputcontainer}
//                       onChangeText={handlePwdChange}
//                       value={pwd}
//                       placeholder="비밀번호"
//                       placeholderTextColor="gray"
//                     />
//                   </View>

//                   <View style={{ padding: 10, flexDirection: 'row' }}>
//                     <TouchableOpacity style={styles.buttonStyle} onPress={cancelModal}>
//                       <Text style={{ color: 'white', textAlign: 'center' }}>취소</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.buttonStyle} onPress={toggleModal}>
//                       <Text style={{ color: 'white', textAlign: 'center' }}>확인</Text>
//                     </TouchableOpacity>
//                   </View>

//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   viewcontainer: {
//     paddingLeft: 10,
//     paddingRight: 10,
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
//   buttonStyle: {
//     height: 40,
//     width: '50%',
//     borderRadius: 10,
//     backgroundColor: '#1A6DFF',
//     padding: 10,
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
// });

// export default Writepage;