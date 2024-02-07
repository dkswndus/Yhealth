import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import WebView from 'react-native-webview';

const QRCodeScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [url, setUrl] = useState(null);



  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setUrl(data);
  };

  return (
    <View style={styles.container}>
      {!scanned ? (
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={handleBarCodeScanned}
        >
          <Text style={styles.scanText}>QR 코드를 스캔하세요!</Text>
        </RNCamera>
      ) : (
        <WebView source={{ uri: url }} style={styles.webview} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  webview: {
    flex: 1,
  },
});

export default QRCodeScanner;
