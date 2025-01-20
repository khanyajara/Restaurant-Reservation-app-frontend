import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './Login';
import SignUpScreen from './Sign-up';
import PasswordScreen from './forgotPassword';
import ResetPasswordScreen from './ResetPassword.js';
import HomeScreen from './HomePage';
import ProfileScreen from './Profile';
import ReservedScreen from './Reserved';
import Tabs from './TabBottom';
import AdminPage from './auth/AdminHome.js';
import BookingScreen from './BookingPage.js';
import ReviewScreen from './RestaurantReviews.js';
import { useEffect, useState } from 'react';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateAndRefreshtoken = async () => {
    try {
      const token = await AsyncStorage.getItem('@accessToken');
      if (!token) {
        setUser(null); // No token, no user
        return;
      }

      const response = await fetch('https://restaurantappbackend.onrender.com/api/auth/validate', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const newToken = response.headers.get('X-New-Token');
        if (newToken) {
          await AsyncStorage.setItem('@accessToken', newToken); // Update the token
        }

        const userData = await response.json();
        setUser(userData); // Set user data if valid
      } else {
        await AsyncStorage.removeItem('@accessToken'); // Token invalid or expired
        setUser(null); // Clear user data
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setUser(null); // Log out the user if error occurs
    }
  };

  useEffect(() => {
    validateAndRefreshtoken().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    // Show a loading indicator while validating token
    return <ActivityIndicator size="large" color="#D74930" style={styles.loader} />;
  }

  return (
    <NavigationContainer>
      <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.gradient}>
        <View style={styles.container}>
          <Stack.Navigator
            initialRouteName={user ? (user.role === 'admin' ? 'Admin' : 'Tabs') : 'Login'}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="password" component={PasswordScreen} />
            <Stack.Screen name="reset" component={ResetPasswordScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Admin" component={AdminPage} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Reserved" component={ReservedScreen} />
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
          </Stack.Navigator>
        </View>
      </LinearGradient>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  gradient: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
