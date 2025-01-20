import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Switch, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ReservationProfile({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('@authToken');
        if (!token) {
          Alert.alert('Session Expired', 'Please log in again.');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get('https://resturantappbackend.onrender.com/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setUser(userData);
        setName(userData.name || '');
        setEmail(userData.email || '');
        setPhoneNumber(userData.phone || '');
        setNotifications(userData.notifications || false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        Alert.alert('Error', 'Unable to fetch user details. Please try again.');
      }
    };

    fetchUser();
  }, [navigation]);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('@authToken');
      if (!token) {
        Alert.alert('Error', 'You need to be logged in to save changes.');
        return;
      }

      const updatedUser = { name, email, phone: phoneNumber, notifications };

      await axios.put('https://resturantappbackend.onrender.com/api/user', updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(updatedUser);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save user data:', error);
      Alert.alert('Error', 'An error occurred while saving your profile. Please try again.');
    }
  };

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

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Reservation Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#D74930' }}
            thumbColor={notifications ? '#D74930' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        <View style={styles.savedInfo}>
          <Text style={styles.savedText}>Name: {name || 'Not Set'}</Text>
          <Text style={styles.savedText}>Email Address: {email || 'Not Set'}</Text>
          <Text style={styles.savedText}>Phone Number: {phoneNumber || 'Not Set'}</Text>
          <Text style={styles.savedText}>
            Reservation Notifications: {notifications ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
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
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#D74930',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  savedInfo: {
    marginTop: 20,
  },
  savedText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
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
