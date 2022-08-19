import React, {Component} from 'react';
import {View, Alert, ActivityIndicator} from 'react-native';
import {ListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

//import API from 'CensoSmartCat/src/utils';
import API from '../../utils';

class Visitas extends Component {
  state = {
    isLoading: true,
    visitas: [],
  };

  async componentDidMount () {
    let id = await AsyncStorage.getItem ('@User:id');
    const visitas = await API.getVisitas (parseInt (id));
    if (visitas === null) {
      Alert.alert ('Alerta', 'Revise su conexión a internet');
    } else {
      this.setState ({visitas});
    }
    this.setState ({isLoading: false});
  }

  _onPress = item => {
    this.props.navigation.navigate ('Inmuebles', {item});
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
      <View>
        {this.state.visitas.map ((item, i) => (
          <ListItem
            key={item.id}
            title={'Cod. Programación: ' + item.id}
            subtitle={'Fecha Visita: ' + item.fecha_visita.toString ()}
            onPress={() => this._onPress (item)}
            leftIcon={{name: 'calendar', type: 'font-awesome', size: 32}}
            //rightIcon={{name: 'today', type: 'material'}}
            bottomDivider
          />
        ))}
      </View>
    );
  }
}

export default Visitas;
