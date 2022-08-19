import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Picker} from '@react-native-community/picker';

export default function PickerMultiple (props) {
  const {title, valor, onChange, list, ids} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}:</Text>
      <Picker
        selectedValue={valor}
        prompt={title}
        style={styles.picker}
        onValueChange={onChange}
      >
        {ids
          ? list.map (it => (
              <Picker.Item key={it.id} label={it.name} value={it.id} />
            ))
          : list.map (it => (
              <Picker.Item key={it.name} label={it.name} value={it.name} />
            ))}
      </Picker>
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
  picker: {
    flex: 5,
    height: 46,
    fontSize: 16,
    color: '#0857ff',
  },
  text: {
    flex: 5,
    fontSize: 16,
  },
});
