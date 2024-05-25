import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Perfil({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();

  const backToClinicas = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Clinicas', params: { user: user } }],
    });
  };

  // Función para dar formato a la fecha de nacimiento
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={backToClinicas}>
        <AntDesign name="left" size={24} color="black" />
        <Text style={styles.headerText}> VOLVER</Text>
      </TouchableOpacity>
      <Divider />
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.info}>{user.nombre}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Correo electrónico</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>DNI</Text>
        <Text style={styles.info}>{user.dni}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Fecha de nacimiento</Text>
        <Text style={styles.info}>{formatDate(user.fecha_nacimiento)}</Text>
      </View>
      {/*<View style={styles.infoContainer}>
        <Text style={styles.label}>Tipo de usuario</Text>
        <Text style={styles.info}>{user.tipo}</Text>
      </View>*/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#fe8b06',
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
});
