import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Alert,
  View,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {PROVIDER_GOOGLE, AnimatedRegion} from 'react-native-maps';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

const LATITUDE_DELTA1 = 0.08;
const LONGITUDE_DELTA1 = 0.0365;
const LATITUDE_DELTA2 = 0.02; //para mi ubicacion
const LONGITUDE_DELTA2 = 0.0091;
const LATITUDE_DELTA3 = 0.002;
const LONGITUDE_DELTA3 = 0.0009;

export default class Maps extends Component {
  state = {
    region: {
      latitude: null,
      longitude: null,
      latitudeDelta: LATITUDE_DELTA1,
      longitudeDelta: LONGITUDE_DELTA1,
    },
    coordinate: new AnimatedRegion({
      latitude: null,
      longitude: null,
      latitudeDelta: LATITUDE_DELTA1,
      longitudeDelta: LONGITUDE_DELTA1,
    }),
    width: '101%',
    mostrarMarker: false,
  };

  async componentDidMount() {
    await this.requestLocationPermission();
  }

  requestLocationPermission = async () => {
    try {
      let granted = false;
      if (Platform.OS === 'android') {
        //permiso para activar gps
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message:
              'Esta aplicación necesita acceso a su ubicación ' +
              'para que podamos saber dónde estás.',
          },
        );
      }
      if (granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
        let lat = await AsyncStorage.getItem('latitud');
        if (lat !== '0') {
          console.log('mostrara su ubicacion');
          let lon = await AsyncStorage.getItem('longitud');
          AsyncStorage.setItem('latitudCopia', lat);
          AsyncStorage.setItem('longitudCopia', lon);
          this.actualizarRegion(parseFloat(lat), parseFloat(lon), 3, true);
        } else {
          console.log('mostrara mi ubicacion');
          Geolocation.getCurrentPosition(
            (position) => {
              //console.log('position', position);
              let coord = position.coords;
              this.actualizarRegion(coord.latitude, coord.longitude, 2, false);
              console.log('region', this.state.region);
            },
            (error) => {
              console.log('error', error);
              LocationServicesDialogBox.checkLocationServicesIsEnabled({
                message:
                  "<h2 style='color: #0af13e'>¿Usar ubicación?</h2>" +
                  'Esta aplicación desea cambiar la configuración de su dispositivo:<br/><br/>Usar GPS, Wi-Fi y red para la ubicación<br/>',
                ok: 'SI',
                cancel: 'NO',
                preventBackClick: false,
                providerListener: true,
              })
                .then(() => {
                  console.log('Acepta');
                  this.requestLocationPermission();
                })
                .catch((error) => {
                  console.log(error.message); // error.message => "disabled"
                });
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
          );
          //Invoca la devolución de llamada correcta cada vez que cambia la ubicación
          this.watchID = Geolocation.watchPosition((position) => {
            const newRegion = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA2,
              longitudeDelta: LONGITUDE_DELTA2,
            };
            //console.log('newRegion', newRegion);
          });
        }
      } else {
        console.warn('Permiso de ubicación denegado');
      }
    } catch (err) {
      console.warn('err ', err);
    }
  };

  actualizarRegion = (lat, long, num, mostrarMarker) => {
    let deltaLat = LATITUDE_DELTA2;
    let deltaLon = LONGITUDE_DELTA2;
    if (num === 3) {
      deltaLat = LATITUDE_DELTA3;
      deltaLon = LONGITUDE_DELTA3;
    }
    this.setState({
      region: {
        latitude: lat,
        longitude: long,
        latitudeDelta: deltaLat,
        longitudeDelta: deltaLon,
      },
      coordinate: new AnimatedRegion({
        latitude: lat,
        longitude: long,
        latitudeDelta: deltaLat,
        longitudeDelta: deltaLon,
      }),
      mostrarMarker,
    });
  };

  actualizarMarcador = async (e) => {
    try {
      let coord = e.nativeEvent.coordinate;
      this.actualizarRegion(coord.latitude, coord.longitude, 3, true);
      let lat = await AsyncStorage.getItem('latitud');
      let lon = await AsyncStorage.getItem('longitud');
      AsyncStorage.setItem('latitudCopia', lat);
      AsyncStorage.setItem('longitudCopia', lon);
      AsyncStorage.setItem('latitud', coord.latitude.toString());
      AsyncStorage.setItem('longitud', coord.longitude.toString());
    } catch (e) {
      console.error('actualizarMarcador', e.error);
    }
  };

  render() {
    const {region, coordinate, mostrarMarker, width} = this.state;
    return (
      <View style={styles.container}>
        {region.latitude ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={[styles.map, {width}]}
            onMapReady={() => this.setState({width: '100%'})}
            region={region}
            showsUserLocation={true}
            onPress={this.actualizarMarcador}>
            {mostrarMarker && (
              <MapView.Marker.Animated
                ref={(marker) => (this.marker = marker)}
                coordinate={coordinate}
                title="Ubic. de la Act. Comercial"
              />
            )}
          </MapView>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
