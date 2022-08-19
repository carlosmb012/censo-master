import React, { Component } from 'react';
import { FlatList, View, ActivityIndicator} from 'react-native';

import API from '../../utils';
import Condicion from './components/Condicion';

export default class CondicionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      condiciones: [],
    };
    global.patenteG.resultado = [];
  }

  async componentDidMount() {
    const params = this.props.route.params;
    const condiciones = await API.getCondicionesP();
    //console.log('condiciones', condiciones);
    if (condiciones !== null) {
      this.setState({ condiciones });
    }
    if (Object.keys(params).length === 0) {
      this.state.condiciones.map((item) => {
        let res = {
          resultado: false,
          observaciones: '',
          condiciones_id: item.id_cond,
        };
        global.patenteG.resultado.unshift(res);
      });
    } else {
      const resultado = await API.getResultadoP(params.id);
      global.patenteG.resultado = resultado;
    }
    this.setState({ isLoading: false });
    console.log('resultado', global.patenteG.resultado);
  }

  renderItem = ({ item, index }) => {
    return <Condicion {...item} pos={index} />;
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={this.state.condiciones}
        renderItem={this.renderItem}
        removeClippedSubviews={false}
      />
    );
  }
}
