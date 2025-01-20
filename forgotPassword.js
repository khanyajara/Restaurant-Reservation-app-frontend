import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';

const PasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      const response = await fetch('https://resturantappbackend.onrender.com/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', result.message || 'Failed to send reset link.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resetting your password.');
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
      <Text style={styles.headerText}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#a8a8a8"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
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
    width: 280,
    borderColor: '#D74930',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: 'white',
    borderRadius: 10,
  },
  button: {
    width: 280,
    height: 50,
    backgroundColor: '#D74930',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#D74930',
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default PasswordScreen;
