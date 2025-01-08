import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image } from 'react-native';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    // if (!email || !password) {
    //   Alert.alert('Validation Error', 'Please fill in both fields');
    //   return;
    // }
    // if (!validateEmail(email)) {
    //   Alert.alert('Validation Error', 'Please enter a valid email');
    //   return;
    // }

    
    // await AsyncStorage.setItem('email', email);

    // console.log('Logged in with:', email, password);

    
    navigation.navigate('Tabs');
  };

  return (
    <View style={styles.container1}>

        <View  >
            <Image source={require('./assets/Feast-Finder-removebg-preview.png')}
             style={{ width: 200, height: 200 }}
             resizeMode="contain" />
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
      <Button title="Login" style={{ width: 280, height: 240 }} onPress={handleLogin} color="#D74930"></Button>
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
    alignItems:'center',
    
    padding: 16,
    backgroundColor:'black'
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
    width:280,
    borderColor: '#D74930', 
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: 'white', 
    borderRadius:10,
  },
  link: {
    color: '#D74930',
    marginTop: 10,
    textAlign: 'center',
  },
  link1: {
    color: '#D74930',
    
    marginLeft:159,
  },
  Button:{
    width:480,
    marginTop:15,
  },

});

export default LoginScreen;