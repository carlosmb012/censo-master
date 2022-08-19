import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  Alert,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

import API from '../../utils';
import Input from 'CensoSmartCat/src/components/Input';
import Switch from 'CensoSmartCat/src/components/Switch';
import Button from 'CensoSmartCat/src/components/Button';
import Picker from 'CensoSmartCat/src/components/PickerMultiple';
import PickerDate from 'CensoSmartCat/src/components/PickerDate';

class Actividad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      patente: {
        estado: 'Sin Procesar',
        observac_dada: '-',
        latitud: 0,
        longitud: 0,
        cod_pat: 0,
        raz_soc_pat: '',
        fecha_inicio: '2012/06/15',
        superficie: 0,
        ambulante: false,
        direccion: '',
        edificio: '',
        cod_uv: 0,
        cod_man: 0,
        cod_pred: 0,
        cod_blq: 0,
        cod_piso: 0,
        cod_apto: '',
        email: '',
        telefono1: 0,
        telefono2: 0,
        observaciones: '',

        ciudad_id: 0,
        visita_program_id: 0,
        pat_actividades_id: 0,
      },
      actividades: [],
      show: false,
      fotos: [],
      image: null,
    };
    global.patenteG = {patente: null};
  }

  async componentDidMount() {
    let actividades = await API.getActividadesP();
    actividades = JSON.parse(
      JSON.stringify(actividades).split('"descrip":').join('"name":'),
    );
    actividades = JSON.parse(
      JSON.stringify(actividades).split('"id_act":').join('"id":'),
    );
    const params = this.props.route.params;
    console.log('paramsAct', params);
    console.log('es vacio', Object.keys(params).length === 0);
    if (Object.keys(params).length === 0) {
      let idCiudad = await AsyncStorage.getItem('@User:idCiudad');
      await this.setState((state) => ({
        patente: {
          ...state.patente,
          pat_actividades_id: actividades[0].id,
          ciudad_id: idCiudad,
        },
      }));
    } else {
      const patente = await API.getPatente(params.id);
      if (patente === null) {
        Alert.alert(
          'Alerta',
          'Revise su conexión a internet y vuelva a intentar',
        );
      } else {
        await this.setState({patente});
        let fotos = await API.getFotosP(params.id);
        if (fotos !== null) {
          fotos = JSON.parse(
            JSON.stringify(fotos).split('"foto":').join('"uri":'),
          );
          await fotos.map((item) => {
            item.data = item.uri.substring(22, item.uri.length);
          });
          await this.setState({fotos});
        }
      }
    }
    global.patenteG.patente = this.state.patente;
    global.patenteG.imagens = this.state.fotos;
    this.setState({isLoading: false, actividades});
  }

  _onChange = (event) => {
    this.actualizarFecha(event.nativeEvent.timestamp);
  };

  actualizarFecha = (time) => {
    console.log('time', time);
    let dia = new Date(time).getDate();
    let mes = new Date(time).getMonth() + 1;
    let anio = new Date(time).getFullYear();
    if (!isNaN(dia)) {
      let newFecha = anio + '/' + mes + '/' + dia;
      this.setState((state) => ({
        patente: {...state.patente, fecha_inicio: newFecha},
        show: false,
      }));
      global.patenteG.patente.fecha_inicio = newFecha;
      console.log('fecha', newFecha);
    } else {
      this.setState({show: false, show2: false});
    }
  };

  _tomarFoto = () => {
    if (global.patenteG.imagens.length < 3) {
      ImagePicker.openCamera({
        compressImageQuality: 1,
        includeExif: true,
        cropping: false,
        includeBase64: true,
        mediaType: 'photo',
        multiple: true,
        compressImageMaxHeight: 800,
        compressImageMaxWidth: 650,
      }).then((image) => {
        //console.log ('received image', image);
        console.log('orientat', image.width > image.height);
        if (image.width > image.height) {
          this.setState({
            image: {
              uri: image.path,
              data: image.data,
            },
          });
          global.patenteG.imagens.unshift(this.state.image);
          this.setState({fotos: global.patenteG.imagens});
        } else {
          Alert.alert('Alerta', 'Solo tomar fotos de manera horizontal.');
        }
      });
    } else {
      Alert.alert('Alerta', 'Solo tomar 3 fotos máximo.');
    }
  };

  eliminarFoto = (id) => {
    var pos = global.patenteG.imagens.findIndex((i) => i.uri === id);
    Alert.alert(
      'Eliminar foto',
      '¿Desea eliminar la foto?',
      [
        {text: 'Cancelar'},
        {
          text: 'Eliminar',
          onPress: () => {
            global.patenteG.imagens.splice(pos, 1);
            this.setState({fotos: global.patenteG.imagens});
          },
        },
      ],
      {cancelable: false},
    );
  };

  renderImage(image) {
    return (
      <View style={styles.containerImage}>
        <Image style={styles.image} source={image} />
        <TouchableOpacity
          onPress={() => this.eliminarFoto(image.uri)}
          style={styles.btnDelete}>
          <Icon name="trash" color="orange" size={30} />
        </TouchableOpacity>
      </View>
    );
  }

  renderItem = ({item}) => {
    return this.renderImage(item);
  };

  render() {
    const {patente, isLoading, actividades} = this.state;
    if (isLoading) {
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    if (patente) {
      return (
        <ScrollView style={styles.container}>
          <Input
            title="Razon Social"
            valor={patente.raz_soc_pat}
            onChange={async (text) => {
              await this.setState((state) => ({
                patente: {...state.patente, raz_soc_pat: text},
              }));
              global.patenteG.patente = this.state.patente;
            }}
          />
          <Picker
            title="Actividad"
            valor={patente.pat_actividades_id}
            onChange={async (value) => {
              await this.setState((state) => ({
                patente: {...state.patente, pat_actividades_id: value},
              }));
              global.patenteG.patente = this.state.patente;
            }}
            list={actividades}
            ids={true}
          />
          <PickerDate
            title="Fecha Inicio"
            fecha={patente.fecha_inicio}
            onChange={this._onChange}
            onPress={() => this.setState({show: true})}
            show={this.state.show}
          />
          <Input
            title="Superficie"
            valor={patente.superficie.toString()}
            onChange={async (text) => {
              await this.setState((state) => ({
                patente: {...state.patente, superficie: text},
              }));
              global.patenteG.patente = this.state.patente;
            }}
            number
          />
          <Switch
            title="Ambulante"
            valor={patente.ambulante}
            onChange={async (value) => {
              await this.setState((state) => ({
                patente: {...state.patente, ambulante: value},
              }));
              global.patenteG.patente = this.state.patente;
            }}
          />
          {!patente.ambulante && (
            <View>
              <View style={styles.row}>
                <View style={styles.bloq}>
                  <Input
                    title="U.V."
                    valor={patente.cod_uv.toString()}
                    onChange={async (text) => {
                      await this.setState((state) => ({
                        patente: {...state.patente, cod_uv: text},
                      }));
                      global.patenteG.patente = this.state.patente;
                    }}
                    number
                  />
                </View>
                <View style={styles.medio}>
                  <Input
                    title="Mz"
                    valor={patente.cod_man.toString()}
                    onChange={async (text) => {
                      await this.setState((state) => ({
                        patente: {...state.patente, cod_man: text},
                      }));
                      global.patenteG.patente = this.state.patente;
                    }}
                    number
                  />
                </View>
                <View style={styles.bloq}>
                  <Input
                    title="Lote"
                    valor={patente.cod_pred.toString()}
                    onChange={async (text) => {
                      await this.setState((state) => ({
                        patente: {...state.patente, cod_pred: text},
                      }));
                      global.patenteG.patente = this.state.patente;
                    }}
                    number
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.bloq}>
                  <Input
                    title="Blq"
                    valor={patente.cod_blq.toString()}
                    onChange={async (text) => {
                      await this.setState((state) => ({
                        patente: {...state.patente, cod_blq: text},
                      }));
                      global.patenteG.patente = this.state.patente;
                    }}
                    number
                  />
                </View>
                <View style={styles.medio}>
                  <Input
                    title="Piso"
                    valor={patente.cod_piso.toString()}
                    onChange={async (text) => {
                      await this.setState((state) => ({
                        patente: {...state.patente, cod_piso: text},
                      }));
                      global.patenteG.patente = this.state.patente;
                    }}
                    number
                  />
                </View>
                <View style={styles.bloq}>
                  <Input
                    title="Apto"
                    valor={patente.cod_apto}
                    onChange={async (text) => {
                      await this.setState((state) => ({
                        patente: {...state.patente, cod_apto: text},
                      }));
                      global.patenteG.patente = this.state.patente;
                    }}
                  />
                </View>
              </View>
              <Input
                title="Dirección"
                valor={patente.direccion}
                onChange={async (text) => {
                  await this.setState((state) => ({
                    patente: {...state.patente, direccion: text},
                  }));
                  global.patenteG.patente = this.state.patente;
                }}
              />
              <Input
                title="Edificio"
                valor={patente.edificio}
                onChange={async (text) => {
                  await this.setState((state) => ({
                    patente: {...state.patente, edificio: text},
                  }));
                  global.patenteG.patente = this.state.patente;
                }}
              />
            </View>
          )}
          <Input
            title="Correo"
            valor={patente.email}
            onChange={async (text) => {
              await this.setState((state) => ({
                patente: {...state.patente, email: text},
              }));
              global.patenteG.patente = this.state.patente;
            }}
          />
          <Input
            title="Telefono 1"
            valor={patente.telefono1.toString()}
            onChange={async (text) => {
              await this.setState((state) => ({
                patente: {...state.patente, telefono1: text},
              }));
              global.patenteG.patente = this.state.patente;
            }}
            number
          />
          <Input
            title="Telefono 2"
            valor={patente.telefono2.toString()}
            onChange={async (text) => {
              await this.setState((state) => ({
                patente: {...state.patente, telefono2: text},
              }));
              global.patenteG.patente = this.state.patente;
            }}
            number
          />
          <Input
            title="Observaciones"
            valor={patente.observaciones}
            onChange={async (text) => {
              await this.setState((state) => ({
                patente: {...state.patente, observaciones: text},
              }));
              global.patenteG.patente = this.state.patente;
            }}
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
          {this.state.fotos && (
            <FlatList
              horizontal
              keyExtractor={(item) => item.uri.toString()}
              data={this.state.fotos}
              renderItem={this.renderItem}
            />
          )}
        </ScrollView>
      );
    } else {
      return null;
    }
  }
}

export default Actividad;

const styles = StyleSheet.create({
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloq: {
    flex: 1,
  },
  medio: {
    flex: 1,
    marginHorizontal: 4,
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
