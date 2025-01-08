import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in both fields');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return;
    }

    try {
      const response = await fetch('https://resturantappbackend.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', result.token);
        Alert.alert('Success', 'Logged in successfully');
        navigation.navigate('Tabs'); // Adjust this to your home/main screen
      } else {
        Alert.alert('Error', result.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server');
      console.error(error);
    }
  };

  return (
    <View style={styles.container1}>
      <View>
        <Image
          source={require('./assets/Feast-Finder-removebg-preview.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.headerText}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#a8a8a8"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a8a8a8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.link1} onPress={() => navigation.navigate('password')}>
        Forgot Password?
      </Text>
      <Button title="Login" style={{ width: 280, height: 240 }} onPress={handleLogin} color="#D74930" />
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  headerText: {
    fontSize: 24,
    color: '#D74930',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: 280,
    borderColor: '#D74930',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: 'white',
    borderRadius: 10,
  },
  link: {
    color: '#D74930',
    marginTop: 10,
    textAlign: 'center',
  },
  link1: {
    color: '#D74930',
    marginLeft: 159,
  },
});

export default LoginScreen;
