import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { BarChart, LineChart } from 'react-native-chart-kit';
import API_URL from '../writing/URl';
const MGym = require("../assets/image/Mgym.png");
const SGym = require("../assets/image/Sgym.png");

const getColorByValue = (value) => {
  // 예시: 여유(0-7), 보통(7-15), 혼잡(15-30)
  if (value <= 7) {
    return 'green'; // 여유할 때의 색상
  } else if (value <= 30) {
    return 'yellow'; // 보통일 때의 색상
  } else {
    return 'red'; // 혼잡할 때의 색상
  }
};
const getColorByText = (value) => {
  // 예시: 여유(0-7), 보통(7-15), 혼잡(15-30)
  if (value <= 7) {
    return '여유'; // 여유할 때의 색상
  } else if (value <= 30) {
    return '보통'; // 보통일 때의 색상
  } else {
    return '혼잡'; // 혼잡할 때의 색상
  }
};

const Busy = () => {

  const [tracker, settracker] = useState([]);
  const [gym2_count, setgym2_count] = useState('');
  const [gym1_count, setgym1_count] = useState('');

  useEffect(() => {
    fetchData(); // 화면이 focus되면 fetchData 함수 호출
  }, []);


  const fetchData = async () => {

    try {
      const response = await axios.get(`${API_URL}/gym_count/`);

      const tracker = response.data; // 서버에서 받아온 데이터

      settracker(tracker);
      setgym1_count(tracker.gym1_count);
      setgym2_count(tracker.gym2_count);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // 404 오류 처리: 댓글이 없는 경우
        setComments([]); // 빈 배열로 설정하여 댓글이 없음을 표시
      } else {
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    }
  };

  const Busydata = {
    labels: ['여유', '보통', '혼잡'],
    datasets: [
      {
        name: ['종체', '무도대'],
        data: [gym2_count, gym1_count], // 여유, 보통, 혼잡에 해당하는 값
      },
    ],
  };
  // const data = [
  //   { name: '', count: 10 },
  //   { name: '', count: 20 },
  // ]
  // const data = {
  //   labels: Busydata.map((dataPoint) => dataPoint.name),
  //   datasets: [
  //     {
  //       data: Busydata.map((dataPoint) => dataPoint.count),
  //     },
  //   ],
  // };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>헬스장 혼잡도</Text>
      <View>
        {/* <LineChart
          data={data}
          width={200}
          height={200}
          fromZero={true}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2, // 소수점 자리수
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 선 색상 설정
            style: {
              borderRadius: 16,
            },
          }}
          bezier={false}
          style={{ borderRadius: 16, alignSelf: 'center', transform: [{ rotate: '90deg' }], }}

          // withHorizontalLabels={false}
          withHorizontalLines={false}
          horizontal={false}
          horizontalLabelRotation={-90}
          withShadow={false}

        /> */}
      </View>
      <View style={styles.rowContainer}>
        <View style={[styles.flexContainer, styles.flex5]}>

          <Text style={styles.midtitle}>종합 체육관</Text>
          <ImageBackground
            source={SGym}
            style={styles.background}
          >
            <View style={[styles.numberContainer, { backgroundColor: getColorByValue(Busydata.datasets[0].data[0]) }]}>
              {/* <Text style={styles.busynum}>{getColorByText(data.datasets[0].Busydata[0])}</Text> */}
            </View>
          </ImageBackground>
          <View>


          </View>

        </View>
        <View style={[styles.flexContainer, styles.flex5]}>
          <Text style={styles.midtitle}>무도대</Text>
          <ImageBackground
            source={MGym}
            style={styles.background}
          >
            <View style={[styles.numberContainer, { backgroundColor: getColorByValue(Busydata.datasets[0].data[1]) }]}>
              {/* <Text style={styles.busynum}>{data.datasets[0].data[1]}</Text> */}
            </View>
          </ImageBackground>

        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  background: {
    alignItems: 'flex-end',
    flex: 1,
    resizeMode: 'cover',
    width: 90,
    height: 70,
  },
  container: {
    padding: 10,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
    marginBottom: 10,
  },
  midtitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  busynum: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  flexContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  flex5: {
    flex: 5,
  },
  numberContainer: {
    margin: 4,
    borderColor: 'black',
    borderRadius: 50,
    width: 20,
    height: 20,
  },
});

export default Busy;