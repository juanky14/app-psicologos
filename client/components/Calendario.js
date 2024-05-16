import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

const Calendario = ({ handleDayPress, handleHourPress }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [hoursAvailable, setHoursAvailable] = useState([]);

  const generateHours = () => {
    const availableHours = [];
    for (let hour = 9; hour <= 13; hour++) {
      availableHours.push(`${hour}:00`);
    }
    for (let hour = 17; hour <= 19; hour++) {
      availableHours.push(`${hour}:00`);
    }
    setHoursAvailable(availableHours);
  };

  return (
    <View style={styles.main}>
      <Calendar
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#fe8b06' },
        }}
        onDayPress={(day) => {
          handleDayPress(day.dateString);
          setSelectedDate(day.dateString);
          generateHours(day.dateString);
        }}
        firstDay={1}

      />
      <View style={styles.hoursContainer}>
        {hoursAvailable.map((hour, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.hourButton, selectedHour === hour && styles.selectedHourButton]}
            onPress={() => {
              setSelectedHour(hour);
              handleHourPress(hour);
            }}
          >
            <Text style={[styles.hourButtonText, selectedHour === hour && styles.selectedHourButtonText]}>
              {hour}
            </Text>
          </TouchableOpacity>
        ))}
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
  main: {
    backgroundColor: 'white',
  },
  hoursText: {
    fontSize: 18,
    margin: 10,
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
});

export default Calendario;
