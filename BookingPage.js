import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
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
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [numPeople, setNumPeople] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [tableType, setTableType] = useState('regular');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [Reservation, setReservations] = useState(reservationsArray);

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    filterSlotsByDate(currentDate);
  };

  // Filter time slots based on selected date
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

  // Calculate total amount dynamically
  useEffect(() => {
    if (!restaurant || !restaurant.amount || numPeople <= 0) return;

    let basePrice = restaurant.amount.standard;
    if (tableType === 'vip') basePrice = restaurant.amount.vip;
    else if (tableType === 'outdoor') basePrice = restaurant.amount.outdoor;

    setTotalAmount(basePrice * numPeople);
  }, [numPeople, tableType]);

  // Handle booking
  const handleBooking = async () => {
    if (!contactName || !contactPhone || !selectedSlot || numPeople <= 0) {
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
  
    if (!restaurant || !restaurant.amount) {
      Alert.alert('Error', 'Restaurant details not found');
      return;
    }
  
    const bookingDetails = {
      restaurantId: restaurant._id,
      startTime,
      endTime,
      userId,
      numberOfGuests: numPeople,
      contactName,
      contactPhone,
      tableType,
      amount: totalAmount,
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
      console.log("User ID from Middleware:", userId);

  
      const responseData = await response.json();
      console.log('Response Data:', responseData);
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create reservation');
      }
  
      // Initiate Payment
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
    if (restaurant) {
      filterSlotsByDate(date);
    }
  }, [restaurant, date]);

  useEffect(() => {
    if (restaurant && reservation) {
      filterSlotsByDate(date);
      setReservations(reservationsArray); 
    }
  }, [restaurant, reservation, date]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Book a Table at {restaurant?.name}</Text>

      <Text style={styles.label}>Contact Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={contactName}
        onChangeText={setContactName}
      />

      <Text style={styles.label}>Contact Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={contactPhone}
        keyboardType="phone-pad"
        onChangeText={setContactPhone}
      />

      <Text style={styles.label}>Number of Guests</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter number of guests"
        value={numPeople.toString()}
        keyboardType="numeric"
        onChangeText={(value) => setNumPeople(Number(value))}
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
      {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />}

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

      <Text style={styles.label}>Total Amount: ${totalAmount.toFixed(2)}</Text>

      <TouchableOpacity style={styles.button} onPress={handleBooking} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Booking...' : 'Confirm Booking'}</Text>
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