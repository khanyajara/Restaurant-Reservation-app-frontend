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
  {
    id: '3',
    restaurantName: 'Pizza Hut',
    time: '8:00 PM',
    date: '2025-01-14',
    // image: require('./assets/pizza-hut-logo.jpg') ,
  },
  {
    id: '4',
    restaurantName: 'Burger King',
    time: '7:30 PM',
    date: '2025-01-16',
    // image: require('./assets/burger-king-logo.jpg'),
  },
  {
    id: '5',
    restaurantName: 'McDonald’s',
    time: '6:00 PM',
    date: '2025-01-18',
    // image: require('./assets/mcdonalds-logo.jpg'),
  },
  {
    id: '6',
    restaurantName: 'Nando’s',
    time: '7:15 PM',
    date: '2025-01-20',
    // image: require('./assets/nandos-logo.jpg'),
  },
  {
    id: '7',
    restaurantName: 'Starbucks',
    time: '5:00 PM',
    date: '2025-01-22',
    // image: require('./assets/starbucks-logo.jpg'),
  },
  {
    id: '8',
    restaurantName: 'Domino’s Pizza',
    time: '6:45 PM',
    date: '2025-01-24',
    // image: require('./assets/dominos-logo.jpg'),
  },
  {
    id: '9',
    restaurantName: 'Subway',
    time: '5:30 PM',
    date: '2025-01-26',
    // image: require('./assets/subway-logo.jpg'),
  },
  {
    id: '10',
    restaurantName: 'Ocean Basket',
    time: '7:45 PM',
    date: '2025-01-28',
    // image: require('./assets/ocean-basket-logo.jpg'),
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
