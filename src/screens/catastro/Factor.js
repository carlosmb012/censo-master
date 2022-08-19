import React, {useState} from 'react';

import PickerMultiple from './components/PickerMultiple2';

export default function Factor (props) {
  const [edifMat, setEdifMat] = useState (props.edificacMaterials);
  const materiales = JSON.parse (
    JSON.stringify (props.materials).split ('"nombre":').join ('"name":')
  );

  const _onChange = async value => {
    const {posicEdific, posicFactor} = props;
    //await setEdifMat ({...edifMat, material_nombre: value});
    await setEdifMat ({edifMat: {...edifMat, material_nombre: value}});
    //console.log ('edifMat', edifMat);
    global.inmuebleG.edificaciones[posicEdific].edificacMaterials[
      posicFactor
    ] = edifMat;
  };

  return (
    <PickerMultiple
      title={props.nombre}
      valor={edifMat.material_nombre}
      onChange={_onChange}
      list={materiales}
    />
  );
}
