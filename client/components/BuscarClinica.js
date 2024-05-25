import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BuscarClinica = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangeText = (text) => {
    setSearchTerm(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={24} color="black" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Buscar clínica..."
        value={searchTerm}
        onChangeText={handleChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    width: '100%',
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
});

export default BuscarClinica;
