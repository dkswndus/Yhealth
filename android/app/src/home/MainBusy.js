import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  const data = {
    labels: ['여유', '보통', '혼잡'],
    datasets: [
      {
        name: ['종체', '무도대'],
        data: [7, 13], // 여유, 보통, 혼잡에 해당하는 값
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>헬스장 혼잡도</Text>
      <View style={styles.rowContainer}>
        <View style={[styles.flexContainer, styles.flex5]}>
          <Text style={styles.midtitle}>종합 체육관</Text>
          <View>
            <View style={[styles.numberContainer, { backgroundColor: getColorByValue(data.datasets[0].data[0]) }]}>
            </View>
            <Text style={styles.busynum}>{getColorByText(data.datasets[0].data[0])}</Text>
          </View>

        </View>
        <View style={[styles.flexContainer, styles.flex5]}>
          <Text style={styles.midtitle}>무도대</Text>
          <View style={[styles.numberContainer, { backgroundColor: getColorByValue(data.datasets[0].data[1]) }]}>
            {/* <Text style={styles.busynum}>{data.datasets[0].data[1]}</Text> */}
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
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
    fontSize: 14,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
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
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    width: 60,
    height: 60,
  },
});

export default Busy;