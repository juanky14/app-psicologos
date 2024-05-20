import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
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

  return (
    <ScrollView style={styles.main}>
      <TouchableOpacity style={styles.header} onPress={backToClinicas}>
        <AntDesign name="left" size={20} color="black"/>
        <Text style={styles.headerText}>  VOLVER</Text>
      </TouchableOpacity>      
      <Divider/>
      <Text>Nombre: {user.nombre}</Text>
      <Text>Correo electrónico: {user.email}</Text>
      <Text>DNI: {user.dni}</Text>
      <Text>Fecha de nacimiento: {user.fecha_nacimiento}</Text>
      <Text>Tipo de usuario: {user.tipo}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    paddingTop: getStatusBarHeight(),
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
});

