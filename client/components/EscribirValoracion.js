import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';

const StarRating = ({ defaultRating, onRatingChange }) => {
  const [rating, setRating] = useState(defaultRating);

  const handleRating = (newRating) => {
    setRating(newRating);
    onRatingChange(newRating);
  };

  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleRating(index)}
          activeOpacity={0.7}
        >
        <MaterialIcons
          name={index <= rating ? "star" : "star-border"}
          size={40}
          color={index <= rating ? '#fe8b06' : '#fe8b06'}
        />  
        </TouchableOpacity>
      ))}
    </View>
  );
};

const EscribirValoracion = ({ clinicaId, usuarioId, toggleValoracion, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const enviarValoracion = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Por favor selecciona una calificación');
      return;
    }
    if (comment.trim() === '') {
      Alert.alert('Error', 'Por favor escribe un comentario');
      return;
    }
    
    try {
      const response = await fetch('http://200.234.236.242:8080/insertar-valoracion', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              clinicaId,
              usuarioId,
              rating,
              comment,
          })
      });
      const data = await response.json();
      if (response.ok) {
          toggleValoracion();
          onSubmit();
          Alert.alert(data.message);
      } else {
          console.error('Error al insertar el comentario:', response.statusText);
      }
  } catch (error) {
      console.error('Error al insertar el comentario:', error);
  }
    setRating(0);
    setComment('');
  };

  return (
    <View style={styles.container}>
      <StarRating defaultRating={rating} onRatingChange={handleRatingChange} />
      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={4}
        placeholder="Escribe tu comentario aquí"
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity style={styles.buttonValoracion} onPress={enviarValoracion}>
        <Text style={styles.buttonTextValoracion}>ENVIAR</Text>
      </TouchableOpacity>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#fe8b06',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    textAlignVertical: 'top',
  }, 
  buttonValoracion: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#fe8b06',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    marginTop: 0,
  },
  buttonTextValoracion: {
    color: '#fe8b06',
    fontSize: 16,
  },
});

export default EscribirValoracion;