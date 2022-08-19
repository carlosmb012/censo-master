import React, {Component} from 'react';
import {View, Image, StyleSheet, ScrollView} from 'react-native';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import Pages from './PagesView';
import Button from 'CensoSmartCat/src/components/Button';

export default class Main extends Component {
  constructor (props) {
    super (props);
    this.state = {
      imagenes: [],
      btnSolicitud: 0,
    };
  }

  logout = () => {
    AsyncStorage.removeItem ('@User:token');
    AsyncStorage.removeItem ('@User:id');
    AsyncStorage.removeItem ('@User:idCiudad');
    this.props.navigation.dispatch (StackActions.replace ('Login'));
  }

  render () {
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <View style={styles.containerImage}>
          <Image
            style={styles.image}
            source={require ('CensoSmartCat/assets/smartcat.png')}
          />
        </View>
        <Pages navigation={this.props.navigation} />
        <View style={styles.containerLogo}>
          <Button title="Cerrar Sesión" action={this.logout} width={106} />
          <Image
            style={styles.logo}
            source={require ('CensoSmartCat/assets/ocorosoft.jpg')}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create ({
  containerImage: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 180,
    resizeMode: 'contain',
  },
  containerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    marginHorizontal: 5,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
});
