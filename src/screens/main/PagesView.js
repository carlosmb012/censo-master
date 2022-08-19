import React, {Component} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import API from '../../utils';
import Item from './components/ButtonMenu';

const catastro = require('CensoSmartCat/assets/catastro.jpeg');
const comercio = require('CensoSmartCat/assets/comercio.jpeg');
const forestal = require('CensoSmartCat/assets/forestal.jpeg');
const obraspub = require('CensoSmartCat/assets/obraspub.jpeg');
const desperfectos = require('CensoSmartCat/assets/desperfectos.jpeg');
const medioamb = require('CensoSmartCat/assets/medioamb.jpeg');
const multas = require('CensoSmartCat/assets/multas.jpeg');
const controlvial = require('CensoSmartCat/assets/controlvial.jpeg');
const controledif = require('CensoSmartCat/assets/controledif.jpeg');

class PagesView extends Component {
  state = {
    listaBoton: [],
    user: null,
    existe: false,
  };

  async componentDidMount() {
    var id = await AsyncStorage.getItem('@User:id');
    const user = await API.getUser(id);
    if (user === null) {
      Alert.alert('Alerta', 'Revise su conexión a internet');
    } else if (user.lenght === 0) {
      Alert.alert('Alerta', 'Usted se encuentra bloqueado temporalmente');
    } else {
      this.setState({user, existe: true});
    }
  }

  _catastro = () => {
    const {user, existe} = this.state;
    if (existe && user[0].modulo1 == 1)
      this.props.navigation.navigate('Visitas');
  };

  _comercio = () => {
    const {user, existe} = this.state;
    if (existe && user[0].modulo2 == 1)
      this.props.navigation.navigate('VisitasAE');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Item title="Catastro" action={this._catastro} image={catastro} />
          <Item title="Comercio" action={this._comercio} image={comercio} />
          <Item title="Forestal" action={() => {}} image={forestal} />
        </View>
        <View style={styles.row}>
          <Item title="Obras Pub" action={() => {}} image={obraspub} />
          <Item title="Desperfectos" action={() => {}} image={desperfectos} />
          <Item title="Medio Amb" action={() => {}} image={medioamb} />
        </View>
        <View style={styles.row}>
          <Item title="Multas" action={() => {}} image={multas} />
          <Item title="Control Vial" action={() => {}} image={controlvial} />
          <Item title="Control Edif" action={() => {}} image={controledif} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: 6,
  },
});

export default PagesView;
