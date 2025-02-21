import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReviewScreen({ navigation }) {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([
    { review: 'The app was super efficient! Booking a table was smooth and quick.', rating: 5 },
    { review: 'It was a bit slow during peak hours but overall not bad.', rating: 3 },
    { review: 'Loading times were longer than expected. Needs improvement.', rating: 2 },
    { review: 'Very fast and responsive. Had no issues at all.', rating: 5 },
    { review: 'Experienced occasional lags but nothing too disruptive.', rating: 4 },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('@authToken');

        if (!token) {
          Alert.alert('Error', 'You are not logged in');
          return;
        }

        console.log('Stored Token:', token);

        const response = await fetch('https://restaurantappbackend.onrender.com/api/reviews', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleReviewSubmit = () => {
    try {
      const response = fetch('https://restaurantappbackend.onrender.com/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const newReview = { review, rating };
      setReviews([...reviews, newReview]);
      setReview('');
      setRating(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave a Review</Text>
      <TextInput
        style={styles.input}
        value={review}
        onChangeText={(text) => setReview(text)}
        placeholder="Write your review"
      />
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Rating:</Text>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setRating(num)}>
            <Text style={styles.ratingOption}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <FlatList 
          
          data={reviews}
          renderItem={({ item }) => (
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>{item.review}</Text>
              <Text style={styles.ratingText}>Rating: {item.rating}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    height: 100,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 25,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    color: 'white',
  },
  ratingText: {
    fontSize: 18,
    marginRight: 10,
    color: 'white',
  },
  ratingOption: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#D74930',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
  },

  
  reviewContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius:13,
    justifyContent:'space-evenly', 
    gap:1,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
    color:'white'
  },
});
