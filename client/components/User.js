import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Dimensions, Animated, Image, Linking } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import userimg from '../assets/user.png';
import { Divider } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const UserInfoDropdown = ({ currentUser }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const navigation = useNavigation();
  const cleanedName = currentUser.nombre.replace(/\s/g, '');
  const [image, setImage] = useState(null);

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
    });
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
        const response = await fetch('http://200.234.236.242:8080/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Imagen subida exitosamente
        } else {
          console.error('Error al subir la imagen:', response.statusText);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
      }
    }
  };

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  const showProfile = () => {
    hideModal();
    navigation.navigate('Perfil', { user: currentUser});
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
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPressOut={hideModal}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateX: slideAnim }] }]}>
            <TouchableOpacity activeOpacity={1}>
              {/* Mostrar la imagen seleccionada o predeterminada */}
              {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
              ) : (
                <Image source={userimg} style={styles.avatar} />
              )}
              <Text style={styles.nombre}>{currentUser.nombre}</Text>
              <Divider />
              <TouchableOpacity onPress={showProfile} style={styles.textContainer}>
                <Text style={styles.userDetails}>Información adicional </Text>
                <AntDesign name="right" color={"#fe8b06"} style={styles.arrow} />
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={hideModal} style={styles.textContainer}>
                <Text style={styles.userDetails}>Mis citas </Text>
                <AntDesign name="right" color={"#fe8b06"} style={styles.arrow} />
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={hideModal} style={styles.textContainer}>
                <Text style={styles.userDetails}>Valoraciones </Text>
                <AntDesign name="right" color={"#fe8b06"} style={styles.arrow} />
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={() => openLink('https://psicologoapp.com/')} style={styles.textContainer}>
                <Text style={styles.userDetails}>Sobre PsicoloGo </Text>
                <AntDesign name="right" color={"#fe8b06"} style={styles.arrow} />
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={logout} style={styles.textContainer}>
                <Text style={styles.userDetails}>Cerrar sesión </Text>
                <AntDesign name="right" color={"#fe8b06"} style={styles.arrow} />
              </TouchableOpacity>
              <Divider />
              {/* Botón para cambiar la imagen 
              <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
                <Ionicons name="camera" size={24} color="white" />
              </TouchableOpacity>*/}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
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
    width: width / 1.5,
    height: width / 1.5,
    aspectRatio: 1,
  },
  nombre: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  userDetails: {
    fontSize: 16,
    margin: 10,
  },
  arrow: {
    fontSize: 24,
    marginRight: 10,
  },
});

export default UserInfoDropdown;
