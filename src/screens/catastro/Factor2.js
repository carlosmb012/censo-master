import React, {Component} from 'react';

import PickerMultiple from './components/PickerMultiple2';

export default class extends Component {
  constructor (props) {
    super (props);
    this.state = {
      edifMat: props.edificacMaterials,
      materiales: JSON.parse (
        JSON.stringify (props.materials).split ('"nombre":').join ('"name":')
      ),
    };
  }

  _onChange = async value => {
    const {posicEdific, posicFactor} = this.props;
    await this.setState (state => ({
      edifMat: {...state.edifMat, material_nombre: value},
    }));
    global.inmuebleG.edificaciones[posicEdific].edificacMaterials[
      posicFactor
    ] = this.state.edifMat;
  };

  render () {
    const {edifMat, materiales} = this.state;
    return (
      <PickerMultiple
        title={this.props.nombre}
        valor={edifMat.material_nombre}
        onChange={this._onChange}
        list={materiales}
      />
    );
  }
}
