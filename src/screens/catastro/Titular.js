import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Title from './components/Title';
import Input from 'CensoSmartCat/src/components/Input';
import Picker from 'CensoSmartCat/src/components/PickerMultiple';

import {tiposContribuyentes, extensiones} from './Listas';

class Titular extends Component {
  constructor (props) {
    super (props);
    this.state = {
      titular: this.props.titular,
    };
  }

  render () {
    const {titular} = this.state;
    const {posicion, personeria} = this.props;
    return (
      <View>
        {personeria
          ? <View>
              <Title title="PERSONA JURIDICA" />
              <Input
                title="Razón Social"
                valor={titular.razon_social}
                onChange={async text => {
                  await this.setState (state => ({
                    titular: {...state.titular, razon_social: text},
                  }));
                  global.inmuebleG.propietarios[
                    posicion - 1
                  ] = this.state.titular;
                }}
              />
              <Input
                title="NIT"
                valor={titular.nit.toString ()}
                onChange={async text => {
                  await this.setState (state => ({
                    titular: {...state.titular, nit: text},
                  }));
                  global.inmuebleG.propietarios[
                    posicion - 1
                  ] = this.state.titular;
                }}
                number
              />
              <Title title="REPRESENTANTE" />
            </View>
          : <Title title="DATOS DEL TITULAR" posicion={posicion} />}
        {posicion === '1' &&
          <Picker
            title="Tipo"
            valor={titular.tipo}
            onChange={async value => {
              await this.setState (state => ({
                titular: {...state.titular, tipo: value},
              }));
              global.inmuebleG.propietarios.map (item => {
                item.tipo = value;
              });
            }}
            list={tiposContribuyentes}
          />}
        <Input
          title="1er Apellido"
          valor={titular.primer_apellido}
          onChange={async text => {
            await this.setState (state => ({
              titular: {...state.titular, primer_apellido: text},
            }));
            global.inmuebleG.propietarios[posicion - 1] = this.state.titular;
          }}
        />
        <Input
          title="2do Apellido"
          valor={titular.segundo_apellido}
          onChange={async text => {
            await this.setState (state => ({
              titular: {...state.titular, segundo_apellido: text},
            }));
            global.inmuebleG.propietarios[posicion - 1] = this.state.titular;
          }}
        />
        <Input
          title="1er Nombre"
          valor={titular.primer_nombre}
          onChange={async text => {
            await this.setState (state => ({
              titular: {...state.titular, primer_nombre: text},
            }));
            global.inmuebleG.propietarios[posicion - 1] = this.state.titular;
          }}
        />
        <Input
          title="2do Nombre"
          valor={titular.segundo_nombre}
          onChange={async text => {
            await this.setState (state => ({
              titular: {...state.titular, segundo_nombre: text},
            }));
            global.inmuebleG.propietarios[posicion - 1] = this.state.titular;
          }}
        />
        <Input
          title="Cédula de Identidad"
          valor={titular.ci}
          onChange={async text => {
            await this.setState (state => ({
              titular: {...state.titular, ci: text},
            }));
            global.inmuebleG.propietarios[posicion - 1] = this.state.titular;
          }}
        />
        <Picker
          title="Extensión"
          valor={titular.expedido}
          onChange={async value => {
            await this.setState (state => ({
              titular: {...state.titular, expedido: value},
            }));
            global.inmuebleG.propietarios[posicion - 1] = this.state.titular;
          }}
          list={extensiones}
        />

      </View>
    );
  }
}

export default Titular;
