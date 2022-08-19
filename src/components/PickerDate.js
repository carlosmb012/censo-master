import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export default function PickerDate (props) {
  const {title, fecha, show, show2, onPress, onChange} = props;
  const fechaN = Date.parse (fecha);
  /* console.log ('fechaN', fechaN);
  console.log ('new Date(Date.parse (fecha))', new Date (fechaN)); */
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}:</Text>
      <TouchableOpacity style={styles.btnDate} onPress={onPress}>
        <Text style={styles.txtdate}>{fecha}</Text>
      </TouchableOpacity>
      {show && <RNDateTimePicker value={fechaN} onChange={onChange} />}
      {show2 && <RNDateTimePicker value={fechaN} onChange={onChange} />}
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  btnDate: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtdate: {
    fontSize: 16,
    color: '#0857ff',
  },
  text: {
    fontSize: 16,
  },
});
