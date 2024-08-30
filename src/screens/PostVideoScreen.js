import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

export default function PostVideoScreen({ route, navigation }) {
  const { videoUri } = route.params;
  const [videoTitle, setVideoTitle] = useState('');
  const [musicUri, setMusicUri] = useState(null);

  const addMusic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Audio,
    });
    if (!result.cancelled) {
      setMusicUri(result.uri);
    }
  };

  const saveVideo = async () => {
    try {
      await MediaLibrary.createAssetAsync(videoUri);
      alert('Video saved successfully!');
    } catch (error) {
      console.log('Error saving video:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        style={styles.video}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter video title"
        value={videoTitle}
        onChangeText={setVideoTitle}
      />
      <TouchableOpacity onPress={addMusic} style={styles.button}>
        <Text style={styles.buttonText}>{musicUri ? 'Change Music' : 'Add Music'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={saveVideo} style={styles.button}>
        <Text style={styles.buttonText}>Save Video</Text>
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
  video: {
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
