import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

export default function Title (props) {
  const {title, posicion} = props;
  if (posicion === '0') {
    return (
      <View style={styles.container}>
        <Text style={styles.txt}>{title}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.txt}>{title} {posicion}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    backgroundColor: '#4781ff',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 16,
    color: 'white',
  },
});
