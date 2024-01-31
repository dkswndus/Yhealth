import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchDataFromStorage = async () => {
  try {
    const storedData = await AsyncStorage.getItem('appData');
    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);
      return parsedData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching data from AsyncStorage:', error);
    return null;
  }
};
