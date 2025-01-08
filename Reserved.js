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

const reservationsData = [
  {
    id: '1',
    restaurantName: 'Roco Mamas',
    time: '7:00 PM',
    date: '2025-01-10',
    image: require('./assets/images.jpg'),
  },
  {
    id: '2',
    restaurantName: 'KFC',
    time: '6:30 PM',
    date: '2025-01-12',
    image: require('./assets/kfc-logo.jpg'),
  },
];

export default function Reserved() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Simulating fetching user-specific reservations.
    setReservations(reservationsData);
  }, []);

  const cancelReservation = (id) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            setReservations((prev) => prev.filter((res) => res.id !== id));
            Alert.alert('Success', 'Reservation canceled successfully.');
          },
        },
      ]
    );
  };

  const renderReservation = ({ item }) => (
    <View>
        
        <View style={styles.card}>
                  <Image source={item.image} style={styles.image} />
                  <View style={styles.cardContent}>
                      <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                      <Text style={styles.details}>⏰ {item.time}</Text>
                      <Text style={styles.details}>📅 {item.date}</Text>
                      <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => cancelReservation(item.id)}
                      >
                          <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
                      </TouchableOpacity>
                  </View>
              </View>
    </View>
  );

  return (
    <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.gradient}>
      <View style={styles.container}>
        
        <View>
          <Image
              source={require('./assets/Feast-Finder-removebg-preview.png')}
              style={styles.logo}
              resizeMode="contain" />
      </View>
      <Text style={styles.title}>Your Reservations</Text>
        {reservations.length > 0 ? (
          <FlatList
            data={reservations}
            renderItem={renderReservation}
            keyExtractor={(item) => item.id}
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
    marginLeft:60,
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
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
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
  details: {
    fontSize: 14,
    color: '#ccc',
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
});
