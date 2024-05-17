import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const UserInfoDropdown = ({ currentUser }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const navigation = useNavigation();

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
            <Text>{currentUser.nombre}</Text>
            <Text>{currentUser.email}</Text>
            <TouchableOpacity onPress={hideModal}>
              <Text style={{ color: 'blue', marginTop: 10 }}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={logout}>
                <Text style={{ color: 'white', fontSize: 16 }}>CERRAR SESIÓN</Text>
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
    width: width / 2,
    height: height,
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
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
});

export default UserInfoDropdown;
