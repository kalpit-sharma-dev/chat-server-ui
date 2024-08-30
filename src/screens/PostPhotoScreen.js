import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function PostPhotoScreen({ route, navigation }) {
  const { photoUri } = route.params;
  const [photoCaption, setPhotoCaption] = useState('');

  const savePhoto = async () => {
    try {
      await MediaLibrary.createAssetAsync(photoUri);
      alert('Photo saved successfully!');
    } catch (error) {
      console.log('Error saving photo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.photo} />
      <TextInput
        style={styles.input}
        placeholder="Enter caption"
        value={photoCaption}
        onChangeText={setPhotoCaption}
      />
      <TouchableOpacity onPress={savePhoto} style={styles.button}>
        <Text style={styles.buttonText}>Save Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 300,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: '80%',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
