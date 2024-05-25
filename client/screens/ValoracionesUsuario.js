import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { AntDesign } from '@expo/vector-icons';
import { Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ValoracionesUsuario({ route }) {
  const { user } = route.params;
  const [valoracionesUsuario, setValoracionesUsuario] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    getValoraciones();
  }, []);

  async function getValoraciones() {
    const response = await fetch(`http://200.234.236.242:8080/valoraciones/usuario/${user.id}`);
    const data = await response.json();
    setValoracionesUsuario(data);
  }

  const backToClinicas = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Clinicas', params: { user: user } }],
    });
  };

  const borrarValoracion = async (valoracionId) => {
    try {
      const response = await fetch(`http://200.234.236.242:8080/valoracion/borrar/${valoracionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        Alert.alert('Reseña borrarda', 'Tu reseña ha sido borrada correctamente.');
        getValoraciones();
      } else {
        Alert.alert('Error', 'Hubo un problema al borrar la reseña.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al borrar la reseña.');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? "star" : "star-border"}
          size={20}
          color="#fe8b06"
          style={styles.starIcon}
        />
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.main}>
      <TouchableOpacity style={styles.header} onPress={backToClinicas}>
        <AntDesign name="left" size={20} color="black" />
        <Text style={styles.headerText}>  VOLVER</Text>
      </TouchableOpacity>
      <Divider />
      {valoracionesUsuario.map((currentReview) => {
        return (
          <View key={currentReview.id} style={styles.citaContainer}>
            <View style={styles.review}>
              <View style={styles.stars}>
                {currentReview && renderStars(currentReview.valoracion)}
              </View>
              <Text style={styles.comment}>{currentReview && currentReview.comentario}</Text>
              <Text style={styles.userName}> {currentReview.nombre_clinica}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => borrarValoracion(currentReview.id)}>
              <Text style={styles.buttonText}>BORRAR RESEÑA</Text>
            </TouchableOpacity>
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
  review: {
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  comment: {
    fontSize: 14,
    color: '#333',
  },
  userName: {
    textAlign: 'right',
    fontStyle: 'italic',
    color: 'gray',
    marginRight: 10,
    marginTop: 5,
  },
});
