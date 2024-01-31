import React from "react";
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/AntDesign'; 
import { View, Text, Image,TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
const QrcCdeScan = require("../assets/image/QrcCdeScan.png");

const IconWrapper = styled(Icon)`
  font-size: ${({ w, h }) => `${w}px`};
  color: black;
`;

export const Qr = () => {
  return <IconWrapper name="scan1" w={32} h={30} />;
};

const BlueText = styled.Text`
  color: #1A6DFF;
  font-size: 30px;
  font-weight: bold;
`;

const BlackText = styled.Text`
  color: #000000;
  font-size: 30px;
  font-weight: bold;
`;

const TopBar1 = () => {
  const navigation = useNavigation();

  const handleQrCodePress = () => {
   
    navigation.navigate('QRCodeScanner');
  };
  return (
    <View style={styles.YhealthContainer}>
      <View style={styles.topBarContainer}>
        <BlueText>Y</BlueText>
        <BlackText>health</BlackText>
      </View>
      <View style={styles.iconContainer}>
      <TouchableOpacity onPress={handleQrCodePress}>
        <Image source={QrcCdeScan} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
    </View>
    </View>
  );
};


const styles = {
  YhealthContainer: {
    paddingTop: 15,
    paddingRight: 20,
    paddingLeft: 20,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconContainer: {
    marginTop: -12,
    paddingRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconGap: {
    paddingLeft: 20,
  },
};

export { TopBar1 };
