import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import API from '../../utils';
import Input from 'CensoSmartCat/src/components/Input';
import Button from 'CensoSmartCat/src/components/Button';
import Picker from 'CensoSmartCat/src/components/PickerMultiple';

export default class FormLogin extends Component {
  constructor (props) {
    super (props);
    this.state = {
      nombre: '',
      contraseña: '',
      idCiudad: 1,
      ciudades: [],
      mostrarBoton: true,
      shift: new Animated.Value (0),
    };
  }

  async componentDidMount () {
    let ciudades = await API.getCiudades ();
    ciudades = JSON.parse (
      JSON.stringify (ciudades).split ('"nombre":').join ('"name":')
    );
    this.setState ({ciudades});
  }

  _ingresar = async () => {
    const {nombre, contraseña} = this.state;
    if (nombre === '') {
      Alert.alert ('Aviso', 'Debe rellenar el campo Id de usuario');
    } else if (contraseña === '') {
      Alert.alert ('Aviso', 'Debe rellenar el campo contraseña');
    } else {
      this.setState ({mostrarBoton: false});
      await API.login (this.state).then (responseData => {
        console.log ('responseData', responseData);
        if (responseData != null) {
          if (responseData.error == 'invalid_credentials') {
            this.setState ({mostrarBoton: true});
            Alert.alert ('Alerta', 'Datos incorrectos');
          } else if (responseData.token != null) {
            const {token} = responseData;
            this._getUser (token);
          } else {
            this.setState ({mostrarBoton: true});
            Alert.alert ('Alerta', 'Se produjo un error inesperado');
          }
        }
      });
    }
  };

  _getUser = async token => {
    await API.me (token).then (responseData => {
      //console.log ('responseDataME', responseData);
      const {user} = responseData;
      try {
        AsyncStorage.setItem ('@User:token', token);
        AsyncStorage.setItem ('@User:id', user.id.toString ());
        AsyncStorage.setItem (
          '@User:idCiudad',
          this.state.idCiudad.toString ()
        );
        let listaVacia = [];
        AsyncStorage.setItem ('@User:inmuebles', JSON.stringify (listaVacia));
        AsyncStorage.setItem ('@User:patentes', JSON.stringify (listaVacia));
      } catch (e) {
        console.error ('@user', e.error);
      }
      this.props.navigation.dispatch (StackActions.replace ('Main'));
    });
  };

  render () {
    const {mostrarBoton, nombre, contraseña, ciudades} = this.state;
    return (
      <View style={styles.container}>
        <Picker
          title="CIUDAD"
          valor={this.state.idCiudad}
          onChange={value => this.setState ({idCiudad: value})}
          list={ciudades}
          ids={true}
        />
        <Input
          title="ID DE USUARIO"
          valor={nombre}
          onChange={text => this.setState ({nombre: text})}
        />
        <Input
          title="CONTRASEÑA"
          valor={contraseña}
          onChange={text => this.setState ({contraseña: text})}
          pass={true}
        />
        {mostrarBoton
          ? <Button
              title="INGRESAR"
              action={this._ingresar}
              color="#4781ff"
              size={16}
            />
          : <ActivityIndicator style={{margin: 14}} />}
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 20,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 4,
  },
  text: {
    fontSize: 11,
    fontFamily: 'ConthraxSb-Regular',
    width: 108,
    color: 'black',
  },
  input: {
    width: '50%',
    height: 32,
    backgroundColor: 'silver',
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  text1: {
    fontSize: 12,
    color: 'black',
  },
  button: {
    /* shadowOpacity: 1,
      shadowRadius: 0,
      shadowColor: 'red',
      elevation: 3,
      shadowOffset: {width: 10, height: 0}, */
    backgroundColor: '#2196F3',
    width: '38%',
    padding: 6,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'ConthraxSb-Regular',
  },
});
