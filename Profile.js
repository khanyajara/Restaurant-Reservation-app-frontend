import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Switch,Image, TouchableOpacity, ScrollView } from 'react-native';

export default function ReservationProfile({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [cityReservation, setCityReservation] = useState('');

  const handleSave = () => {
    alert('Reservation profile updated successfully!');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
                  <Image
                      source={require('./assets/Feast-Finder-removebg-preview.png')}
                      style={styles.logo}
                      resizeMode="contain" />
              </View>
        <Text style={styles.header}>Reservation Profile</Text>
        
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={name}
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number"
            value={name}
            onChangeText={(text) => setPhoneNumber(text)}
          />
          

        </View>
        
        {/* <View style={styles.section}>
          <Text style={styles.label}>Use Current Location</Text>
          <Switch
            value={useCurrentLocation}
            onValueChange={(value) => setUseCurrentLocation(value)}
          />
        </View>       
        
        {!useCurrentLocation && (
          <View style={styles.section}>
            <Text style={styles.label}>Set Reservation Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city or address"
              value={location}
              onChangeText={(text) => setLocation(text)}
            />
          </View>
        )}
         */}
        

        <View style={styles.section}>
          <Text style={styles.label}>Reservation Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={(value) => setNotifications(value)}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        <ScrollView>
          <View style={styles.savedInfo}>
            <Text style={styles.savedText}>Name: {name || 'Not Set'}</Text>
            <Text style={styles.savedText}>Email Address {email || 'Not Set'}</Text>
            <Text style={styles.savedText}>Phone Number: {phoneNumber || 'Not Set'}</Text>

            {/* <Text style={styles.savedText}>Location: {useCurrentLocation ? 'Current Location' : location || 'Not Set'}</Text> */}
            
            <Text style={styles.savedText}>Reservation Notifications: {notifications ? 'Enabled' : 'Disabled'}</Text>
          </View>

          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.navigationButtonText}>Logout</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.navigationButtonText}>Go to SignUp</Text>
            </TouchableOpacity> */}
          </View>

          {/* <View style={styles.section}>
            <Text style={styles.label}>Search Reservations in Another City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city for reservation"
              value={cityReservation}
              onChangeText={(text) => setCityReservation(text)}
            />
            <Text style={styles.savedText}>Reservations from {cityReservation || 'Unknown City'}</Text>
          </View> */}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  logo: {
    width: 200,
    height: 200,
    marginLeft:60,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    width: '45%',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#089dc2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#D74930',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
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
  navigationButtons: {
    marginTop: 20,
  },
  navigationButton: {
    backgroundColor: '#D74930',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
