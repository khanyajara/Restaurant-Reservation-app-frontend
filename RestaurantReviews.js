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
} from 'react-native';

export default function ReviewScreen({ navigation }) {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   
    const fetchReviews = async () => {
      setLoading(true);
      try {
        
        const response = await fetch('https://restaurantappbackend.onrender.com/api/reviews', {
          method: 'GET',

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
    try{
      const response = fetch('https://restaurantappbackend.onrender.com/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
    })
    
    const newReview = { review, rating };
    setReviews([...reviews, newReview]);
    setReview('');
    setRating(0);
  }
  catch(error){
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
        <TouchableOpacity onPress={() => setRating(1)}>
          <Text style={styles.ratingOption}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRating(2)}>
          <Text style={styles.ratingOption}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRating(3)}>
          <Text style={styles.ratingOption}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRating(4)}>
          <Text style={styles.ratingOption}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRating(5)}>
          <Text style={styles.ratingOption}>5</Text>
        </TouchableOpacity>
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
          keyExtractor={(item) => item.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    padding: 20,
    height:100,
   
    backgroundColor:'black'

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:25,
    color:'white'
    
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
     color:'white'
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
     color:'white'
  },
  ratingText: {
    fontSize: 18,
    marginRight: 10,
     color:'white'
  },
  ratingOption: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
     color:'white'
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
});