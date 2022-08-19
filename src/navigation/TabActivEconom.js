import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Overlay } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import API from '../utils';
import Maps from 'CensoSmartCat/src/components/Maps';
import Button from 'CensoSmartCat/src/components/Button';
import Actividad from '../screens/activ_econom/Actividad';
import Propietario from '../screens/activ_econom/Propietario';
import Condiciones from '../screens/activ_econom/CondicionList';

const Tab = createMaterialTopTabNavigator();

export default function TabActivEconom(props) {
  const [show, setShow] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editarUb, setEditarUb] = useState(true);

  const patente = props.route.params.patente || null;
  const idVisita = props.route.params.idVisita || null;
  console.log('idVisita', idVisita);
  console.log('patente', patente);

  useEffect(() => {
    if (idVisita) {
      AsyncStorage.setItem('latitud', '0');
      AsyncStorage.setItem('longitud', '0');
    } else {
      AsyncStorage.setItem('latitud', patente.latitud.toString());
      AsyncStorage.setItem('longitud', patente.longitud.toString());
      AsyncStorage.setItem('latitudCopia', patente.latitud.toString());
      AsyncStorage.setItem('longitudCopia', patente.longitud.toString());
    }
  }, []);

  const toggleOverlay = async (editarUb) => {
    setVisible(!visible);
    setEditarUb(editarUb);
    let lat = await AsyncStorage.getItem('latitud');
    let latC = await AsyncStorage.getItem('latitudCopia');
    let lon = await AsyncStorage.getItem('longitud');
    let lonC = await AsyncStorage.getItem('longitudCopia');
    console.log(lat);
    console.log(latC);
    console.log(latC === lat);
    //crear copias
    if (!editarUb && lat !== latC && lon !== lonC) {
      await AsyncStorage.setItem('latitud', latC);
      await AsyncStorage.setItem('longitud', lonC);
    }
  };

  const validarPropietario = () => {
    let prop = global.patenteG.propietario;
    console.log('PATpropietario', prop);
    if (prop.primer_apellido !== null)
      prop.primer_apellido = prop.primer_apellido.trim();
    if (prop.primer_nombre !== null)
      prop.primer_nombre = prop.primer_nombre.trim();
    if (prop.ci !== null) prop.ci = prop.ci.trim();
    const { primer_nombre, primer_apellido, ci, razon_social, nit } = prop;
    if (!prop.personeria) {
      if (
        (primer_nombre === '' && primer_apellido === '' && ci === '') ||
        (primer_nombre !== '' && primer_apellido !== '' && ci !== '')
      ) {
        return true;
      } else if (primer_apellido === '') {
        Alert.alert('Alerta', 'Debe rellenar el campo de 1er Apellido');
      } else if (primer_nombre === '') {
        Alert.alert('Alerta', 'Debe rellenar el campo de 1er Nombre');
      } else if (ci === '') {
        Alert.alert('Alerta', 'Debe rellenar el campo de Cédula de identidad');
      }
    } else {
      if (
        (primer_nombre === '' &&
          primer_apellido === '' &&
          ci === '' &&
          razon_social === '' &&
          nit === 0) ||
        (primer_nombre !== '' &&
          primer_apellido !== '' &&
          ci !== '' &&
          razon_social !== '' &&
          nit !== '')
      ) {
        return true;
      } else if (razon_social === '') {
        Alert.alert('Alerta', 'Debe rellenar el campo de razón social');
      } else if (nit === '') {
        Alert.alert('Alerta', 'Debe rellenar el campo de nit');
      } else if (primer_apellido === '') {
        Alert.alert('Alerta', 'Debe rellenar el campo de 1er Apellido');
      } else if (primer_nombre === '') {
        Alert.alert('Alerta', 'Debe rellenar el campo de 1er Nombre');
      } else if (ci === '') {
        Alert.alert('Alerta', 'Debe rellenar el campo de Cédula de identidad');
      }
    }
    return false;
  };

  const verificarDatos = async () => {
    let PAT = global.patenteG;
    //console.log ('PAT', PAT);
    console.log('patente', PAT.patente);
    console.log('PATpropietario', PAT.propietario);
    console.log('fotosG', PAT.imagens.length);
    //verifica si edito la ubicacion
    if (editarUb) {
      let lat = await AsyncStorage.getItem('latitud');
      let lon = await AsyncStorage.getItem('longitud');
      PAT.patente.latitud = parseFloat(lat);
      PAT.patente.longitud = parseFloat(lon);
    }
    //verificar la latitud y el id_act
    if (PAT.patente.raz_soc_pat === '') {
      Alert.alert('Alerta', 'Debe rellenar el campo razón social');
    } else if (PAT.patente.latitud === 0) {
      Alert.alert('Alerta', 'Debe seleccionar la ubicación de la actividad');
    } else if (PAT.imagens.length === 0 && PAT.patente.estado !== 'Rechazado') {
      Alert.alert('Alerta', 'Debe tomar fotos de la actividad económica');
    } else {
      let propietarioValido = validarPropietario();
      console.log('propietarioValido', propietarioValido);
      if (propietarioValido) {
        if (idVisita) confirmar(0);
        else confirmar(patente.id);
      }
    }
  };

  const confirmar = (id) => {
    console.log('id', id);
    Alert.alert(
      'Confirmar',
      'Confirme para el envio de datos',
      [
        {
          text: 'Confirmar',
          onPress: () => enviarDatos(id),
        },
        {
          text: 'Cancelar',
        },
      ],
      { cancelable: false },
    );
  };

  const enviarDatos = async (id) => {
    setShow(false);
    try {
      const PAT = global.patenteG;
      if (id === 0) {
        PAT.patente.visita_program_id = idVisita;
      }
      //crear json para enviar
      const patenteAEnviar = {
        patente: PAT.patente,
        propietario: PAT.propietario,
        resultados: PAT.resultado,
      };
      let patenteResp = null;
      if (id === 0) {
        patenteResp = await API.guardarPatente(patenteAEnviar);
      } else {
        patenteResp = await API.editarPatente(patenteAEnviar, id);
      }
      console.log('patenteResp', patenteResp);
      if (patenteResp === null) {
        let aviso =
          'En este momento no tiene conexión a internet, guarde los datos para enviarlos luego ' +
          '(los datos guardados se encontrarán en el menú, en la opción Act. Econ. Guardadas)';
        avisoGuardar(id, aviso);
      } else if (patenteResp.message !== 'ok') {
        avisoGuardar(id, null);
      } else {
        //eliminar si se edita y enviar fotos en su formato
        let idPatente = patenteResp.idPatente;
        if (id !== 0) await API.eliminarFotosP(id);
        await PAT.imagens.map((item) => {
          if (item.data !== '-') {
            item.foto = 'data:image/png;base64,' + item.data;
            item.patente_id = idPatente;
            item.data = '-';
          }
        });
        let fotoSave = await API.guardarFotosP(PAT.imagens);
        console.log('fotoSave', fotoSave);
        if (fotoSave.message === 'ok') {
          let cambio = await API.cambiarEstadoP(idPatente);
          console.log('cambioestado', cambio);
          if (cambio.message !== 'ok') avisoGuardar(id, null);
        } else {
          avisoGuardar(id, null);
        }
        props.navigation.navigate('VisitasAE');
      }
    } catch (e) {
      console.log('error', e);
      setShow(true);
    }
  };

  const avisoGuardar = (id, text) => {
    let aviso =
      text ||
      'Puede reintentar enviar los datos o guardar. ¿Desea reintentar enviar los datos?' +
      '(los datos guardados se encontrarán en el menú, en opciones guardado)';
    Alert.alert(
      'No se pudo enviar los datos',
      aviso,
      [
        {
          text: 'Guardar',
          onPress: () => guardarDatos(),
        },
        {
          text: 'Reintentar',
          onPress: () => enviarDatos(id),
        },
      ],
      { cancelable: false },
    );
  };

  const guardarDatos = async () => {
    try {
      var patentes = await AsyncStorage.getItem('@User:patentes');
      patentes = JSON.parse(patentes);
      patentes.push(global.patenteG);
      AsyncStorage.setItem('@User:patentes', JSON.stringify(patentes));
      props.navigation.navigate('VisitasAE');
    } catch (e) {
      console.error('@user', e);
    }
  };

  if (show) {
    const { id, cod_pat } = patente || {};
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.text1}>Código Patente: {cod_pat}</Text>
        </View>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: '#4781ff',
            inactiveTintColor: '#4781ff',
            labelStyle: { fontSize: 13, fontWeight: 'bold' },
          }}>
          <Tab.Screen
            name="Actividad"
            component={Actividad}
            initialParams={patente}
          />
          <Tab.Screen
            name="Propietario"
            component={Propietario}
            initialParams={patente}
          />
          <Tab.Screen
            name="Condiciones"
            component={Condiciones}
            initialParams={patente}
          />
        </Tab.Navigator>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Button
              title="ENVIAR"
              action={() => verificarDatos()}
              color="#4781ff"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="MAPA"
              action={() => toggleOverlay(true)}
              color="#4781ff"
            />
          </View>
        </View>
        <Overlay isVisible={visible} style={styles.modal}>
          <View style={styles.modal}>
            <Maps />
            <Text>Seleccionar la ubicación de la actividad económica</Text>
            {patente ? (
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Aceptar"
                    action={() => toggleOverlay(true)}
                    color="#4781ff"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Cancelar"
                    action={() => toggleOverlay(false)}
                  />
                </View>
              </View>
            ) : (
                <Button
                  title="Aceptar"
                  action={() => toggleOverlay(true)}
                  color="#4781ff"
                />
              )}
          </View>
        </Overlay>
      </View>
    );
  } else {
    return (
      <View style={styles.containerAI}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  row: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  containerAI: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
