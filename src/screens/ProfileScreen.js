// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const userPosts = [
  // Array of user posts
];

export default function ProfileScreen() {
  const renderItem = ({ item }) => (
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Username</Text>
      <FlatList
        data={userPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: '33%',
    height: 100,
  },
});
