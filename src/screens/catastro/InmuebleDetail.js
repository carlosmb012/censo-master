import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';

import API from '../../utils';
import Input from 'CensoSmartCat/src/components/Input';
import Switch from 'CensoSmartCat/src/components/Switch';
import Picker from 'CensoSmartCat/src/components/PickerMultiple';

import {
  categorias,
  materialesVia,
  ubicaciones,
  frentes,
  instalacionesSanitarias,
  topografias,
  murosPerimetrales,
  edificiosEspeciales,
  usos,
} from './Listas';

class InmuebleDetail extends Component {
  constructor (props) {
    super (props);
    const params = props.route.params;
    this.state = {
      isLoading: true,
      idInmueble: params.id,
      inmueble: null,
    };
    global.inmuebleG = null;
  }

  async componentDidMount () {
    //this.props.route.params.id = id del inmueble
    const inmueble = await API.getInmueble (this.state.idInmueble);
    if (inmueble === null) {
      Alert.alert (
        'Alerta',
        'Revise su conexión a internet y vuelva a intentar'
      );
    } else {
      await this.setState ({inmueble});
    }
    global.inmuebleG = this.state;
    this.setState ({isLoading: false});
  }

  _onChangeAgua = async value => {
    await this.setState (state => ({
      inmueble: {...state.inmueble, cuadra_agua: value},
    }));
    global.inmuebleG.inmueble.cuadra_agua = value;
  };

  render () {
    const {inmueble, isLoading} = this.state;
    if (isLoading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    if (inmueble) {
      return (
        <ScrollView style={styles.container}>
          <Picker
            title="Uso"
            valor={inmueble.uso}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, uso: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            list={usos}
          />
          <Picker
            title="Categoria"
            valor={inmueble.categoria}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, categoria: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            list={categorias}
          />
          <Picker
            title="Material de Vía"
            valor={this.state.inmueble.material_via}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, material_via: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            list={materialesVia}
          />
          <Picker
            title="Ubicación"
            valor={inmueble.ubicacion}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, ubicacion: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            list={ubicaciones}
          />
          <Switch
            title="Cuadra Alcantarillado"
            valor={inmueble.cuadra_alcantar}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, cuadra_alcantar: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Cuadra AGUA"
            valor={inmueble.cuadra_agua}
            onChange={this._onChangeAgua}
          />
          <Switch
            title="Cuadra LUZ"
            valor={inmueble.cuadra_luz}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, cuadra_luz: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Cuadra TEL."
            valor={inmueble.cuadra_telefono}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, cuadra_telefono: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Cuadra CABLE"
            valor={inmueble.cuadra_cable}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, cuadra_cable: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Cuadra GAS"
            valor={inmueble.cuadra_gas}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, cuadra_gas: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Input
            title="Frente Mts."
            valor={inmueble.frente.toString ()}
            onChange={async text => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, frente: text},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            number
          />
          <Input
            title="Fondo Mts."
            valor={inmueble.fondo.toString ()}
            onChange={async text => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, fondo: text},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            number
          />
          <Picker
            title="Nro. Frentes"
            valor={inmueble.nro_frentes}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, nro_frentes: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            list={frentes}
          />
          <Picker
            title="Instalación Sanitaria"
            valor={inmueble.instalac_sanitaria}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, instalac_sanitaria: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            list={instalacionesSanitarias}
          />
          <Picker
            title="Topografía"
            valor={inmueble.topografia}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, topografia: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            list={topografias}
          />
          <Picker
            title="Muros Perimetrales"
            valor={inmueble.muros_perim}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, muros_perim: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            list={murosPerimetrales}
          />
          <Switch
            title="Acera"
            valor={inmueble.acera}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, acera: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <View
            style={{
              borderTopWidth: 5,
              borderTopColor: '#000',
            }}
          />
          <Switch
            title="Conexión Alcantarillado"
            valor={inmueble.conex_alcantar}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, conex_alcantar: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Conexión AGUA"
            valor={inmueble.conex_agua}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, conex_agua: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Conexión LUZ"
            valor={inmueble.conex_luz}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, conex_luz: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Conexión Telefono"
            valor={inmueble.conex_telefono}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, conex_telefono: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Conexión cable"
            valor={inmueble.conex_cable}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, conex_cable: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Conexión GAS"
            valor={inmueble.conex_gas}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, conex_gas: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Picker
            title="Edificio Especial"
            valor={inmueble.edific_espec}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, edific_espec: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            list={edificiosEspeciales}
          />
          <Switch
            title="Esp. Aire Acondicionado"
            valor={inmueble.espec_aire_acondic}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, espec_aire_acondic: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Esp. Tanque Subterraneo"
            valor={inmueble.espec_tanq_subterr}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, espec_tanq_subterr: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Esp. Tanque Elevado"
            valor={inmueble.espec_tanq_elevado}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, espec_tanq_elevado: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Esp. Área Servicio"
            valor={inmueble.espec_area_servic}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, espec_area_servic: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Esp. Garaje"
            valor={inmueble.espec_garaje}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, espec_garaje: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Esp. Depósito"
            valor={inmueble.espec_deposito}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, espec_deposito: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Mejora Lavanderia"
            valor={inmueble.mejora_lavanderia}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, mejora_lavanderia: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Mejora Parrillero"
            valor={inmueble.mejora_parrillero}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, mejora_parrillero: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Mejora Horno"
            valor={inmueble.mejora_horno}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, mejora_horno: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Mejora Piscina"
            valor={inmueble.mejora_piscina}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, mejora_piscina: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <Switch
            title="Mejora Otros"
            valor={inmueble.mejora_otros}
            onChange={async value => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, mejora_otros: value},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Observaciones"
            onChangeText={async text => {
              await this.setState (state => ({
                inmueble: {...state.inmueble, observaciones: text},
              }));
              global.inmuebleG.inmueble = this.state.inmueble;
            }}
            value={inmueble.observaciones}
            autoCapitalize={'characters'}
          />
        </ScrollView>
      );
    } else {
      return null;
    }
  }
}

export default InmuebleDetail;

const styles = StyleSheet.create ({
  container: {
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    paddingHorizontal: 4,
    height: 46,
    fontSize: 16,
    color: 'blue',
  },
});
