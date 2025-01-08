import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const BookingPage = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBooking = () => {
    if (!contactName || !contactPhone || !time) {
      Alert.alert(
        'Error',
        'Please fill in all the fields, including selecting a time'
      );
      return;
    }

    const bookingDetails = {
      restaurantName: restaurant.name,
      date: date.toISOString(),
      time,
      numPeople,
      contactName,
      contactPhone,
    };

    console.log(bookingDetails);

    Alert.alert(
      'Booking Confirmed',
      `Your reservation at ${restaurant.name} has been confirmed.`
    );
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Book a Table For {restaurant.name}</Text>

      <Text style={styles.label}>Contact Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#888"
        value={contactName}
        onChangeText={setContactName}
      />

      <Text style={styles.label}>Contact Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        placeholderTextColor="#888"
        value={contactPhone}
        keyboardType="phone-pad"
        onChangeText={setContactPhone}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.buttonText}>Select Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Time</Text>
      <Picker selectedValue={time} onValueChange={setTime} style={styles.picker}>
        <Picker.Item label="Select a time" value="" />
        <Picker.Item label="12:00 PM" value="12:00 PM" />
        <Picker.Item label="01:00 PM" value="01:00 PM" />
        <Picker.Item label="06:00 PM" value="06:00 PM" />
        <Picker.Item label="07:00 PM" value="07:00 PM" />
        <Picker.Item label="08:00 PM" value="08:00 PM" />
      </Picker>

      <Text style={styles.label}>Number of People</Text>
      <Picker
        selectedValue={numPeople}
        onValueChange={setNumPeople}
        style={styles.picker}
      >
        {[...Array(8).keys()].map((num) => (
          <Picker.Item key={num + 1} label={`${num + 1}`} value={num + 1} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Go Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'black',
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: 'white',
  },
  picker: {
    color: 'white',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#D74930',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  homeButton: {
    backgroundColor: '#D74930',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default BookingPage;
