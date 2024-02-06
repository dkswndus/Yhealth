import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';



const PlaceDropdown = ({ value, setValue }) => {
  const navigation = useNavigation();
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'rgba(255, 255, 255, 1)' }]}>
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: 'rgba(255, 255, 255, 1)' },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={[
          { label: '종체', value: '1' },
          { label: '무도대체육관', value: '2' },
        ]}
        maxHeight={400}
        labelField="label"
        valueField="value"
        placeholder="장소를 선택해주세요."
        value={value}

        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>

  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    zIndex: 1,
    borderRadius: 10,
    marginBottom: 20,




  },

  dropdown: {

    height: 40,
    borderColor: 'rgba(0, 0, 0, 0.9)',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,

  },
  label: {
    position: 'absolute',
    borderRadius: 10,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 20,
  },
  placeholderStyle: {


    fontSize: 20,
  },
  selectedTextStyle: {
    color: 'rgba(0, 0, 0, 0.9)',
    fontSize: 20,
  },

});
export { PlaceDropdown };