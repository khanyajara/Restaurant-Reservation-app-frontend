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
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
// import { format } from 'date-fns';

const { height: screenHeight } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [viewingReservations, setViewingReservations] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [maxDistance, setMaxDistance] = useState(5);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const slideAnimation = new Animated.Value(screenHeight);
  const reservationSlideAnimation = new Animated.Value(screenHeight);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://resturantappbackend.onrender.com/api/getR');
        if (Array.isArray(response.data.restaurants)) {
          setRestaurants(response.data.restaurants);
          console.log(response.data)
        } else {
          console.error('Invalid data format: ', response.data);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);


    
  const showDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setDetailsVisible(true);
    Animated.timing(slideAnimation, {
      toValue: screenHeight * 0.2,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hotDeals = [
    {
      id: '1',
      name: 'Buy 1 Get 1 Free!',
      description: 'Available at Roco Mamas',
    },
    {
      id: '2',
      name: '20% Off Meals',
      description: 'Available at KFC',
    },
    {
      id: '3',
      name: 'Free Dessert',
      description: 'Available at Aarti’s Indian Cuisine',
    },
    {
      id: '4',
      name: '30% Off Your Bill',
      description: 'Available at Flamingo Casino Conference Centre',
    },
    {
      id: '5',
      name: 'Family Meal Deal – Feed 4 for 50%',
      description: 'Available at McDonalds'
    },
    {
      id: '6',
      name: 'Free Drink with Any Main Course',
      description: 'Available at Nandos',
    },
    {
      id: '7',
      name: 'Buy 1 Get 1 Free on Starters',
      description: 'Available at The Curry Pot',
    },
    {
      id: '8',
      name: 'Free Delivery on Orders Above $20',
      description: 'Available at Pizza Place',
    },
    {
      id: '9',
      name: '10% Off for Students',
      description: 'Available at Burger King',
    },
    {
      id: '10',
      name: 'Weekend Special: 2 for 1 Tacos',
      description: 'Available at Taco Delight',
    },
    {
      id: '11',
      name: '50% Off on All Drinks',
      description: 'Available at The Bar Kimberley',
    },
    {
      id: '12',
      name: 'Free Dessert with Any Main Course',
      description: 'Available at Buca Di Beppo',
    },
  ];

  const hideDetails = () => {
    Animated.timing(slideAnimation, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDetailsVisible(false);
    });
  };

  const toggleReservations = () => {
    if (!viewingReservations) {
      Animated.timing(reservationSlideAnimation, {
        toValue: screenHeight * 0.2,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setViewingReservations(true);
      });
    } else {
      Animated.timing(reservationSlideAnimation, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setViewingReservations(false);
      });
    }
  };

  const bookReservation = () => {
    alert(`You have successfully booked a table for ${selectedReservation.time}`);
    setViewingReservations(false);
    hideDetails();
  };

  const refreshPage = () => {
    setLoading(true);
    setSelectedMealType('');
    setSelectedTime('');
    setMaxDistance(5);
    setIsFiltersVisible(false);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

//   const filteredRestaurants = Array.isArray(restaurants)
//   ? restaurants.filter((restaurant) => {
//       const matchesMealType = selectedMealType ? restaurant.mealType === selectedMealType : true;
//       console.log('matchesMealType:', matchesMealType, selectedMealType, restaurant.mealType);
      
//       const matchesTime = selectedTime
//         ? restaurant.reservations && restaurant.reservations.some((res) => res.time === selectedTime)
//         : true;
//       console.log('matchesTime:', matchesTime, selectedTime, restaurant.reservations);
      
//       const matchesDistance = restaurant.distance <= maxDistance;
//       console.log('matchesDistance:', matchesDistance, restaurant.distance, maxDistance);

//       return matchesMealType && matchesTime && matchesDistance;
//     })
//   : [];

// console.log('filteredRestaurants:', filteredRestaurants);


  const gotoReservation = () => {
    navigation.navigate('Booking', {
      restaurant: selectedRestaurant,
    });
  };

  const restaurantReviews = () => {
    navigation.navigate('Review', {
      restaurant: selectedRestaurant,
    });
  };

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity onPress={() => showDetails(item)}>
      <View style={styles.card}>
        <Image 
          source={ {uri: item.imageUrl } }
          style={styles.image} 
        />
        <View style={styles.cardContent}>
          <Text style={styles.restaurantName}>{item.name || 'Unnamed Restaurant'}</Text>
          <Text style={styles.restaurantDetails}>📍{item.address || 'No address available'}</Text>
          <Text style={styles.restaurantRating}>⭐ {item.rating || 'No rating'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  

  const renderHotDeals = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hotDealsContainer}>
      {hotDeals.map((deal) => (
        <View key={deal.id} style={styles.hotDealCard}>
          <Text style={styles.hotDealName}>{deal.name}</Text>
          <Text style={styles.hotDealDescription}>{deal.description}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.gradient}>
      <View style={styles.container}>
        <TouchableOpacity onPress={refreshPage}>
          <Image
            source={require('./assets/Feast-Finder-removebg-preview.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <TextInput
            placeholder="Search restaurants..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={() => setIsFiltersVisible(!isFiltersVisible)} style={styles.ios}>
            <Icon name="filter" size={35} color="#D74930" />
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        <Modal visible={isFiltersVisible} animationType="slide" transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.filterModal}>
              <ScrollView style={styles.filters}>
                <View style={styles.filterGroup}>
                  <Text>Meal Type:</Text>
                  <TouchableOpacity onPress={() => setSelectedMealType('Dinner')}>
                    <Text style={styles.filterButton}>Dinner</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelectedMealType('Lunch')}>
                    <Text style={styles.filterButton}>Lunch</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.filterGroup}>
                  <Text>Available Times:</Text>
                  <TouchableOpacity onPress={() => setSelectedTime('7:00 PM')}>
                    <Text style={styles.filterButton}>7:00 PM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelectedTime('8:00 PM')}>
                    <Text style={styles.filterButton}>8:00 PM</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.filterGroup}>
                  <Text>Max Distance (km):</Text>
                  <TouchableOpacity onPress={() => setMaxDistance(5)}>
                    <Text style={styles.filterButton}>5 km</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setMaxDistance(10)}>
                    <Text style={styles.filterButton}>10 km</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.closeButton} onPress={() => setIsFiltersVisible(false)}>
                <Text style={styles.closeButtonText}>Close Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        
        
          <FlatList
            ListHeaderComponent={renderHotDeals}
            data={restaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        


        {detailsVisible && (
  <Animated.View
    style={[
      styles.details,
      {
        transform: [{ translateY: slideAnimation }],
        height: screenHeight * 0.8,
      },
    ]}
  >
    <ScrollView style={styles.detailsContent}>
      {/* Displaying Restaurant Details */}
      <View style={styles.restaurantContainer}>
        {/* Display Restaurant Image */}
        <Image
          source={{ uri: selectedRestaurant?.imageUrl }} // Using image URL or Base64
          style={styles.restaurantImage}
        />
        
        {/* Restaurant Name */}
        <Text style={styles.restaurantName}>{selectedRestaurant?.name}</Text>
        
        {/* Restaurant Address */}
        <Text style={styles.restaurantAddress}>{selectedRestaurant?.address}</Text>
        
        {/* Restaurant Rating */}
        <Text style={styles.restaurantRating}>Rating: {selectedRestaurant?.rating} ⭐</Text>
        
        {/* Available Slots */}
        <View style={styles.availableSlotsContainer}>
          {selectedRestaurant?.availableSlots?.map((slot, index) => (
            <Text key={index} style={styles.slotText}>
              {slot.startTime} - {slot.endTime} - {slot.isAvailable ? "Available" : "Not Available"}
            </Text>
          ))}
        </View>
      </View>

      {/* Toggle Reservations and Reviews */}
      <TouchableOpacity style={styles.reservationButton} onPress={toggleReservations}>
        <Text style={styles.reservationButtonText}>
          {viewingReservations ? 'Hide Reservations' : 'View Available Reservations'}
        </Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.reservationButton} onPress={restaurantReviews}>
        <Text>Leave a review</Text>
      </TouchableOpacity>
  
      <Text style={styles.reviewsTitle}>Reviews</Text>
      {selectedRestaurant?.reviews?.length > 0 ? (
        selectedRestaurant.reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.reviewerName}>{review.reviewer}</Text>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noReviewsText}>No reviews available</Text>
      )}
  
      <TouchableOpacity onPress={hideDetails}>
        <Text style={styles.closeButton}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  </Animated.View>
)}

  
        {viewingReservations && (
          <Animated.View
            style={[
              styles.reservationsDetails,
              {
                transform: [{ translateY: slideAnimation }],
                height: screenHeight,
              },
            ]}
          >
            <ScrollView style={styles.detailsContent}>
              <Text style={styles.detailsTitle}>Available Reservations for {selectedRestaurant?.name}</Text>
  
              <View style={styles.reservationsList}>
                <Text style={styles.reservationTitle}>Available Reservations:</Text>
                {selectedRestaurant?.availableSlots.map((reservation, index) => (
                  <View key={index} style={styles.reservationItem}>
                    <Text style={styles.reservationTime}>{reservation.startTime} - {reservation.endTime}</Text>
                    <Text style={styles.availableTables}>
                      {reservation.isAvailable ? 'Available' : 'Not Available'}
                    </Text>
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => {
                        setSelectedReservation(reservation);
                        bookReservation();
                        gotoReservation();
                      }}
                    >
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
  
              <TouchableOpacity style={styles.closeButton} onPress={toggleReservations}>
                <Text style={styles.closeButtonText}>Close Reservations</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}  

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: -10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 200,
    height: 200,
    marginLeft: 80,
  },
  ios: {
    marginLeft: 25,
    marginTop: -15,
  },
  searchInput: {
    backgroundColor: '#d9d9d9',
    color: 'black',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    height: 50,
    width: 280,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModal: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  filters: {
    marginBottom: 20,
  },
  filterGroup: {
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: '#D74930',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
    marginTop: 5,
  },
  closeButton: {
    fontSize: 18,
    color: '#007bff',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#88878a',
    borderRadius: 10,
    marginTop: 19,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  image: {
    width: 340,
    height: 200,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
  reviewCard: {
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  reviewComment: {
    fontSize: 14,
    color: 'white',
  },
  noReviewsText: {
    fontSize: 14,
    color: 'white',
    fontStyle: 'italic',
    marginTop: 10,
  },
  
  restaurantDetails: {
    fontSize: 14,
    color: 'black',
    marginVertical: 5,
  },
  restaurantRating: {
    fontSize: 14,
    color: 'gold',
  },
  hotDealsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
    textAlign: 'left',
  },
  hotDealsContainer: {
    marginBottom: 20,
    height:90,
  },
  hotDealCard: {
    width: 200,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#444',
    padding: 10,
  },
  hotDealImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  hotDealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  hotDealDescription: {
    fontSize: 14,
    color: 'lightgray',
    marginTop: 5,
  },
  details: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
  detailsContent: {
    paddingBottom: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 15,
  },
  detailsAddress: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  detailsRating: {
    fontSize: 16,
    color: 'gold',
  },
  reservationButton: {
    marginTop: 10,
    backgroundColor: '#d9d9d9',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
    textAlign: 'center',
    paddingVertical: 10,
  },
  reservationsDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
  reservationsList: {
    marginBottom: 20,
  },
  reservationItem: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    marginVertical: 5,
    borderRadius: 5,
  },
  reservationTime: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  availableTables: {
    fontSize: 14,
    color: 'gray',
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: '#d74930',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
  },
}); 

