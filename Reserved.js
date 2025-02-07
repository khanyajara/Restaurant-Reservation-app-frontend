import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const API_URI = 'https://resturantappbackend.onrender.com/reservations';

export default function Reserved() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = await AsyncStorage.getItem('@authToken');
        
        if (!token) {
          Alert.alert('Error', 'You are not logged in');
          return;
        }

        console.log('Stored Token:', token); // Debugging

        const response = await fetch(API_URI, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Reservations:', data); // Debugging

          if (Array.isArray(data)) {
            setReservations(data);
          } else {
            console.error('Invalid API response: Expected an array', data);
          }
        } else {
          console.error('Error fetching reservations:', response.status);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const cancelReservation = async (id) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('@authToken');
              const response = await fetch(`${API_URI}/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                setReservations((prev) => prev.filter((res) => res.id !== id));
                Alert.alert('Success', 'Reservation canceled successfully.');
              } else {
                Alert.alert('Error', 'Failed to cancel reservation.');
              }
            } catch (error) {
              console.error('Error canceling reservation:', error);
              Alert.alert('Error', 'An error occurred while canceling the reservation.');
            }
          },
        },
      ]
    );
  };

 

  const renderReservation = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.restaurantName}>{item.restaurantName || 'Unknown Restaurant'}</Text>
        <Text style={styles.details1}>
          ⏰ {item.startTime && item.endTime ? `${moment(item.startTime).format('LT')} to ${moment(item.endTime).format('LT')}` : 'No time available'}
        </Text>
        <Text style={styles.details1}>
          📅 {item.startTime && item.endTime ? `${moment(item.startTime).format('DD-MM-YYYY')} to ${moment(item.endTime).format('DD-MM-YYYY')}`: 'No date available'}
          </Text>
          <Text style={styles.details1}>Status: {item.status || 'Unknown Status'}</Text>
          <Text style={styles.details1} >Guests: {item.numberOfGuests || 'Unknown Guests'}</Text>
          <Text style={styles.details1} >Price:{item.amount || 'Unknown Amount'}</Text>
          <Text style={styles.details1} >Booked for: {item.email || 'Unknown Name'}</Text>
          <Text style={styles.details1} ></Text>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => cancelReservation(item.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.gradient}>
      <View style={styles.container}>
        <Image
          source={require('./assets/Feast-Finder-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Your Reservations</Text>

        {loading ? (
          <Text style={styles.loadingText}>Loading reservations...</Text>
        ) : reservations.length > 0 ? (
          <FlatList
            data={reservations}
            renderItem={renderReservation}
            keyExtractor={(item, index) => (item?.id ? item.id.toString() : `fallback-${index}`)}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={styles.noReservations}>You have no reservations.</Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginLeft: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  details1: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#D74930',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noReservations: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
