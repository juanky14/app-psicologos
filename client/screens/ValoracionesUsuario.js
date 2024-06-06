import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { AntDesign } from '@expo/vector-icons';
import { Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ValoracionesUsuario({ route }) {
  const { user } = route.params;
  const [valoraciones, setValoraciones] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    getValoraciones();
  }, []);

  async function getValoraciones() {
    let url;
    if (user.tipo === 'dueño_clinica') {
      url = `http://200.234.236.242:8080/valoracionesclinica/${user.id}`;
    } else {
      url = `http://200.234.236.242:8080/valoraciones/usuario/${user.id}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    setValoraciones(data);
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
        Alert.alert('Reseña borrada', 'Tu reseña ha sido borrada correctamente.');
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
      {valoraciones.map((currentReview) => {
        const userInfo = user.tipo === 'dueño_clinica' ? currentReview.nombre_cliente : currentReview.nombre_clinica;
        return (
          <View key={currentReview.id} style={styles.reviewContainer}>
              <View style={styles.stars}>
                {currentReview && renderStars(currentReview.valoracion)}
              </View>
              <Text style={styles.comment}>{currentReview && currentReview.comentario}</Text>
              <Text style={styles.userName}>{userInfo}</Text>
            {user.tipo !== 'dueño_clinica' && (
              <TouchableOpacity style={styles.button} onPress={() => borrarValoracion(currentReview.id)}>
                <Text style={styles.buttonText}>BORRAR RESEÑA</Text>
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
  reviewContainer: {
    borderRadius: 10,
    borderColor: '#fe8b06',
    borderWidth: 1,
    padding: 15,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  reviewText: {
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
