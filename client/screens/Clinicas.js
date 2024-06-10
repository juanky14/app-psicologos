import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Calendario from '../components/Calendario';
import UserInfoDropdown from '../components/User';
import Valoraciones from '../components/Valoraciones';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import EscribirValoracion from '../components/EscribirValoracion';
import BuscarClinica from '../components/BuscarClinica'; // Importa el componente BuscarClinica

export default function Clinicas({ route }) {
  const { user } = route.params;

  const [clinicas, setClinicas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [selectedClinicIndex, setSelectedClinicIndex] = useState(null);
  const [selectedClinicIndexValoracion, setSelectedClinicIndexValoracion] = useState(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    getClinicas();
    getValoraciones();
    getUsuarios();
  }, []);

  async function getClinicas() {
    const response = await fetch("http://200.234.236.242:8080/clinicas");
    const data = await response.json();
    setClinicas(data);
  }

  async function getValoraciones() {
    const response = await fetch("http://200.234.236.242:8080/valoraciones");
    const data = await response.json();
    setValoraciones(data);
  }

  async function getUsuarios() {
    const response = await fetch("http://200.234.236.242:8080/usuarios");
    const data = await response.json();
    setUsuarios(data);
  }

  const toggleCalendar = (index) => {
    setSelectedClinicIndex(index === selectedClinicIndex ? null : index);
  };

  const toggleValoracion = (index) => {
    setSelectedClinicIndexValoracion(index === selectedClinicIndexValoracion ? null : index);
  };

  const handlePrevReview = (clinicId) => {
    setCurrentReviewIndex((prevState) => {
      const newIndex = prevState[clinicId] > 0 ? prevState[clinicId] - 1 : 0;
      return { ...prevState, [clinicId]: newIndex };
    });
  };

  const handleNextReview = (clinicId, totalReviews) => {
    setCurrentReviewIndex((prevState) => {
      const newIndex = prevState[clinicId] < totalReviews - 1 ? prevState[clinicId] + 1 : totalReviews - 1;
      return { ...prevState, [clinicId]: newIndex };
    });
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    // Recargar la lista completa de clínicas cada vez que se modifica el término de búsqueda
    getClinicas();
  };

  return (
    <ScrollView style={styles.main}>
      <View style={styles.header}>
        <UserInfoDropdown 
          currentUser={user}
        />
        <BuscarClinica onSearch={handleSearch} />
      </View>
      {clinicas
        .filter(clinica => clinica.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((c, i) => {
          const clinicReviews = valoraciones.filter(v => v.clinica_id === c.id);
          return (
            <View key={i} style={styles.clinica}>
              <Text style={styles.name}>{c.nombre}</Text>
              <Text style={styles.details}>
                <Ionicons name="phone-portrait" /> {c.telefono}
              </Text>
              <Text style={styles.details}>
                <Ionicons name="map-sharp" /> {c.ubicacion}
              </Text>
              <Text style={styles.details}>
                {c.descripcion}
              </Text>
              {clinicReviews.length > 0 && (
                <Valoraciones
                  currentReviewIndex={currentReviewIndex}
                  clinicId={c.id}
                  clinicReviews={clinicReviews}
                  handlePrevReview={handlePrevReview}
                  handleNextReview={handleNextReview}
                  usuarios={usuarios}
                />
              )}
              <TouchableOpacity style={styles.buttonValoracion} onPress={() => toggleValoracion(i)}>
                <Text style={styles.buttonTextValoracion}>ESCRIBE UNA RESEÑA</Text>
              </TouchableOpacity>
              {selectedClinicIndexValoracion === i && (
                <EscribirValoracion clinicaId={selectedClinicIndexValoracion+1} usuarioId={user.id} toggleValoracion={toggleValoracion} onSubmit={getValoraciones}/>
              )}
              <TouchableOpacity style={styles.button} onPress={() => toggleCalendar(i)}>
                <Text style={styles.buttonText}>RESERVA TU CITA</Text>
              </TouchableOpacity>
              {selectedClinicIndex === i && (
                <Calendario clinica={selectedClinicIndex+1} currentUserId={user.id} toggleCalendar={toggleCalendar}/>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fe8b06',
  },
  details: {
    fontSize: 16,
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  review: {
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 10,
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
  button: {
    backgroundColor: '#fe8b06',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    marginTop: 5,
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
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonTextValoracion: {
    color: '#fe8b06',
    fontSize: 16,
  },
  arrow: {
    padding: 10,
  },
  arrowDisabled: {
    padding: 10,
    color: '#ddd',
  },
});
