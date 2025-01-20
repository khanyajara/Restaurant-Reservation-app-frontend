import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

const ResetPasswordScreen = ({ route, navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = route.params;

  const PasswordReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`https://resturantappbackend.onrender.com/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Your password has been reset successfully.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', result.message || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resetting your password.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        placeholderTextColor="#a8a8a8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        placeholderTextColor="#a8a8a8"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        title="Submit"
        style={styles.button}
        onPress={PasswordReset}
        color="#D74930"
      />
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
  },
});

export default ResetPasswordScreen;
