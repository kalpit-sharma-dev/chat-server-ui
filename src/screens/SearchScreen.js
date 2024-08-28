// src/screens/SearchScreen.js
import React from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';

export default function SearchScreen() {
  const [searchText, setSearchText] = React.useState('');

  const handleSearch = (text) => {
    setSearchText(text);
    // Implement search logic here
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchText}
      />
      <FlatList
        data={[]} // Array of search results
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
