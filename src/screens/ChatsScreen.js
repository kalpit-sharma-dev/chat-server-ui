import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Text ,TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo. Otherwise, use a similar icon package.

import ChatItem from '../components/ChatItem'; // Import your ChatItem component

const ChatsScreen = ({ route }) => {
  const navigation = useNavigation();

  const [chats, setChats] = useState([]);
  const { phone } = route.params;


  useEffect(() => {
    // Fetch chats from backend
    fetch('http://192.168.1.12:9999/chat-service/api/chats/${phone}')
      .then((response) => response.json())
      .then((data) => setChats(data))
      .catch((error) => console.error(error));
  }, []);

  const renderItem = ({ item }) => (
    <ChatItem
      name={item.name}
      lastMessage={item.lastMessage}
      timestamp={new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      unreadCount={item.unreadCount}
      profileImage={item.profileImage}
    />
  );

  return (
    <View style={styles.container}>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        /> 
      ) : (
        <View style={styles.noChatsContainer}>
          <Text style={styles.noChatsText}>No chats available</Text>
        </View>
        
      )}
<TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ContactsScreen')}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
      </TouchableOpacity>

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: 18,
    color: '#9E9E9E',
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: '#25D366', // WhatsApp green color
    borderRadius: 30,
    elevation: 8,
  },
});

export default ChatsScreen;
