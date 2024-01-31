import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import Board from './MainBoard';
import Busy from './MainBusy';
import Weight from './WeightChange';
import { boardData } from '../compponents/data';
import { TopBar1 } from '../compponents/TopBar';

const MainPage = ({ route }) => {

  const margin = 5;
  const limitedBoardData = boardData.slice(-6);
  return (
    <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
      <TopBar1/>
      <View>

        <View style={styles.Container}>
          <Busy />
        </View>

        <View style={styles.Container}>
          <Weight />
        </View>

        <View style={styles.Container}>
          <Board />
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1,
    marginLeft: 1,
    marginRight: 1,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
});

export default MainPage;