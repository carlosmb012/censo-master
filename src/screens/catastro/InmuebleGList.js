import React, {Component} from 'react';
import {View, Text, ActivityIndicator, Alert} from 'react-native';
import {ListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import API from '../../utils';
import Button from 'CensoSmartCat/src/components/Button';

export default class InmuebleGList extends Component {
  state = {
    inmuebles: [],
    showList: true,
  };

  componentDidMount() {
    this.actualizarInmu();
  }

  actualizarInmu = async () => {
    let inmuebles = await AsyncStorage.getItem('@User:inmuebles');
    inmuebles = JSON.parse(inmuebles);
    this.setState({inmuebles});
  };

  _onPress = async (item, i) => {
    Alert.alert(
      'Confirmar',
      'Confirme para el envio de datos',
      [
        {
          text: 'Confirmar',
          onPress: () => this.enviarDatos(item, i),
        },
        {
          text: 'Cancelar',
        },
      ],
      {cancelable: false},
    );
  };

  enviarDatos = async (inmueblePress, i) => {
    this.setState({showList: false});
    try {
      let INMU = inmueblePress;
      let id = INMU.idInmueble;
      //propietarios
      INMU.propietarios[0].personeria = INMU.personaJuridica;
      if (!INMU.personaJuridica) {
        INMU.propietarios[0].razon_social = '';
        INMU.propietarios[0].nit = 0;
      }
      //edificaciones
      await INMU.edificaciones.map((item) => {
        item.bloque = parseInt(item.bloque);
        item.piso = parseInt(item.piso);
        if (item.bloque === 0) {
          item.apto = 0;
          item.anio_construcc = 2020;
          item.superficie = '0';
        } else {
          item.apto = parseInt(item.apto);
          item.anio_construcc = parseInt(item.anio_construcc);
        }
      });
      //crear json para enviar
      const inmuAEnviar = {
        inmueble: INMU.inmueble,
        propietarios: INMU.propietarios,
        edificaciones: INMU.edificaciones,
      };
      let inmuebleUpdate = await API.editarInmueble(inmuAEnviar, id);
      console.log('inmuebleUpdate', inmuebleUpdate);
      if (inmuebleUpdate === null) {
        Alert.alert(
          'No se pudo enviar los datos',
          'En este momento no tiene conexión a internet, ' +
            'reintente mas tarde o ahora, ¿Desea reintentar ahora?',
          [
            {
              text: 'Cancelar',
              onPress: () => {
                this.setState({showList: true});
                global.enviar = false;
              },
            },
            {
              text: 'Reintentar',
              onPress: () => this.enviarDatos(inmueblePress, i),
            },
          ],
          {cancelable: false},
        );
      } else if (inmuebleUpdate.message !== 'ok') {
        this.aviso(inmueblePress, i);
      } else {
        //eliminar y enviar fotos en su formato
        console.log('fotosGlength', INMU.imagens.length);
        await API.eliminarFotos(id);
        await INMU.imagens.map((item) => {
          if (item.data !== '-') {
            item.foto = 'data:image/png;base64,' + item.data;
            item.id_inmueble = id;
            item.data = '-';
          }
        });
        let fotoSave = await API.guardarFotos(INMU.imagens);
        console.log('fotoSave', fotoSave);
        if (fotoSave.message === 'ok') {
          let cambio = await API.cambiarEstado(id);
          console.log('cambioestado', cambio);
          if (cambio.message !== 'ok') this.aviso(inmueblePress, i);
        } else {
          this.aviso(inmueblePress, i);
        }
        //eliminar item
        let inmuebles = await AsyncStorage.getItem('@User:inmuebles');
        inmuebles = JSON.parse(inmuebles);
        inmuebles.splice(i, 1);
        console.log('inmueblesGF', inmuebles);
        AsyncStorage.setItem('@User:inmuebles', JSON.stringify(inmuebles));
        this.setState({inmuebles, showList: true});
      }
    } catch (e) {
      console.log('error', e);
      this.setState({showList: true});
    }
  };

  aviso = (inmueblePress, i) => {
    Alert.alert(
      'No se pudo enviar los datos',
      '¿Desea reintentar enviar los datos?',
      [
        {
          text: 'Cancelar',
          onPress: () => {
            this.setState({showList: true});
            global.enviar = false;
          },
        },
        {
          text: 'Reintentar',
          onPress: () => this.enviarDatos(inmueblePress, i),
        },
      ],
      {cancelable: false},
    );
  };

  borrar = () => {
    Alert.alert(
      'Confirmar',
      '¿Desea borrar los inmuebles guardados?',
      [
        {
          text: 'Confirmar',
          onPress: () => {
            let inmuebles = [];
            AsyncStorage.setItem('@User:inmuebles', JSON.stringify(inmuebles));
            this.setState({inmuebles});
          },
        },
        {
          text: 'Cancelar',
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    //console.log ('entra');
    const {inmuebles, showList} = this.state;
    if (showList) {
      return (
        <View>
          {inmuebles.map((item, i) => (
            <ListItem
              key={item.idInmueble}
              title={'Código catastral: ' + item.inmueble.cod_catastral}
              subtitle={item.inmueble.barrio + ', ' + item.inmueble.direccion}
              onPress={() => this._onPress(item, i)}
              leftIcon={{name: 'save', type: 'font-awesome', size: 34}}
              //rightIcon={{name: 'arrow-right', type: 'font-awesome'}}
              bottomDivider
            />
          ))}
          <View style={{alignItems: 'center', marginHorizontal: 20}}>
            <Button
              title="ACTUALIZAR LISTADO"
              action={this.actualizarInmu}
              color="#4781ff"
            />
            {inmuebles.length !== 0 ? (
              <Button title="BORRAR REGISTROS" action={this.borrar} />
            ) : (
              <Text style={{fontSize: 18}}>No hay inmuebles guardados</Text>
            )}
          </View>
        </View>
      );
    } else {
      return (
        <View style={{alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }
  }
}
