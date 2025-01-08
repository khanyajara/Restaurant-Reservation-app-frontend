import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

import LoginScreen from './Login';
import SignUpScreen from './Sign-up';
import PasswordScreen from './forgotPassword';
import HomeScreen from './HomePage';
import ProfileScreen from './Profile';
import ReservedScreen from './Reserved';
import Tabs from './TabBottom'
import BookingScreen from './BookingPage.js'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.gradient} 
      >
        <View style={styles.container}>
          <Stack.Navigator
            initialRouteName="Tabs"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="password" component={PasswordScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Reserved" component={ReservedScreen} />
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Booking" component={BookingScreen} />
          </Stack.Navigator>
        </View>
      </LinearGradient>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black'
    
  },
  gradient: {
    flex: 1, 
  },
});
