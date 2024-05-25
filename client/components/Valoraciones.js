import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

const Valoraciones = ({ currentReviewIndex, clinicId, clinicReviews, handlePrevReview, handleNextReview, usuarios }) => {
    const currentReview = clinicReviews[currentReviewIndex[clinicId]] || clinicReviews[0];
  
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <MaterialIcons
            key={i}
            name={i <= rating ? "star" : "star-border"}
            size={20}
            color="#fe8b06"
            style={styles.starIcon}
          />
        );
      }
      return stars;
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handlePrevReview(clinicId)} disabled={currentReviewIndex[clinicId] === 0}>
          <AntDesign
            name="left"
            size={24}
            color={currentReviewIndex[clinicId] === 0 ? "#ddd" : "#fe8b06"}
            style={styles.arrow}
          />
        </TouchableOpacity>
        <View style={styles.review}>
          <View style={styles.stars}>
            {currentReview && renderStars(currentReview.valoracion)}
          </View>
          <Text style={styles.comment}>{currentReview && currentReview.comentario}</Text>
          <Text style={styles.userName}> {currentReview && currentReview.nombre_usuario}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleNextReview(clinicId, clinicReviews.length)}
          disabled={currentReviewIndex[clinicId] >= clinicReviews.length - 1}
        >
          <AntDesign
            name="right"
            size={24}
            color={currentReviewIndex[clinicId] >= clinicReviews.length - 1 ? "#ddd" : "#fe8b06"}
            style={styles.arrow}
          />
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  review: {
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  comment: {
    fontSize: 14,
    color: '#333',
  },
  userName: {
    textAlign: 'right',
    fontStyle: 'italic',
    color: 'gray',
    marginRight: 10,
    marginTop: 5,
  },
  starIcon: {
    marginHorizontal: 2,
  },
});

export default Valoraciones;
