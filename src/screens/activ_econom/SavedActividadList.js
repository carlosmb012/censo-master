import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import API from '../../utils';
import Button from 'CensoSmartCat/src/components/Button';

export default class SavedActividadList extends Component {
  state = {
    patentes: [],
    showList: true,
  };

  async componentDidMount() {
    this.actualizarPat();
  }

  actualizarPat = async () => {
    let patentes = await AsyncStorage.getItem('@User:patentes');
    patentes = JSON.parse(patentes);
    this.setState({ patentes });
  };

  _confirmar = (item, i) => {
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
      { cancelable: false },
    );
  };

  enviarDatos = async (patentePress, i) => {
    this.setState({ showList: false });
    try {
      const PAT = patentePress;
      console.log('id', PAT.patente.id);
      console.log('id?', PAT.patente.id === undefined);
      //crear json para enviar
      const patenteAEnviar = {
        patente: PAT.patente,
        propietario: PAT.propietario,
        resultados: PAT.resultado,
      };
      //verificar si es update o new
      let patenteResp = null;
      if (PAT.patente.id === undefined) {
        patenteResp = await API.guardarPatente(patenteAEnviar);
      } else {
        patenteResp = await API.editarPatente(patenteAEnviar, PAT.patente.id);
      }
      //console.log('patenteResp', patenteResp);
      if (patenteResp === null) {
        let aviso =
          'En este momento no tiene conexión a internet, ' +
          'reintente mas tarde o ahora, ¿Desea reintentar ahora?';
        this.avisoGuardar(patentePress, i, aviso);
      } else if (patenteResp.message !== 'ok') {
        this.avisoGuardar(patentePress, i, null);
      } else {
        let id = patenteResp.idPatente
        //eliminar y enviar fotos en su formato
        console.log('fotosGlength', PAT.imagens.length);
        await API.eliminarFotosP(id);
        await PAT.imagens.map((item) => {
          if (item.data !== '-') {
            item.foto = 'data:image/png;base64,' + item.data;
            item.patente_id = id;
            item.data = '-';
          }
        });
        let fotoSave = await API.guardarFotosP(PAT.imagens);
        console.log('fotoSave', fotoSave);
        if (fotoSave.message === 'ok') {
          let cambio = await API.cambiarEstadoP(id);
          console.log('cambioestado', cambio);
          if (cambio.message !== 'ok') this.avisoGuardar(patentePress, i, null);
        } else {
          this.avisoGuardar(patentePress, i, null);
        }
        //eliminar item
        let patentes = await AsyncStorage.getItem('@User:patentes');
        patentes = JSON.parse(patentes);
        patentes.splice(i, 1);
        console.log('patentesGF', patentes);
        AsyncStorage.setItem('@User:patentes', JSON.stringify(patentes));
        this.setState({ patentes, showList: true });
      }
    } catch (e) {
      console.log('error', e);
      this.setState({ showList: true });
    }
  };

  avisoGuardar = (patentePress, i, text) => {
    let aviso = text || '¿Desea reintentar enviar los datos?';
    Alert.alert(
      'No se pudo enviar los datos',
      aviso,
      [
        {
          text: 'Cancelar',
          onPress: () => this.setState({ showList: true }),
        },
        {
          text: 'Reintentar',
          onPress: () => this.enviarDatos(patentePress, i),
        },
      ],
      { cancelable: false },
    );
  };

  borrar = () => {
    Alert.alert(
      'Confirmar',
      '¿Desea borrar los patentes guardados?',
      [
        {
          text: 'Confirmar',
          onPress: () => {
            let patentes = [];
            AsyncStorage.setItem('@User:patentes', JSON.stringify(patentes));
            this.setState({ patentes });
          },
        },
        {
          text: 'Cancelar',
        },
      ],
      { cancelable: false },
    );
  };

  render() {
    //console.log ('entra');
    const { patentes, showList } = this.state;
    if (showList) {
      return (
        <View>
          {patentes.map((item, i) => (
            <ListItem
              key={i}
              title={item.patente.raz_soc_pat}
              subtitle={item.patente.direccion}
              onPress={() => this._confirmar(item, i)}
              leftIcon={{ name: 'save', type: 'font-awesome', size: 34 }}
              bottomDivider
            />
          ))}
          <View style={{ alignItems: 'center', marginHorizontal: 20 }}>
            <Button
              title="ACTUALIZAR LISTADO"
              action={this.actualizarPat}
              color="#4781ff"
            />
            {patentes.length !== 0 ? (
              <Button title="BORRAR REGISTROS" action={this.borrar} />
            ) : (
                <Text style={{ fontSize: 18 }}>No hay patentes guardados</Text>
              )}
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
  }
}
