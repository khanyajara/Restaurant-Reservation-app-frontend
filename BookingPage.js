import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const API_URL = 'https://resturantappbackend.onrender.com/reservation';
const PAY_API_URL = 'https://resturantappbackend.onrender.com/pay';

const BookingPage = ({ route, navigation }) => {
  const { restaurant, reservation } = route.params;
  const reservationsArray = Array.isArray(reservation) ? reservation : [reservation];

  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [tableType, setTableType] = useState('regular');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [Reservation, setReservations] = useState(reservationsArray); 

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    filterSlotsByDate(currentDate);
  };

  const filterSlotsByDate = (selectedDate) => {
    if (restaurant?.timeSlots && Array.isArray(restaurant.timeSlots)) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      const slots = restaurant.timeSlots.flatMap(slotGroup => {
        return slotGroup.slots.filter(slot => {
          return moment(slot.date).isSame(formattedDate, 'day');
        });
      });
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleBooking = async () => {
    if (!contactName || !contactPhone || !selectedSlot) {
      Alert.alert('Error', 'Please fill in all fields and select a time slot');
      return;
    }

    const parsedSlot = JSON.parse(selectedSlot);
    const { startTime, endTime } = parsedSlot;

    if (!startTime || !endTime) {
      Alert.alert('Error', 'Invalid time slot selected');
      return;
    }

    if (moment(startTime).isSameOrAfter(moment(endTime))) {
      Alert.alert('Error', 'Start time must be before end time');
      return;
    }

    const bookingDetails = {
      restaurantId: restaurant._id,
      reservation: Reservation[0]._id, 
      numberOfGuests: numPeople,
      contactName,
      contactPhone,
      tableType,
      notifications: [{ time: moment().toISOString(), success: false }],
      status: 'pending',
    };

    try {
      const token = await AsyncStorage.getItem('@authToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in');
        return;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingDetails),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create reservation');
      }

      const paymentResponse = await fetch(PAY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservationId: responseData.reservation._id,
          amount: responseData.reservation.amount,
        }),
      });

      const paymentData = await paymentResponse.json();
      if (paymentData.approvalUrl) {
        navigation.navigate('Payment', { approvalUrl: paymentData.approvalUrl });
      } else {
        Alert.alert('Error', 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant && reservation) {
      filterSlotsByDate(date);
      setReservations(reservationsArray); // Ensure Reservation state is updated
    }
  }, [restaurant, reservation, date]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Book a Table For {restaurant?.name}</Text>

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

      <Text style={styles.label}>Table Type</Text>
      <Picker selectedValue={tableType} onValueChange={setTableType} style={styles.picker}>
        <Picker.Item label="Regular" value="regular" />
        <Picker.Item label="VIP" value="vip" />
        <Picker.Item label="Outdoor" value="outdoor" />
      </Picker>

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}

      <Text style={styles.label}>Available Time Slots</Text>
      <Picker selectedValue={selectedSlot} onValueChange={setSelectedSlot} style={styles.picker}>
        <Picker.Item label="Select a time slot" value="" />
        {Reservation.length > 0 ? (
          Reservation.map((slot, index) => (
            <Picker.Item
              key={index}
              label={`${moment(slot.startTime).format('LT')} to ${moment(slot.endTime).format('LT')}`}
              value={JSON.stringify({ startTime: slot.startTime, endTime: slot.endTime })}
            />
          ))
        ) : (
          <Picker.Item label="No slots available" value="" />
        )}
      </Picker>

      <Text style={styles.label}>Number of People</Text>
      <Picker selectedValue={numPeople} onValueChange={setNumPeople} style={styles.picker}>
        {[...Array(8).keys()].map((num) => (
          <Picker.Item key={num + 1} label={`${num + 1}`} value={num + 1} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleBooking} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Booking...' : 'Confirm Booking'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
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