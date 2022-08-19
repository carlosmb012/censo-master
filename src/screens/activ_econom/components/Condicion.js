import React, {Component} from 'react';
import {View} from 'react-native';
import Input from 'CensoSmartCat/src/components/Input';
import Switch from 'CensoSmartCat/src/components/Switch';

export default class Condicion extends Component {
  state = {
    resultado: false,
    observaciones: '',
  };

  async componentDidMount() {
    let PAT = global.patenteG.resultado[this.props.pos];
    await this.setState({
      resultado: PAT.resultado,
      observaciones: PAT.observaciones,
    });
  }

  render() {
    const {resultado, observaciones} = this.state;
    const {descrip, pos} = this.props;
    return (
      <View style={{marginHorizontal: 4}}>
        <Switch
          title={descrip}
          valor={resultado}
          onChange={async (value) => {
            await this.setState({resultado: value});
            global.patenteG.resultado[pos].resultado = value;
          }}
          border={true}
        />
        <Input
          title="Observación"
          valor={observaciones}
          onChange={async (text) => {
            await this.setState({observaciones: text});
            global.patenteG.resultado[pos].observaciones = text;
          }}
        />
      </View>
    );
  }
}
