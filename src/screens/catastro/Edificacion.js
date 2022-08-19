import React, {Component, PureComponent} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import API from '../../utils';
import Factor from './Factor2';
import Title from './components/Title';
import Picker2 from './components/PickerMultiple2';
import Input from 'CensoSmartCat/src/components/Input';
import Picker from 'CensoSmartCat/src/components/PickerMultiple';

import {
  bloques,
  pisos,
  tiposConstrucc,
  estadosConstrucc,
  evaluaciones,
} from './Listas';

class Edificacion extends PureComponent {
  state = {
    edificacion: this.props,
    factores: [],
    edificacMaterials: [],
  };

  async componentDidMount () {
    const {posicion} = this.props;
    const {edificacion} = this.state;
    const edificacMaterials = await API.getEdificacionMaterial (edificacion.id);
    global.inmuebleG.edificaciones[
      posicion
    ].edificacMaterials = edificacMaterials;
    //console.log ('edificacMaterials', edificacMaterials);
    let idCiudad = await AsyncStorage.getItem ('@User:idCiudad');
    const ciudad = await API.getCiudad (parseInt (idCiudad));
    const factores = ciudad.factors;
    await this.setState ({edificacMaterials, factores});
  }

  renderItem = ({item, index}) => {
    return (
      <Factor
        {...item}
        posicFactor={index}
        posicEdific={this.props.posicion}
        edificacMaterials={this.state.edificacMaterials[index]}
      />
    );
  };

  render () {
    const {posicion} = this.props;
    const {edificacion, factores} = this.state;
    return (
      <View style={styles.container}>
        <Title title="Unidad Edificada Nro." posicion={posicion + 1} />
        <View style={styles.row}>
          <View style={styles.bloq}>
            <Picker2
              title="Blq"
              valor={edificacion.bloque.toString ()}
              onChange={async value => {
                await this.setState (state => ({
                  edificacion: {...state.edificacion, bloque: value},
                }));
                global.inmuebleG.edificaciones[posicion].bloque = value;
              }}
              list={bloques}
              blq
            />
          </View>
          <View style={styles.piso}>
            <Picker2
              title="Piso"
              valor={edificacion.piso.toString ()}
              onChange={async value => {
                await this.setState (state => ({
                  edificacion: {...state.edificacion, piso: value},
                }));
                global.inmuebleG.edificaciones[posicion].piso = value;
              }}
              list={pisos}
              blq
            />
          </View>
          <View style={styles.apto}>
            <Input
              title="Apto"
              valor={edificacion.apto.toString ()}
              onChange={async text => {
                await this.setState (state => ({
                  edificacion: {...state.edificacion, apto: text},
                }));
                global.inmuebleG.edificaciones[posicion].apto = text;
              }}
              number
            />
          </View>
        </View>
        <Input
          title="Año de Construcción"
          valor={edificacion.anio_construcc.toString ()}
          onChange={async text => {
            await this.setState (state => ({
              edificacion: {...state.edificacion, anio_construcc: text},
            }));
            global.inmuebleG.edificaciones[posicion].anio_construcc = text;
          }}
          number
        />
        <Picker
          title="Tipo construcción"
          valor={edificacion.tipo_construcc}
          onChange={async value => {
            await this.setState (state => ({
              edificacion: {...state.edificacion, tipo_construcc: value},
            }));
            global.inmuebleG.edificaciones[posicion].tipo_construcc = value;
          }}
          list={tiposConstrucc}
        />
        <Picker
          title="Estado construcción"
          valor={edificacion.estado_construcc}
          onChange={async value => {
            await this.setState (state => ({
              edificacion: {...state.edificacion, estado_construcc: value},
            }));
            global.inmuebleG.edificaciones[posicion].estado_construcc = value;
          }}
          list={estadosConstrucc}
        />
        <Input
          title="Superficie (s/doc.)"
          valor={edificacion.superficie.toString ()}
          onChange={async text => {
            await this.setState (state => ({
              edificacion: {...state.edificacion, superficie: text},
            }));
            global.inmuebleG.edificaciones[posicion].superficie = text;
          }}
          number
        />
        <Picker
          title="Evaluación"
          valor={edificacion.evaluacion}
          onChange={async value => {
            await this.setState (state => ({
              edificacion: {...state.edificacion, evaluacion: value},
            }));
            global.inmuebleG.edificaciones[posicion].evaluacion = value;
          }}
          list={evaluaciones}
        />
        <FlatList
          ref="scrollPick"
          keyExtractor={(item, index) => index.toString ()}
          data={factores}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default Edificacion;

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloq: {
    flex: 37,
    flexDirection: 'row',
  },
  piso: {
    flex: 37,
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  apto: {
    flex: 26,
    flexDirection: 'row',
  },
});
