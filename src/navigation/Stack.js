import 'react-native-gesture-handler';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Splash from './Splash';
import Main from '../screens/main';
import Login from '../screens/login';
import TabCatastro from './TabCatastro';
import Visitas from '../screens/catastro/Visitas';
import InmuebleList from '../screens/catastro/InmuebleList';
import InmuebleGList from '../screens/catastro/InmuebleGList';
import TabActivEconom from './TabActivEconom';
import VisitasAE from '../screens/activ_econom/Visitas';
import ActividadList from '../screens/activ_econom/ActividadList';
import SavedActividadList from '../screens/activ_econom/SavedActividadList';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const screenOptions = {
  headerTintColor: 'white',
  headerStyle: {backgroundColor: '#4781ff'},
  headerTitleStyle: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
};

const screenOptions2 = {
  headerTintColor: 'white',
  headerStyle: {backgroundColor: '#4781ff'},
  headerTitleStyle: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

const leftIcon = (navigation, icon) => (
  <Icon
    name={icon}
    style={{marginLeft: 20}}
    size={26}
    color="white"
    onPress={() => {
      navigation.openDrawer();
    }}
  />
);

const rightIcon = (navigation, icon) => (
  <Icon
    name={icon}
    style={{marginRight: 16}}
    size={30}
    color="white"
    onPress={() => navigation.navigate('Main')}
  />
);

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={screenOptions}>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={() => ({headerShown: false})}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={() => ({title: 'SmartCAT Censo'})}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={({navigation, route}) => ({
          title: 'SmartCAT Censo',
          headerLeft: () => leftIcon(navigation, 'bars'),
        })}
      />
      <Stack.Screen
        name="Visitas"
        component={Visitas}
        options={({navigation, route}) => ({
          title: 'Visitas Programadas',
          headerRight: () => rightIcon(navigation, 'home'),
        })}
      />
      <Stack.Screen
        name="Inmuebles"
        component={InmuebleList}
        options={({navigation, route}) => ({
          title: 'Lista de Inmuebles',
          headerRight: () => rightIcon(navigation, 'home'),
        })}
      />
      <Stack.Screen
        name="TabCatastro"
        component={TabCatastro}
        options={({navigation, route}) => ({
          title: 'Registro de Censo',
          headerRight: () => rightIcon(navigation, 'home'),
        })}
      />
      <Stack.Screen
        name="VisitasAE"
        component={VisitasAE}
        options={({navigation, route}) => ({
          title: 'Visitas Programadas',
          headerRight: () => rightIcon(navigation, 'home'),
        })}
      />
      <Stack.Screen
        name="Actividades"
        component={ActividadList}
        options={({navigation, route}) => ({
          title: 'Lista de Actividades',
          headerRight: () => rightIcon(navigation, 'home'),
        })}
      />
      <Stack.Screen
        name="TabActivEconom"
        component={TabActivEconom}
        options={({navigation, route}) => ({
          title: 'Registro de Censo',
          headerRight: () => rightIcon(navigation, 'home'),
        })}
      />
    </Stack.Navigator>
  );
}

function StackInmuebleSaved() {
  return (
    <Stack.Navigator screenOptions={screenOptions2}>
      <Stack.Screen
        name="InmuebleGList"
        component={InmuebleGList}
        options={({navigation, route}) => ({
          title: 'Lista de Inmuebles Guardados',
          headerLeft: () => leftIcon(navigation, 'bars'),
        })}
      />
    </Stack.Navigator>
  );
}

function StackActEconomSaved() {
  return (
    <Stack.Navigator screenOptions={screenOptions2}>
      <Stack.Screen
        name="SavedActividadList"
        component={SavedActividadList}
        options={({navigation, route}) => ({
          title: 'Actividades Económicas Guardadas',
          headerLeft: () => leftIcon(navigation, 'bars'),
        })}
      />
    </Stack.Navigator>
  );
}

export default function stack() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Inicio"
        drawerStyle={{width: 262}}
        drawerContentOptions={{
          activeTintColor: '#0857ff',
          activeBackgroundColor: '#c8d9fc',
          inactiveTintColor: '#0857ff',
        }}>
        <Drawer.Screen
          name="Inicio"
          component={MyStack}
          options={({navigation, route}) => ({
            title: 'Inicio',
            drawerIcon: () => <Icon name="home" size={24} color="#0857ff" />,
          })}
        />
        <Drawer.Screen
          name="InmuebleSaved"
          component={StackInmuebleSaved}
          options={({navigation, route}) => ({
            title: 'Inmuebles Guardados',
            drawerIcon: () => <Icon name="cloud" size={24} color="#0857ff" />,
          })}
        />
        <Drawer.Screen
          name="ActEconomSaved"
          component={StackActEconomSaved}
          options={({navigation, route}) => ({
            title: 'Act. Eco. Guardadas',
            drawerIcon: () => <Icon name="cloud" size={24} color="#0857ff" />,
          })}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
