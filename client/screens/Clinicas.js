import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text, TouchableOpacity, Image, ScrollView } from 'react-native'; // Importa ScrollView
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Calendario from '../components/Calendario';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Ionicons } from '@expo/vector-icons'; // Importa el icono de Ionicons

export default function Clinicas() {
  const [clinicas, setClinicas] = useState([]);
  const [selectedClinicIndex, setSelectedClinicIndex] = useState(null); // Índice de la clínica seleccionada
  const navigation = useNavigation();

  useEffect(() => {
    getClinicas();
  }, []);

  async function getClinicas() {
    const response = await fetch("http://192.168.1.136:8080/clinicas");
    const data = await response.json();
    setClinicas(data);
  }

  const handleDayPress = (day) => {
    console.log("Día seleccionado:", day);
  };

  const handleHourPress = (hour) => {
    console.log("Hora seleccionada:", hour);
  };

  const toggleCalendar = (index) => {
    setSelectedClinicIndex(index === selectedClinicIndex ? null : index);
    console.log(clinicas[index].id)
  };

  return (
      <ScrollView style={styles.main}>
        <SearchBar
        placeholder="Busca una clínica..."
        style={styles.searchBar}
        platform='android'
      />
          {clinicas.map((c, i) => (
            <View key={i} style={styles.clinica}>
              <Text style={styles.name}>{c.nombre}</Text>
              <Text style={styles.details}>
                <Ionicons name="phone-portrait"/> {c.telefono}
              </Text>
              <Text style={styles.details}>
                <Ionicons name="map-sharp"/> {c.ubicacion}
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => toggleCalendar(i)}>
                <Text style={styles.buttonText}>RESERVA TU CITA</Text>
              </TouchableOpacity>
              {/* Muestra el componente Calendario solo para la clínica seleccionada */}
              {selectedClinicIndex === i && (
                <Calendario handleDayPress={handleDayPress} handleHourPress={handleHourPress} />
              )}
            </View>
          ))}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fe8b06',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    marginTop: 5,
  },
  main: {
    backgroundColor: 'white',
    paddingTop: getStatusBarHeight(),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fe8b06',
  },
  details: {
    fontSize: 16,
  },
  clinica: {
    borderRadius: 10,
    borderColor: '#fe8b06',
    borderWidth: 1,
    padding: 15,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  searchBar: {
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  }
});
