import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator, Alert} from 'react-native';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Splash extends Component {
  componentDidMount () {
    this._loadInnitialState ().done ();
  }

  _loadInnitialState = async () => {
    try {
      var value = await AsyncStorage.getItem ('@User:token');
      var id = await AsyncStorage.getItem ('@User:id');
      console.log ('value?', value);
      if (id !== null) {
        this.props.navigation.dispatch (StackActions.replace ('Main'));
      } else {
        this.props.navigation.dispatch (StackActions.replace ('Login'));
      }
    } catch (e) {
      console.log('error en LoadInnitial', e)
    }
  };

  render () {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
