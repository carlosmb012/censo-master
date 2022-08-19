import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

export default function ButtonMenu(props) {
  const {action, title, image} = props;
  return (
    <TouchableOpacity onPress={action} style={styles.item}>
      <Image source={image} style={styles.itemImage} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 110,
    paddingVertical: 10,
    marginHorizontal: 3,
    borderColor: '#0D61A1',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  itemImage: {
    height: 82,
    width: 82,
    resizeMode: 'contain',
    //marginBottom: 10,
  },
  text: {
    color: '#0D61A1',
    fontSize: 15,
    textAlign: 'center',
  },
});
