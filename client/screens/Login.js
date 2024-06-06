import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Image, TouchableOpacity, Alert} from 'react-native';
import Register from './Register';
import Clinicas from './Clinicas'

import logo from '../assets/logo.png';
import { useNavigation } from '@react-navigation/native';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [user, setUser] = useState('');

  async function getUser(email) {
    try {
      const response = await fetch(`http://200.234.236.242:8080/usuariosmail/${email}`);
      const userData = await response.json();
      setUser(userData);
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Clinicas', params: { user: userData } }],
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://200.234.236.242:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        getUser(email);
      } else {
        // Si la respuesta indica que las credenciales son inválidas, mostrar un mensaje de error.
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      // Si hay algún error al realizar la solicitud, mostrar un mensaje de error.
      Alert.alert('Error', 'Ha ocurrido un error al intentar iniciar sesión.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.titulo}>Psicolo<Text style={styles.bold}>Go</Text></Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su correo"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>¿No tienes una cuenta? <Text style={styles.link} onPress={() => navigation.navigate('Register')}>Regístrate ahora</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 20,
  },
  titulo: {
    color: '#fe8b06',
    fontSize: 40,
    fontWeight: '200',
    marginBottom: 10,
  },
  bold: {
    fontWeight: '900',
  },
  form: {
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 10,
  },
  footer: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  link: {
    color: '#fe8b06',
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#fe8b06',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
