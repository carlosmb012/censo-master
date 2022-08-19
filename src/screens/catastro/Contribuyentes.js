import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

import API from '../../utils';
import Titular from './Titular';
import Title from './components/Title';
import Input from 'CensoSmartCat/src/components/Input';
import Button from 'CensoSmartCat/src/components/Button';
import Picker from 'CensoSmartCat/src/components/PickerMultiple';
import PickerDate from 'CensoSmartCat/src/components/PickerDate';

import {modosAdquision} from './Listas';

class Contribuyentes extends Component {
  state = {
    isLoading: true,
    inmueble: null,
    propietarios: null,
    personaJuridica: false,

    fotos: [],
    image: null,

    show: false,
    show2: false,
  };

  async componentDidMount () {
    const idInmueble = this.props.route.params.id;
    const inmueble = await API.getInmueble (idInmueble);
    if (inmueble !== null) {
      await this.setState ({inmueble});
    }
    //console.log ('inmueble en contrib', this.state.inmueble);
    const propietarios = await API.getPropietario (idInmueble);
    if (propietarios !== null) {
      await this.setState ({propietarios});
      const personaJuridica = this.state.propietarios[0].personeria;
      await this.setState ({personaJuridica});
    }
    let fotos = await API.getFotos (idInmueble);
    if (fotos !== null) {
      fotos = JSON.parse (
        JSON.stringify (fotos).split ('"foto":').join ('"uri":')
      );
      await fotos.map (item => {
        item.data = item.uri.substring (22, item.uri.length);
      });
      await this.setState ({fotos});
    }
    //console.log ('propietarios', this.state.propietarios);
    global.inmuebleG.imagens = this.state.fotos;
    global.inmuebleG.propietarios = this.state.propietarios;
    global.inmuebleG.personaJuridica = this.state.personaJuridica;
    this.setState ({isLoading: false});
  }

  _onChange = event => {
    this.actualizarFecha (event.nativeEvent.timestamp, 1);
  };

  _setDate = event => {
    this.actualizarFecha (event.nativeEvent.timestamp, 0);
  };

  actualizarFecha = (time, tipo) => {
    console.log (time);
    let dia = new Date (time).getDate ();
    let mes = new Date (time).getMonth () + 1;
    let anio = new Date (time).getFullYear ();
    if (!isNaN (dia)) {
      let newFecha = anio + '/' + mes + '/' + dia;
      if (tipo == 1) {
        this.setState (state => ({
          inmueble: {...state.inmueble, fecha_docum: newFecha},
          show: false,
        }));
        global.inmuebleG.inmueble.fecha_docum = newFecha;
      } else {
        this.setState (state => ({
          inmueble: {...state.inmueble, fecha_ddrr: newFecha},
          show2: false,
        }));
        global.inmuebleG.inmueble.fecha_ddrr = newFecha;
      }
      console.log ('fecha', tipo + '-' + newFecha);
    } else {
      this.setState ({show: false, show2: false});
    }
  };

  _tomarFoto = () => {
    if (global.inmuebleG.imagens.length < 6) {
      ImagePicker.openCamera ({
        compressImageQuality: 1,
        includeExif: true,
        cropping: false,
        includeBase64: true,
        mediaType: 'photo',
        multiple: true,
        compressImageMaxHeight: 800,
        compressImageMaxWidth: 650,
      }).then (image => {
        //console.log ('received image', image);
        console.log ('orientat', image.width > image.height);
        if (image.width > image.height) {
          this.setState ({
            image: {
              uri: image.path,
              data: image.data,
            },
          });
          global.inmuebleG.imagens.unshift (this.state.image);
          this.setState ({fotos: global.inmuebleG.imagens});
        } else {
          Alert.alert ('Alerta', 'Solo tomar fotos de manera horizontal.');
        }
      });
    } else {
      Alert.alert ('Alerta', 'Solo tomar 6 fotos máximo.');
    }
  };

  renderImage (image) {
    return (
      <View style={styles.containerImage}>
        <Image style={styles.image} source={image} />
        <TouchableOpacity
          onPress={() => this.eliminarFoto (image.uri)}
          style={styles.btnDelete}
        >
          <Icon name="trash" color="orange" size={30} />
        </TouchableOpacity>
      </View>
    );
  }

  eliminarFoto = id => {
    var pos = global.inmuebleG.imagens.findIndex (i => i.uri === id);
    Alert.alert (
      'Eliminar foto',
      '¿Desea eliminar la foto?',
      [
        {text: 'Cancelar'},
        {
          text: 'Eliminar',
          onPress: () => {
            global.inmuebleG.imagens.splice (pos, 1);
            this.setState ({fotos: global.inmuebleG.imagens});
          },
        },
      ],
      {cancelable: false}
    );
  };

  renderItem = ({item}) => {
    return this.renderImage (item);
  };

  render () {
    const {propietarios, inmueble, personaJuridica, isLoading} = this.state;
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
          <View style={styles.row}>
            <Text style={styles.text}>Persona Natural </Text>
            <Switch
              style={styles.switch}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={personaJuridica ? '#668dcb' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => {
                this.setState ({personaJuridica: value});
                global.inmuebleG.personaJuridica = value;
              }}
              value={personaJuridica}
            />
            <Text style={styles.text}>Persona Jurídica</Text>
          </View>
          {propietarios &&
            <View>
              <Titular
                posicion="1"
                titular={propietarios[0]}
                personeria={personaJuridica}
              />
              {!personaJuridica &&
                <Titular posicion="2" titular={propietarios[1]} />}
            </View>}
          <Title title="DOCUMENTACIÓN" />
          <Input
            title="Superficie seg. doc. (m²)"
            valor={inmueble.superficie}
            onChange={text => {
              this.setState (state => ({
                inmueble: {...state.inmueble, superficie: text},
              }));
              global.inmuebleG.inmueble.superficie = text;
            }}
            number
          />
          <Picker
            title="Modo Adquisición"
            valor={inmueble.modo_adquisic}
            onChange={value => {
              this.setState (state => ({
                inmueble: {...state.inmueble, modo_adquisic: value},
              }));
              global.inmuebleG.inmueble.modo_adquisic = value;
            }}
            list={modosAdquision}
          />
          <Input
            title="Tipo Documento"
            valor={inmueble.tipo_docum}
            onChange={text => {
              this.setState (state => ({
                inmueble: {...state.inmueble, tipo_docum: text},
              }));
              global.inmuebleG.inmueble.tipo_docum = text;
            }}
          />
          <PickerDate
            title="Fecha Documentación"
            fecha={inmueble.fecha_docum}
            onChange={this._onChange}
            onPress={() => this.setState ({show: true})}
            show={this.state.show}
          />
          <Title title="INSCRIPCIÓN EN DERECHOS REALES" />
          <Input
            title="Nro. de Registro"
            valor={inmueble.nro_ddrr}
            onChange={text => {
              this.setState (state => ({
                inmueble: {...state.inmueble, nro_ddrr: text},
              }));
              global.inmuebleG.inmueble.nro_ddrr = text;
            }}
          />
          <PickerDate
            title="Fecha Registro"
            fecha={inmueble.fecha_ddrr}
            onChange={this._setDate}
            onPress={() => this.setState ({show2: true})}
            show={this.state.show2}
          />
          <View style={{alignItems: 'center'}}>
            <Button
              title="TOMAR FOTOS"
              action={this._tomarFoto}
              color="#4781ff"
            />
            <Text style={{color: 'red'}}>
              Por favor tomar la foto en forma horizontal
            </Text>
          </View>
          {/* <ScrollView horizontal>
          {this.state.fotos &&
            this.state.fotos.map (i => (
              <View key={i.uri}>{this.renderImage (i)}</View>
            ))}
        </ScrollView> */}
          {this.state.fotos &&
            <FlatList
              horizontal
              keyExtractor={item => item.uri.toString ()}
              data={this.state.fotos}
              renderItem={this.renderItem}
            />}
        </ScrollView>
      );
    } else {
      return null;
    }
  }
}

export default Contribuyentes;

const styles = StyleSheet.create ({
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
  containerImage: {
    width: 160,
    height: 100,
    margin: 2,
  },
  image: {
    flex: 1,
  },
  btnDelete: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'transparent',
  },
});
