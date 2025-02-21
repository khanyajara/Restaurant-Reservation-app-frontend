import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Collapsible from 'react-native-collapsible';

export default function ReservationProfile({ navigation }) {
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('@authToken');
        if (!token) {
          Alert.alert('Session Expired', 'Please log in again.');
          navigation.navigate('Login');
          return;
        }
        console.log(token);

        const response = await axios.get('https://resturantappbackend.onrender.com/api/user', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.user; // Extracting user information from the data
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        Alert.alert('Error', 'Unable to fetch user details. Please try again.');
      }
    };

    fetchUser();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@authToken');
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={require('./assets/Feast-Finder-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.header}>Reservation Profile</Text>

        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={() => setIsCollapsed(!isCollapsed)}
        >
          <Text style={styles.accordionHeaderText}>
            {isCollapsed ? 'View Profile Details' : 'Collapse Profile Details'}
          </Text>
        </TouchableOpacity>

        <Collapsible collapsed={isCollapsed}>
          {user && (
            <View style={styles.section}>
              <Text style={styles.label}>Full Name: {user.fullname}</Text>
              <Text style={styles.label}>Email: {user.email}</Text>
              <Text style={styles.label}>Phone Number: {user.phonenumber}</Text>
              <Text style={styles.label}>Role: {user.role}</Text>
              <Text style={styles.label}>Account Created At: {new Date(user.createdAt).toLocaleString()}</Text>
            </View>
          )}
        </Collapsible>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  accordionHeader: {
    backgroundColor: '#D74930',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  accordionHeaderText: {
    color: '#fff',
    fontSize: 18,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  logoutButton: {
    backgroundColor: '#D74930',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
