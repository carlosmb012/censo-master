import React from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';

export default function Input(props) {
  const {title, valor, onChange, number, pass} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={valor}
        //value={valor === '0' ? '' : valor}
        keyboardType={number && 'number-pad'}
        autoCapitalize={'characters'}
        secureTextEntry={pass || false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  input: {
    flex: 1,
    paddingStart: 8,
    height: 46,
    fontSize: 16,
    color: '#0857ff',
  },
  text: {
    fontSize: 16,
  },
});
