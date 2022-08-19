import React from 'react';
import {Text, StyleSheet, View, Switch} from 'react-native';

export default function SwitchSiNo(props) {
  const {title, valor, onChange, border} = props;
  return (
    <View style={[styles.container, {borderBottomWidth: border ? 0 : 1}]}>
      <Text style={styles.text}>{title}:</Text>
      <Switch
        style={styles.switch}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={valor ? '#668dcb' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onChange}
        value={valor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'gray',
  },
  switch: {
    flex: 1,
    height: 46,
    marginHorizontal: 10,
  },
  text: {
    flex: 9,
    fontSize: 16,
  },
});
