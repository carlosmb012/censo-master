import React, {Component} from 'react';
import {FlatList, View, ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import API from '../../utils';
import Actividad from './components/Actividad';
import Button from 'CensoSmartCat/src/components/Button';
import Separator from 'CensoSmartCat/src/components/VerticalSeparador';

export default class ActividadList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      patentes: [],
      patenteSaved: [],
    };
  }

  async componentDidMount() {
    const idVisita = this.props.route.params.item.id;
    const patentes = await API.getPatentes(idVisita);
    /* console.log('idVisita', idVisita)
    console.log('patentes', patentes) */
    if (patentes === null) {
      Alert.alert('Alerta', 'Revise su conexión a internet');
    } else {
      this.setState({patentes});
    }
    let patenteSaved = await AsyncStorage.getItem('@User:patentes');
    patenteSaved = JSON.parse(patenteSaved);
    this.setState({patenteSaved, isLoading: false});
  }

  _nuevo = () => {
    const idVisita = this.props.route.params.item.id;
    this.props.navigation.navigate('TabActivEconom', {idVisita});
  };

  _verDetalle = (item) => {
    let b = true;
    this.state.patenteSaved.map((item2) => {
      if (item.id === item2.patente.id) b = false;
    });
    if (item.estado !== 'Enviado' && b) {
      this.props.navigation.navigate('TabActivEconom', {patente: item});
    }
  };

  renderItem = ({item}) => {
    this.state.patenteSaved.map((item2) => {
      if (item.id === item2.patente.id) {
        item.estado = 'Guardado';
      }
    });
    return <Actividad {...item} action={() => this._verDetalle(item)} />;
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={this.state.patentes}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={this.renderItem}
        />
        <View style={{alignItems: 'center', paddingVertical: 10}}>
          <Button
            title="NUEVA"
            action={this._nuevo}
            width={120}
            color="#4781ff"
          />
        </View>
      </View>
    );
  }
}
