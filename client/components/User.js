import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import userimg from '../assets/user.png';

const { width, height } = Dimensions.get('window');

const UserInfoDropdown = ({ currentUser }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const navigation = useNavigation();
  const cleanedName = currentUser.nombre.replace(/\s/g, '');
  const [image, setImage] = useState('file:///home/juanky/proyecto/app-psicologos/client/user_img/UsuarioCorriente1.jpeg'); // Inicializa el estado de la imagen como null

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const showModal = () => {
    setModalVisible(true);
    slideIn();
  };

  const logout = () => {
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  };

  const hideModal = () => {
    slideOut();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      const fileName = `${cleanedName}.${result.assets[0].uri.split('.').pop()}`;
      const formData = new FormData();
      formData.append('image', {
        uri: result.assets[0].uri,
        name: fileName,
        type: 'image/jpg',
      });
  
      try {
        const response = await fetch('http://192.168.1.136:8080/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
        } else {
          console.error('Error al subir la imagen:', response.statusText);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
      }
    }
  };
  
  

  return (
    <View>
      <Ionicons name="person" size={30} color="black" onPress={showModal} />
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateX: slideAnim }] }]}>
            {/* Mostrar la imagen seleccionada o predeterminada */}
            {image ? (
              <Image source={{ uri: '' }} style={styles.avatar} /> // Usa la imagen seleccionada si existe
            ) : (
              <Image source={userimg} style={styles.avatar} /> // Usa la imagen predeterminada si no hay ninguna imagen seleccionada
            )}
            <Text>{currentUser.nombre}</Text>
            <Text>{currentUser.email}</Text>
            <TouchableOpacity onPress={hideModal}>
              <Text style={{ color: 'blue', marginTop: 10 }}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={logout}>
              <Text style={{ color: 'white', fontSize: 16 }}>CERRAR SESIÓN</Text>
            </TouchableOpacity>
            {/* Botón para cambiar la imagen */}
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalContent: {
    width: width / 1.5,
    height: height,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#fe8b06',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  changeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
  },
  avatar: {
    width: width / 1.5, // Establece el ancho de la imagen
    height: width / 1.5, // Establece el alto de la imagen
    marginBottom: 10,
    aspectRatio: 1, // Establece la relación de aspecto a 1:1
  },
});

export default UserInfoDropdown;
