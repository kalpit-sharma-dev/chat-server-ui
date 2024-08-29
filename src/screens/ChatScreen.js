import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import WebSocket from 'react-native-websocket';
import { Ionicons } from '@expo/vector-icons';

const substring = '+91';

const removeAllSpaces = (str) => {
  const contain = str.includes(substring);
  if (!contain) {
    str = substring + str;
  }
  if (typeof str === 'string') {
    return str.replace(/\s+/g, '');
  }
  return ''; 
};

const ChatScreen = ({ route }) => {
  const { phone } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);

  const phoneNumber = removeAllSpaces(phone);

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.12:9999/chat-service/api/ws');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      ws.send(JSON.stringify({ type: 'login', phoneNumber }));
      setSocket(ws); // Set the socket after connection is opened
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(null); // Reset the socket when connection is closed
    };

    return () => {
      if (ws) {
        ws.close(); // Close the WebSocket connection on cleanup
      }
    };
  }, [phoneNumber]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      const message = { sender: phoneNumber, content: input };
      socket.send(JSON.stringify(message));
      setInput('');
    } else {
      console.warn('WebSocket is not open or input is empty');
    }
  };

  const renderItem = ({ item }) => {
    const isSender = item.sender === phoneNumber;
    return (
      <View style={[styles.messageContainer, isSender ? styles.sender : styles.receiver]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timeStamp}>{item.timestamp}</Text>
        {isSender && (
          <View style={styles.messageOptions}>
            <TouchableOpacity onPress={() => handleEditMessage(item.id, 'Edited message')}>
              <Ionicons name="pencil" size={20} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteMessage(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.chatList}
        contentContainerStyle={{ paddingBottom: 20 }}
        inverted // To display the latest message at the bottom
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message"
          value={input}
          onChangeText={setInput}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
  },
  messageText: {
    fontSize: 16,
  },
  timeStamp: {
    fontSize: 10,
    color: 'gray',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#ECE5DD',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#ECE5DD',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#25D366',
    borderRadius: 20,
    padding: 10,
  },
  messageOptions: {
    flexDirection: 'row',
    position: 'absolute',
    right: 5,
    top: 5,
  },
});

export default ChatScreen;
