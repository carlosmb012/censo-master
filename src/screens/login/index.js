import React, {Component} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';

import FormLogin from './FormLogin';

export default class Login extends Component {

  render () {
    return (
      <View style={styles.container}>
        <Image
          source={require ('../../../assets/smartcat.png')}
          style={styles.image}
        />
        <FormLogin navigation={this.props.navigation} />
        <View style={styles.abajo}>
          <Image
            source={require ('../../../assets/ocorosoft.jpg')}
            style={styles.logo}
          />
          <View>
            <Text style={styles.text} />
            <Text style={styles.text}>v 1.0</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  image: {
    height: '38%',
    width: '90%',
    resizeMode: 'contain',
  },
  logo: {
    width: 100,
    resizeMode: 'contain',
  },
  text: {
    color: 'black',
    fontSize: 13,
    color: '#808080',
  },
  abajo: {
    height: 46,
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
