import React, { useEffect, useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Video from 'react-native-video';

const { height } = Dimensions.get('window');

const ReelsScreen = () => {
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    axios.get(`http://192.168.1.12:9999/chat-service/api/reels?page=${page}&limit=10`)
      .then(response => {
        console.log('Video URL:', response);
        console.log('Fetched data:', response.data);
        if (response.data.reels.length > 0) {
          setReels(prevReels => [...prevReels, ...response.data.reels]);
          setPage(prevPage => prevPage + 1);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reels', error);
        setLoading(false);
      });
  };

  const renderFooter = () => {
    return loading ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : null;
  };

  const renderItem = ({ item }) => (
    <Video
      source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }}
      style={styles.video}
      resizeMode="cover"
      repeat={true}
    />
  );

  return (
    <FlatList
      data={reels}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      snapToInterval={height}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      onEndReached={loadReels}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    height: height,
    width: '100%',
  },
  loading: {
    paddingVertical: 20,
  },
});

export default ReelsScreen;
