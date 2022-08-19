import React, {Component} from 'react';
import {View, Text, Alert, ActivityIndicator, StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

//import API from 'CensoSmartCat/src/utils';
import API from '../../utils';
import Button from 'CensoSmartCat/src/components/Button';

export default class Visitas extends Component {
  state = {
    isLoading: true,
    visitas: [],
  };

  async componentDidMount() {
    let id = await AsyncStorage.getItem('@User:id');
    //console.log('id', id);
    const visitas = await API.getVisitasP(parseInt(id));
    //console.log('visitas', visitas)
    if (visitas === null) {
      Alert.alert('Alerta', 'Revise su conexión a internet');
    } else {
      this.setState({visitas});
    }
    this.setState({isLoading: false});
  }

  _onPress = (item) => {
    this.props.navigation.navigate('Actividades', {item});
  };

  _nuevo = async () => {
    let idUser = await AsyncStorage.getItem('@User:id');
    let idCiudad = await AsyncStorage.getItem('@User:idCiudad');
    let visita = {
      user_id: idUser,
      ciudad_id: idCiudad,
    };
    let idVisita = await API.guardarVisitaP(visita);
    //console.log('idVisita', idVisita)
    if (idVisita === null) {
      Alert.alert('Alerta', 'Revise su conexión a internet');
    } else {
      const visitas = await API.getVisitasP(parseInt(idUser));
      this.setState({visitas});
    }
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
      <View style={{flex: 1}}>
        {this.state.visitas.map((item, i) => (
          <ListItem
            key={item.id}
            title={'Cod. Programación: ' + item.id}
            subtitle={'Fecha Visita: ' + item.fecha_visita.toString()}
            onPress={() => this._onPress(item)}
            leftIcon={{name: 'calendar', type: 'font-awesome', size: 32}}
            bottomDivider
          />
        ))}
        {this.state.visitas.length === 0 && (
          <View style={styles.container}>
            <Text style={styles.text}>
              No se encuentra ninguna programación en la base de datos
            </Text>
            <Button
              title="AÑADIR NUEVA"
              action={this._nuevo}
              width={120}
              color="#4781ff"
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {textAlign: 'center', fontSize: 16},
});
