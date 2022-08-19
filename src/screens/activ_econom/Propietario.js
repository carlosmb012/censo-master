import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native';

import API from '../../utils';
import Title from '../catastro/components/Title';
import Input from 'CensoSmartCat/src/components/Input';
import Picker from 'CensoSmartCat/src/components/PickerMultiple';

import {extensiones} from '../catastro/Listas';

class Contribuyentes extends Component {
  state = {
    isLoading: true,
    propietario: {
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      ci: '',
      expedido: '',
      personeria: false,
      razon_social: '',
      nit: 0,
      patente_id: '',
    },
  };

  async componentDidMount() {
    const params = this.props.route.params;
    if (Object.keys(params).length !== 0) {
      const propietario = await API.getPropietarioP(params.id);
      if (propietario !== null) {
        await this.setState({propietario});
      }
    }
    //console.log('propietario', this.state.propietario);
    global.patenteG.propietario = this.state.propietario;
    this.setState({isLoading: false});
  }

  render() {
    const {propietario, isLoading} = this.state;
    if (isLoading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.text}>Persona Natural </Text>
          <Switch
            style={styles.switch}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={propietario.personeria ? '#668dcb' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={async (value) => {
              await this.setState((state) => ({
                propietario: {...state.propietario, personeria: value},
              }));
              global.patenteG.propietario = this.state.propietario;
            }}
            value={propietario.personeria}
          />
          <Text style={styles.text}>Persona Jurídica</Text>
        </View>

        {propietario.personeria ? (
          <View>
            <Title title="PERSONA JURIDICA" />
            <Input
              title="Razón Social"
              valor={propietario.razon_social}
              onChange={async (text) => {
                await this.setState((state) => ({
                  propietario: {...state.propietario, razon_social: text},
                }));
                global.patenteG.propietario = this.state.propietario;
              }}
            />
            <Input
              title="NIT"
              valor={propietario.nit.toString()}
              onChange={async (text) => {
                await this.setState((state) => ({
                  propietario: {...state.propietario, nit: text},
                }));
                global.patenteG.propietario = this.state.propietario;
              }}
              number
            />
            <Title title="REPRESENTANTE" />
          </View>
        ) : (
          <Title title="DATOS DEL PROPIETARIO" />
        )}
        <Input
          title="1er Apellido"
          valor={propietario.primer_apellido}
          onChange={async (text) => {
            await this.setState((state) => ({
              propietario: {...state.propietario, primer_apellido: text},
            }));
            global.patenteG.propietario = this.state.propietario;
          }}
        />
        <Input
          title="2do Apellido"
          valor={propietario.segundo_apellido}
          onChange={async (text) => {
            await this.setState((state) => ({
              propietario: {...state.propietario, segundo_apellido: text},
            }));
            global.patenteG.propietario = this.state.propietario;
          }}
        />
        <Input
          title="1er Nombre"
          valor={propietario.primer_nombre}
          onChange={async (text) => {
            await this.setState((state) => ({
              propietario: {...state.propietario, primer_nombre: text},
            }));
            global.patenteG.propietario = this.state.propietario;
          }}
        />
        <Input
          title="2do Nombre"
          valor={propietario.segundo_nombre}
          onChange={async (text) => {
            await this.setState((state) => ({
              propietario: {...state.propietario, segundo_nombre: text},
            }));
            global.patenteG.propietario = this.state.propietario;
          }}
        />
        <Input
          title="Cédula de Identidad"
          valor={propietario.ci}
          onChange={async (text) => {
            await this.setState((state) => ({
              propietario: {...state.propietario, ci: text},
            }));
            global.patenteG.propietario = this.state.propietario;
          }}
        />
        <Picker
          title="Extensión"
          valor={propietario.expedido}
          onChange={async (value) => {
            await this.setState((state) => ({
              propietario: {...state.propietario, expedido: value},
            }));
            global.patenteG.propietario = this.state.propietario;
          }}
          list={extensiones}
        />
      </ScrollView>
    );
  }
}

export default Contribuyentes;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  text: {
    color: 'black',
    fontSize: 16,
    //fontWeight: 'bold'
  },
});
