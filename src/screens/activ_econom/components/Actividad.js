import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';

export default function Inmueble(props) {
  const {action, raz_soc_pat, direccion, estado, observac_dada} = props;
  return (
    <TouchableOpacity style={styles.container} onPress={action}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.containerImage}>
          <Image
            source={require('CensoSmartCat/assets/comercio.jpeg')}
            style={styles.itemImage}
          />
        </View>
        <View style={styles.containerText}>
          <Text style={styles.text}>{raz_soc_pat}</Text>
          {direccion && <Text style={styles.text1}>{direccion}</Text>}
          <Text style={styles.text1}>
            {estado === 'Rechazado' ? (
              <Text style={styles.text3}>{estado}</Text>
            ) : estado === 'Enviado' ? (
              <Text style={styles.text4}>{estado}</Text>
            ) : estado === 'Guardado' ? (
              <Text style={styles.text5}>{estado}</Text>
            ) : (
              <Text style={styles.text}>{estado}</Text>
            )}
          </Text>
          {estado === 'Rechazado' && (
            <Text style={styles.text2}>{observac_dada}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  containerText: {
    flex: 1,
    paddingHorizontal: 4,
  },
  containerImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    height: 62,
    width: 62,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text1: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
  },
  text2: {
    color: 'red',
    fontSize: 16,
    //fontWeight: 'bold',
    textAlign: 'center',
  },
  text3: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text4: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text5: {
    color: '#0857ff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
