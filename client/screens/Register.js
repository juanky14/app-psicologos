// Register.js

import React from 'react';
import { StyleSheet, View, TextInput, Input, Text, Image, TouchableOpacity, Alert, Button} from 'react-native';
import BackButton from '../components/BackButton.js';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';



export default function Register({ onRegister }) {

  const [email, setEmail] = React.useState('');
  const [user, setUser] = React.useState('');
  const [password1, setPassword1] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [dni, setDni] = React.useState('');
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateInputChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const registerUser = async () => {
    try {
      const response = await fetch('http://192.168.1.136:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          nombre: user,
          dni: dni,
          fecha_nacimiento: new Date(selectedDate).toISOString().split('T')[0],
          password1: password1,
          password2: password2,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Si la respuesta es exitosa, llamar a la función onLogin para indicar que el usuario ha iniciado sesión.
        Alert.alert(data.message);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
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
      <BackButton goBack={navigation.goBack} />

      <Text style={styles.titulo}>Regístrate<Text style={styles.bold}>Gratis</Text></Text>
      <Text style={styles.frase}>"Disfruta de la experiencia de PsicoloGo en unos pocos pasos"</Text>

      <View style={styles.form}>

        <TextInput
          style={styles.input}
          placeholder="Correo"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          onChangeText={setUser}
          value={user}
        />
        <TextInput
          style={styles.input}
          placeholder="DNI"
          onChangeText={setDni}
          value={dni}
        />
        <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento"
        value={selectedDate.toLocaleDateString()}
        onPressIn={openDatePicker}
        />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode='date'
            display='default'
            onChange={handleDateInputChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          onChangeText={setPassword1}
          value={password1}
          secureTextEntry={true}
        />
        <TextInput
        style={styles.input}
        placeholder="Repita la contraseña"
        onChangeText={setPassword2}
        value={password2}
        secureTextEntry={true}
      />
        <TouchableOpacity style={styles.button} onPress={registerUser}>
          <Text style={styles.buttonText}>CREAR CUENTA</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>¿Ya tienes una cuenta? <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Inicia Sesión</Text></Text>
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
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  titulo: {
    color: '#fe8b06',
    fontSize: 40,
    fontWeight: '200',
    marginBottom: 0,
  },
  frase: {
    color: '#fe8b06',
    fontSize: 20,
    fontWeight: '200',
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: '900',
  },
  form: {
    width: '80%',
  },
  label: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 16,
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