import React, {Component} from 'react';
import {FlatList, View, ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import API from '../../utils';
import Inmueble from './components/Inmueble';
import Separator from 'CensoSmartCat/src/components/VerticalSeparador';

class InmuebleList extends Component {
  constructor (props) {
    super (props);
    this.state = {
      isLoading: true,
      inmuebles: [],
      inmuGuardado: [],
    };
  }

  async componentDidMount () {
    const idVisita = this.props.route.params.item.id;
    const inmuebles = await API.getInmuebles (idVisita);
    if (inmuebles === null) {
      Alert.alert ('Alerta', 'Revise su conexión a internet');
    } else {
      this.setState ({inmuebles});
    }
    let inmuGuardado = await AsyncStorage.getItem ('@User:inmuebles');
    inmuGuardado = JSON.parse (inmuGuardado);
    this.setState ({inmuGuardado, isLoading: false});
  }

  _onPress = async item => {
    let b = true;
    this.state.inmuGuardado.map (item2 => {
      if (item.id === item2.idInmueble) b = false;
    });
    if (item.estado !== 'Enviado' && b) {//o item guardado
      this.props.navigation.navigate ('TabCatastro', {inmueble: item});
    }
  };

  renderItem = ({item}) => {
    this.state.inmuGuardado.map (item2 => {
      if (item.id === item2.idInmueble) {
        item.estado = 'Guardado';
      }
    });
    return <Inmueble {...item} action={() => this._onPress (item)} />;
  };

  render () {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <FlatList
        keyExtractor={item => item.id.toString ()}
        data={this.state.inmuebles}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={this.renderItem}
      />
    );
  }
}

export default InmuebleList;
