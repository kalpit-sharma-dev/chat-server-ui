import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ChatItem = ({ name, lastMessage, timestamp, unreadCount, profileImage }) => (
  <View style={styles.container}>
    <Image source={{ uri: profileImage }} style={styles.profileImage} />
    <View style={styles.chatDetails}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>{lastMessage}</Text>
    </View>
    <View style={styles.meta}>
      <Text style={styles.timestamp}>{timestamp}</Text>
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{unreadCount}</Text>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  lastMessage: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  meta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatItem;
