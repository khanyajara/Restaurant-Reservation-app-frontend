import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';

const AdminPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    location: '',
    cuisine: '',
    rating: '',
    availableSlots: [],
    imageUrl: '',
  });
  const [sections, setSections] = useState([
    { title: 'Add New Restaurant', content: 'Form content goes here' },
  ]);
  const [activeSections, setActiveSections] = useState([]);
  const [isRestaurantList, setIsRestaurantList] = useState(true); 
  const navigation = useNavigation();

  useEffect(() => {
    fetchRestaurants();
    fetchAllUser();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('https://resturantappbackend.onrender.com/api/getR');
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch restaurants');
    }
  };

  const fetchAllUser = async () => {
  try {
    const token = await AsyncStorage.getItem('@authToken');
    if (!token) {
      Alert.alert('Error', 'No authentication token found');
      return;
    }

    const response = await axios.get('https://resturantappbackend.onrender.com/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Log the full response to check its structure
    console.log('Fetched response:', response);

    // Directly access the array of users from response.data
    if (Array.isArray(response.data)) {
      setUsers(response.data);
    } else {
      Alert.alert('Error', 'Invalid response structure for users');
    }
  } catch (error) {
    if (error.response) {
      Alert.alert('Error', `Failed to fetch users: ${error.response.data.message || error.message}`);
    } else {
      Alert.alert('Error', 'Network error or server not reachable');
    }
    console.error(error);
  }
};

const handleUpdateRestaurant = async (id, updatedData) => {
  try {
    await axios.put(`https://resturantappbackend.onrender.com/api/${id}`, updatedData);
    Alert.alert('Success', 'Restaurant updated successfully');
    fetchRestaurants(); 
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to update restaurant');
  }
};

  
  const handleAddRestaurant = async () => {
    if (!newRestaurant.name || !newRestaurant.cuisine || !newRestaurant.location || !newRestaurant.rating) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await axios.post('https://resturantappbackend.onrender.com/api/addR', newRestaurant);
      Alert.alert('Success', 'Restaurant added successfully');
      fetchRestaurants();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add restaurant');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      await axios.delete(`https://resturantappbackend.onrender.com/api/${id}`);
      Alert.alert('Success', 'Restaurant deleted successfully');
      fetchRestaurants(); // Refresh the list
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete restaurant');
    }
  };
  

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@accessToken');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const handleUpdateUser = async (id, updatedData) => {
    try {
      await axios.put(`https://resturantappbackend.onrender.com/api/users/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}` },
      });
      Alert.alert('Success', 'User updated successfully');
      fetchAllUser(); // Refresh the list
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`https://resturantappbackend.onrender.com/api/users/${id}`, {
        headers: { Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}` },
      });
      Alert.alert('Success', 'User deleted successfully');
      fetchAllUser(); // Refresh the list
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete user');
    }
  };
  
  

  const renderHeader = (section, _, isActive) => (
    <View style={[styles.itemContainer, isActive && styles.activeHeader]}>
      <Text style={styles.buttons}>Add Restaurant</Text>
    </View>
  );

  const renderContent = (section) => (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Restaurant Name"
        value={newRestaurant.name}
        onChangeText={(text) => setNewRestaurant({ ...newRestaurant, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={newRestaurant.address}
        onChangeText={(text) => setNewRestaurant({ ...newRestaurant, address: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={newRestaurant.location}
        onChangeText={(text) => setNewRestaurant({ ...newRestaurant, location: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Cuisine"
        value={newRestaurant.cuisine}
        onChangeText={(text) => setNewRestaurant({ ...newRestaurant, cuisine: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating"
        value={newRestaurant.rating}
        onChangeText={(text) => setNewRestaurant({ ...newRestaurant, rating: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={newRestaurant.imageUrl}
        onChangeText={(text) => setNewRestaurant({ ...newRestaurant, imageUrl: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddRestaurant}>
        <Text style={styles.buttonText}>Add Restaurant</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Accordion
        sections={sections}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={(newActiveSections) => setActiveSections(newActiveSections)}
        underlayColor="#f0f0f0"
      />

     
      <View style={styles.containerButton}>
        <TouchableOpacity style={styles.button} onPress={() => setIsRestaurantList(true)}>
          <Icon name="restaurant" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setIsRestaurantList(false)}>
          <Icons name="user" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      
      {isRestaurantList ? (
        <View>
          <Text style={styles.subHeader}>Restaurants</Text>
          <FlatList
            data={restaurants}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.restaurantCard}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text>{item.address}</Text>
                <Text>{item.location ? `${item.location.type}: ${item.location.coordinates}` : 'No location'}</Text>
                <Text>{item.cuisine}</Text>
                <Text>{item.rating} stars</Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleUpdateRestaurant(item._id, { ...item, rating: item.rating + 1 })}
                >
                  <Text style={styles.buttonText}>Update Rating</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDeleteRestaurant(item._id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.subHeader}>Users</Text>
          <FlatList
  data={users}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <View style={styles.restaurantCard}>
      <Text style={styles.restaurantName}>{item.fullname}</Text> 
      <Text>{item.email}</Text>
      <Text>{item.role}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleUpdateUser(item._id, { ...item, role: 'admin' })}
      >
        <Text style={styles.buttonText}>Promote to Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDeleteUser(item._id)}
      >
        <Text style={styles.buttonText}>Delete User</Text>
      </TouchableOpacity>
    </View>
  )}
/>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#D74930',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttons: {
    backgroundColor: '#D74930',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  restaurantCard: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 12,
  },
});

export default AdminPage;
