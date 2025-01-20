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
        await AsyncStorage.setItem('@authToken', result.token); 
  
        
        if (result.role === 'admin' || email === 'admin@gmail.com') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Admin' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }], 
          });
        }
  
        Alert.alert('Success', 'Logged in successfully');
      } else {
        Alert.alert('Error', result.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server. Please try again later.');
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/Feast-Finder-removebg-preview.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.headerText}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#a8a8a8"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#a8a8a8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.forgotPasswordLink} onPress={() => navigation.navigate('Password')}>
        Forgot Password?
      </Text>
      <Button title="Login" onPress={handleLogin} color="#D74930" />
      <Text style={styles.signUpLink} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  logo: {
    width: 200,
    height: 200,
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
    width: '90%',
    borderColor: '#D74930',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
  },
  forgotPasswordLink: {
    color: '#D74930',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  signUpLink: {
    color: '#D74930',
    marginTop: 15,
  },
});

export default LoginScreen;
