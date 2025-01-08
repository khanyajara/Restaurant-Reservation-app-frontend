import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSignUp = () => {
    if (!fullName || !phoneNumber || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return;
    }

    console.log('Signed up with:', { fullName, phoneNumber, email, password });
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require('./assets/Feast-Finder-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.headerText}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#a8a8a8"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#a8a8a8"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#a8a8a8"
        keyboardType="email-address"
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
      <Button title="Sign Up" onPress={handleSignUp} color="#D74930" />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log In
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 16,
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
  link: {
    color: '#D74930',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SignUpScreen;
