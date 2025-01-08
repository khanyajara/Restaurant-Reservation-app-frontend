import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomePage';
import ProfileScreen from './Profile';
import Reserved from './Reserved';
import BookingScreen from './BookingPage';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            } else if (route.name === 'Reserved') {
              iconName = 'bookmark';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#D74930',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarActiveBackgroundColor:'black',
          tabBarInactiveBackgroundColor:'black',
          
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Reserved" component={Reserved} />
        <Tab.Screen name="Booking" component={BookingScreen} />

      </Tab.Navigator>
   
  );
}
