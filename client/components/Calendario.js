import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ],
    monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
    today: "Hoy"
};

LocaleConfig.defaultLocale = 'es';

const Calendario = ({ clinica, currentUserId, toggleCalendar }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedHour, setSelectedHour] = useState('');
    const [citasNoDisponibles, setCitasNoDisponibles] = useState([]);
    const [hoursAvailable, setHoursAvailable] = useState([]);

    const generateHours = () => {
        const availableHours = [];
        for (let hour = 9; hour <= 13; hour++) {
            const formattedHour = `${hour}:00`;
            availableHours.push({ hour: formattedHour, disabled: false });
        }
        for (let hour = 17; hour <= 19; hour++) {
            const formattedHour = `${hour}:00`;
            availableHours.push({ hour: formattedHour, disabled: false });
        }

        citasNoDisponibles.forEach(cita => {
            const index = availableHours.findIndex(hourObj => hourObj.hour === cita.hora);
            if (index !== -1) {
                availableHours[index].disabled = true;
            }
        });
        setHoursAvailable(availableHours);
    };

    useEffect(() => {
      if (selectedDate) {
          generateHours();
      }
    }, [selectedDate, citasNoDisponibles]);

    async function getCitas(clinica, dia) {
        try {
            const response = await fetch(`http://200.234.236.242:8080/citas/${clinica}/${dia}`);
            const citasdia = await response.json();
            setCitasNoDisponibles(citasdia);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const insertarCita = async (clinicaId, usuarioId, fechaHora) => {
      try {
          const response = await fetch('http://200.234.236.242:8080/insertar-cita', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  clinicaId,
                  usuarioId,
                  fechaHora
              })
          });
          const data = await response.json();
          if (response.ok) {
              toggleCalendar();
              Alert.alert(data.message);
          } else {
              console.error('Error al insertar la cita:', response.statusText);
          }
      } catch (error) {
          console.error('Error al insertar la cita:', error);
      }
    };

    return (
        <View style={styles.main}>
            <Calendar
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: '#fe8b06' },
                }}
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    getCitas(clinica, day.dateString);
                    generateHours();
                }}
                firstDay={1}
                minDate={new Date()}
            />
            <View style={styles.hoursContainer}>
                {hoursAvailable.map((hourObj, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.hourButton, selectedHour === hourObj.hour && styles.selectedHourButton, hourObj.disabled && styles.disabledHourButton]}
                        onPress={() => {
                            if (!hourObj.disabled) {
                                setSelectedHour(hourObj.hour);
                            }
                        }}
                        disabled={hourObj.disabled}
                    >
                        <Text style={[styles.hourButtonText, selectedHour === hourObj.hour && styles.selectedHourButtonText, hourObj.disabled && styles.disabledHourButtonText]}>
                            {hourObj.hour}
                        </Text>
                    </TouchableOpacity>
                ))}
                {selectedHour !== '' && (
                    <TouchableOpacity 
                      style={styles.button} 
                      onPress={() => {
                          insertarCita(clinica, currentUserId, `${selectedDate} ${selectedHour}`);
                      }}
                    >
                      <Text style={styles.buttonText}>CONFIRMAR CITA</Text>
                    </TouchableOpacity>     
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    hoursContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    button: {
      backgroundColor: '#fe8b06',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%',
      textAlign: 'center',
      marginTop: 5,
    },
    main: {
        backgroundColor: 'white',
    },
    hourButton: {
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 5,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#fe8b06',
        color: 'white',
    },
    selectedHourButton: {
        backgroundColor: '#fe8b06',
    },
    hourButtonText: {
        color: '#fe8b06', // Color del texto cuando no está seleccionado
    },
    selectedHourButtonText: {
        color: 'white', // Color del texto cuando está seleccionado
    },
    disabledHourButton: {
        backgroundColor: '#ddd', // Color del botón deshabilitado
        borderColor: 'lightgray',
    },
    disabledHourButtonText: {
        color: 'gray', // Color del texto del botón deshabilitado
    },
});

export default Calendario;