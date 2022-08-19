/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
//TODO revisar gesture
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar} from 'react-native';

import Stack from './src/navigation/Stack'

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="default" backgroundColor="#000"/>
      <Stack />
    </>
  );
};

export default App;
