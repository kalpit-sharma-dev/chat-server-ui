// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';




const posts = [
  // Array of posts with image URLs, captions, etc.
];

const HomeScreen = ({ route }) =>  {
  //const value = route.params;
 // console.log(value)
  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text>{item.caption}</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  post: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
});


export default HomeScreen