import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Picker} from '@react-native-community/picker';

export default function PickerMultiple (props) {
  const {title, valor, onChange, list, blq, piso} = props;
  return (
    <View style={styles.container}>
      <Text
        style={{
          flex: blq ? 3 : 4,
          fontSize: 16,
        }}
      >
        {title}:
      </Text>
      <Picker
        selectedValue={valor}
        prompt={title}
        style={{
          flex: blq ? 7 : 6,
          height: 46,
          fontSize: 16,
          color: '#0857ff',
        }}
        onValueChange={onChange}
      >
        {blq
          ? list.map (it => (
              <Picker.Item key={it.name} label={it.name} value={it.name} />
            ))
          : list.map (it => (
              <Picker.Item key={it.id} label={it.name} value={it.name} />
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
});
