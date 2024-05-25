import React, { useState, useEffect } from 'react';
import { View, StatusBar, Button } from 'react-native';
import Clinicas from './screens/Clinicas';
import Login from './screens/Login';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/Register';
import Perfil from './screens/Perfil';
import CitasUsuario from './screens/CitasUsuario';
import ValoracionesUsuario from './screens/ValoracionesUsuario';

const Stack = createStackNavigator();


export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Clinicas" component={Clinicas} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="CitasUsuario" component={CitasUsuario} />
          <Stack.Screen name="ValoracionesUsuario" component={ValoracionesUsuario} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}


