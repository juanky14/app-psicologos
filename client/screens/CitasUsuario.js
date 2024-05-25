import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { AntDesign } from '@expo/vector-icons';
import { Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function CitasUsuario({ route }) {
  const { user } = route.params;
  const [citasUsuario, setCitasUsuario] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    getCitasUsuario();
  }, []);

  async function getCitasUsuario() {
    try {
      let response;
      if (user.tipo === 'usuario_corriente') {
        response = await fetch(`http://200.234.236.242:8080/citas/${user.id}`);
      } else if (user.tipo === 'dueño_clinica') {
        response = await fetch(`http://200.234.236.242:8080/citasclinica/${user.id}`);
      }
      const data = await response.json();
      setCitasUsuario(data);
    } catch (error) {
      console.error('Error al obtener citas:', error);
    }
  }

  const backToClinicas = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Clinicas', params: { user: user } }],
    });
  };

  const cancelarCita = async (citaId) => {
    try {
      const response = await fetch(`http://200.234.236.242:8080/citas/cancelar/${citaId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        Alert.alert('Cita cancelada', 'La cita ha sido cancelada correctamente.');
        getCitasUsuario();
      } else {
        Alert.alert('Error', 'Hubo un problema al cancelar la cita.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cancelar la cita.');
    }
  };

  const formatFechaHora = (fechaHora) => {
    const date = new Date(fechaHora);
    const options = { day: '2-digit', month: 'long' };
    const dateString = date.toLocaleDateString('es-ES', options);
    const timeString = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `el ${dateString} a las ${timeString} horas`;
  };

  return (
    <ScrollView style={styles.main}>
      <TouchableOpacity style={styles.header} onPress={backToClinicas}>
        <AntDesign name="left" size={20} color="black" />
        <Text style={styles.headerText}>  VOLVER</Text>
      </TouchableOpacity>
      <Divider />
      {citasUsuario.map((cita) => {
        const formattedDate = formatFechaHora(cita.fecha_hora, cita.nombre_clinica);
        const clinicaText = user.tipo === 'dueño_clinica' ? 'con' : 'en';
        const clienteName = user.tipo === 'dueño_clinica' ? cita.nombre_cliente : cita.nombre_clinica;
        return (
          <View key={cita.id} style={styles.citaContainer}>
            <Text style={styles.citaText}>
              Cita {formattedDate} {clinicaText} {clienteName}
            </Text>
            {user.tipo !== 'dueño_clinica' && (
              <TouchableOpacity style={styles.button} onPress={() => cancelarCita(cita.id)}>
                <Text style={styles.buttonText}>CANCELAR CITA</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );  
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  citaContainer: {
    borderRadius: 10,
    borderColor: '#fe8b06',
    borderWidth: 1,
    padding: 15,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  citaText: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#fe8b06',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
