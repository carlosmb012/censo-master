import React, {Component} from 'react';
import {View, FlatList, Alert, ActivityIndicator} from 'react-native';

import API from '../../utils';
import Edificacion from './Edificacion';

class EdificacionList extends Component {
  state = {
    isLoading: true,
    edificacions: [],
  };

  async componentDidMount () {
    //this.props.route.params.id = id del inmueble
    const edificacions = await API.getEdificacion (this.props.route.params.id);
    if (edificacions !== null) {
      await this.setState ({edificacions});
    }
    global.inmuebleG.edificaciones = this.state.edificacions;
    this.setState ({isLoading: false});
  }

  renderItem = ({item, index}) => {
    return <Edificacion {...item} posicion={index} />;
  };

  render () {
    const {edificacions, isLoading} = this.state;
    if (isLoading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <FlatList
        ref={ref => {
          this.flatListRef = ref;
        }}
        initialNumToRender={7}
        //listKey={(item, index) => index.toString ()}
        keyExtractor={(item, index) => index.toString ()}
        data={edificacions}
        renderItem={this.renderItem}
      />
    );
  }
}

export default EdificacionList;
