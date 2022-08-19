import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-community/async-storage';

import API from '../utils';
import Button from 'CensoSmartCat/src/components/Button';
import InmuebleDetail from '../screens/catastro/InmuebleDetail';
import EdificacionList from '../screens/catastro/EdificacionList';
import Contribuyentes from '../screens/catastro/Contribuyentes';

const Tab = createMaterialTopTabNavigator ();

const ubicacion = (latitude, longitude) => {
  console.log ('latitude', latitude);
  if (Platform.OS === 'android') {
    Linking.openURL (
      'http://maps.google.com/maps?daddr=' + latitude + ',' + longitude
    );
  } else {
    Linking.openURL (
      'http://maps.apple.com/maps?daddr=' + latitude + ',' + longitude
    );
  }
  /* Platform.select ({
    ios: () => {
      Linking.openURL (
        'http://maps.apple.com/maps?daddr=' + latitude + ',' + longitude
      );
    },
    android: () => {
      Linking.openURL (
        'http://maps.google.com/maps?daddr=' + latitude + ',' + longitude
      );
    },
  }) (); */
};

const validateDecimal = valor => {
  var RE = /^\d*(\.\d{1})?\d{0,1}$/;
  return RE.test (valor);
};

const edificacionesValidas = () => {
  let cont = 0;
  global.inmuebleG.edificaciones.map ((item, index) => {
    let valido = validarEdificacion (item, index);
    if (!valido) cont++;
  });
  return cont === 0;
};

const validarEdificacion = (item, index) => {
  const {bloque, piso, apto, anio_construcc, superficie} = item;
  if (bloque.toString () !== '0') {
    let unidad = bloque.toString () + piso.toString () + apto.toString ();
    for (let i = index + 1; i < global.inmuebleG.edificaciones.length; i++) {
      const {bloque, piso, apto} = global.inmuebleG.edificaciones[i];
      let unidad2 = bloque.toString () + piso.toString () + apto.toString ();
      if (unidad === unidad2) {
        Alert.alert (
          'Alerta',
          'El número de bloque, piso y apto no se deben repetir'
        );
        return false;
      }
    }
    let pos = index + 1;
    if (
      apto !== '' &&
      (anio_construcc !== '' && anio_construcc.toString ().length === 4) &&
      (superficie !== '' && validateDecimal (superficie))
    ) {
      return true;
    } else if (apto === '') {
      Alert.alert (
        'Alerta',
        'Debe rellenar el campo apto de la Unidad Edificada Nro.' + pos
      );
    } else if (item.superficie === '') {
      Alert.alert (
        'Alerta',
        'Debe rellenar el campo superficie de la Unidad Edificada Nro.' + pos
      );
    } else if (!validateDecimal (item.superficie)) {
      Alert.alert (
        'Alerta',
        'Maximo 2 decimales (ej 78.43) en superficie de la Unidad Edificada Nro.' +
          pos
      );
    } else if (anio_construcc === '') {
      Alert.alert (
        'Alerta',
        'Debe rellenar el campo año construcción de la Unidad Edificada Nro.' +
          pos
      );
    } else if (anio_construcc.toString ().length !== 4) {
      Alert.alert (
        'Alerta',
        'El campo año construcción de la Unidad Edificada Nro.' +
          pos +
          ' debe tener 4 digitos'
      );
    }
    return false;
  } else {
    return true;
  }
};

const validarPropietario1 = item => {
  //console.log ('item', item);
  if (item.primer_apellido !== null)
    item.primer_apellido = item.primer_apellido.trim ();
  if (item.primer_nombre !== null)
    item.primer_nombre = item.primer_nombre.trim ();
  if (item.ci !== null) item.ci = item.ci.trim ();
  const {primer_nombre, primer_apellido, ci, razon_social, nit} = item;
  if (!global.inmuebleG.personaJuridica) {
    if (
      (primer_nombre === '' && primer_apellido === '' && ci === '') ||
      (primer_nombre !== '' && primer_apellido !== '' && ci !== '')
    ) {
      item.personeria = true;
      return true;
    } else if (primer_apellido === '') {
      Alert.alert ('Alerta', 'Debe rellenar el campo de 1er Apellido');
    } else if (primer_nombre === '') {
      Alert.alert ('Alerta', 'Debe rellenar el campo de 1er Nombre');
    } else if (ci === '') {
      Alert.alert ('Alerta', 'Debe rellenar el campo de Cédula de identidad');
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
    } else if (primer_apellido === '') {
      Alert.alert ('Alerta', 'Debe rellenar el campo de 1er Apellido');
    } else if (primer_nombre === '') {
      Alert.alert ('Alerta', 'Debe rellenar el campo de 1er Nombre');
    } else if (ci === '') {
      Alert.alert ('Alerta', 'Debe rellenar el campo de Cédula de identidad');
    } else if (razon_social === '') {
      Alert.alert ('Alerta', 'Debe rellenar el campo de razón social');
    } else if (nit === '') {
      Alert.alert ('Alerta', 'Debe rellenar el campo de nit');
    }
  }
  return false;
};

const validarPropietario2 = item => {
  if (global.inmuebleG.personaJuridica) {
    return true;
  } else {
    if (item.primer_apellido !== null)
      item.primer_apellido = item.primer_apellido.trim ();
    if (item.primer_nombre !== null)
      item.primer_nombre = item.primer_nombre.trim ();
    if (item.ci !== null) item.ci = item.ci.trim ();
    const {primer_nombre, primer_apellido, ci} = item;
    if (
      (primer_nombre === '' && primer_apellido === '' && ci === '') ||
      (primer_nombre !== '' && primer_apellido !== '' && ci !== '')
    ) {
      return true;
    } else if (primer_apellido === '') {
      Alert.alert (
        'Alerta',
        'Debe rellenar el campo de 1er Apellido en titular 2'
      );
    } else if (primer_nombre === '') {
      Alert.alert (
        'Alerta',
        'Debe rellenar el campo de 1er Nombre en titular 2'
      );
    } else if (ci === '') {
      Alert.alert (
        'Alerta',
        'Debe rellenar el campo de Cédula de identidad en titular 2'
      );
    }
    return false;
  }
};

export default function TabCatastro (props) {
  const [show, setShow] = useState (true);
  const {inmueble} = props.route.params || {};

  const verificarDatos = id => {
    let INMU = global.inmuebleG;
    console.log ('idInmueble', id);
    //console.log ('INMU', INMU);
    //console.log ('INMUedificaciones', INMU.edificaciones[0].edificacMaterials);
    //console.log ('INMUpersoneria', INMU.personaJuridica);
    //console.log ('INMUpropietarios', INMU.propietarios);
    console.log ('fotosG', INMU.imagens.length);
    if (!validateDecimal (INMU.inmueble.frente)) {
      Alert.alert ('Alerta', 'Maximo 2 decimales de metros frente');
    } else if (!validateDecimal (INMU.inmueble.fondo)) {
      Alert.alert ('Alerta', 'Maximo 2 decimales de metros fondo');
    } else if (
      INMU.imagens.length === 0 &&
      INMU.inmueble.estado !== 'Rechazado'
    ) {
      Alert.alert ('Alerta', 'Debe tomar fotos del inmueble');
    } else {
      let ev = edificacionesValidas ();
      let vp1 = validarPropietario1 (INMU.propietarios[0]);
      let vp2 = validarPropietario2 (INMU.propietarios[1]);
      console.log ('edificacionesValidas', ev);
      console.log ('validarProp1', vp1);
      console.log ('validarProp2', vp2);
      if (ev && vp1 && vp2) {
        confirmar (id);
      }
    }
  };

  const confirmar = id => {
    Alert.alert (
      'Confirmar',
      'Confirme para el envio de datos',
      [
        {
          text: 'Confirmar',
          onPress: () => enviarDatos (id),
        },
        {
          text: 'Cancelar',
        },
      ],
      {cancelable: false}
    );
  };

  const enviarDatos = async id => {
    setShow (false);
    try {
      let INMU = global.inmuebleG;
      //propietarios
      INMU.propietarios[0].personeria = INMU.personaJuridica;
      if (!INMU.personaJuridica) {
        INMU.propietarios[0].razon_social = '';
        INMU.propietarios[0].nit = 0;
      }
      //edificaciones
      await INMU.edificaciones.map (item => {
        item.bloque = parseInt (item.bloque);
        item.piso = parseInt (item.piso);
        if (item.bloque === 0) {
          item.apto = 0;
          item.anio_construcc = 2020;
          item.superficie = '0';
        } else {
          item.apto = parseInt (item.apto);
          item.anio_construcc = parseInt (item.anio_construcc);
        }
      });
      //crear json para enviar
      const inmuAEnviar = {
        inmueble: INMU.inmueble,
        propietarios: INMU.propietarios,
        edificaciones: INMU.edificaciones,
      };
      //console.log ('inmuAEnviar.edificaciones', inmuAEnviar.edificaciones);
      let inmuebleUpdate = await API.editarInmueble (inmuAEnviar, id);
      console.log ('inmuebleUpdate', inmuebleUpdate);
      if (inmuebleUpdate === null) {
        Alert.alert (
          'Alerta',
          'En este momento no tiene conexión a internet, guarde los datos para enviarlos luego ' +
            '(los datos guardados se encontrarán en el menú, en la opción Inmuebles Guardados)',
          [
            {
              text: 'Guardar',
              onPress: () => guardarDatos (),
            },
            {
              text: 'Reintentar',
              onPress: () => enviarDatos (id),
            },
          ],
          {cancelable: false}
        );
      } else if (inmuebleUpdate.message !== 'ok') {
        aviso (id);
      } else {
        //eliminar y enviar fotos en su formato
        await API.eliminarFotos (id);
        await INMU.imagens.map (item => {
          if (item.data !== '-') {
            item.foto = 'data:image/png;base64,' + item.data;
            item.id_inmueble = id;
            item.data = '-';
          }
        });
        let fotoSave = await API.guardarFotos (INMU.imagens);
        console.log ('fotoSave', fotoSave);
        if (fotoSave.message === 'ok') {
          //TODO descomentar
          let cambio = await API.cambiarEstado (id);
          console.log ('cambioestado', cambio);
          if (cambio.message !== 'ok') aviso (id);
        } else {
          aviso (id);
        }
        props.navigation.navigate ('Visitas');
      }
    } catch (e) {
      console.log ('error', e);
      setShow (true);
    }
  };

  const aviso = id => {
    Alert.alert (
      'No se pudo enviar los datos',
      'Puede reintentar enviar los datos o guardar. ¿Desea reintentar enviar los datos? ' +
        '(los datos guardados se encontrarán en el menú, en opciones guardado)',
      [
        {
          text: 'Guardar',
          onPress: () => guardarDatos (),
        },
        {
          text: 'Reintentar',
          onPress: () => enviarDatos (id),
        },
      ],
      {cancelable: false}
    );
  };

  const guardarDatos = async () => {
    try {
      var inmuebles = await AsyncStorage.getItem ('@User:inmuebles');
      inmuebles = JSON.parse (inmuebles);
      inmuebles.push (global.inmuebleG);
      AsyncStorage.setItem ('@User:inmuebles', JSON.stringify (inmuebles));
      props.navigation.navigate ('Visitas');
    } catch (e) {
      console.error ('@user', e);
    }
  };

  if (show) {
    const {id, cod_catastral, latitud, longitud} = inmueble;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.text1}>Código Catastral: {cod_catastral}</Text>
        </View>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: '#4781ff',
            inactiveTintColor: '#4781ff',
            labelStyle: {fontSize: 13, fontWeight: 'bold'},
          }}
        >
          <Tab.Screen
            name="Inmueble"
            component={InmuebleDetail}
            initialParams={inmueble}
          />
          <Tab.Screen
            name="Edificación"
            component={EdificacionList}
            initialParams={inmueble}
          />
          <Tab.Screen
            name="Más datos"
            component={Contribuyentes}
            initialParams={inmueble}
          />
        </Tab.Navigator>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Button
              title="ENVIAR"
              action={() => verificarDatos (id)}
              color="#4781ff"
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title="MAPA"
              action={() => ubicacion (latitud, longitud)}
              color="#4781ff"
            />
          </View>
        </View>
      </View>
    );
  } else {
    return <View style={styles.containerAI}><ActivityIndicator /></View>;
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
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
