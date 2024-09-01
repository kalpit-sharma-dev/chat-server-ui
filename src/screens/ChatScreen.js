import React, { useEffect, useState, useContext, useRef, memo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Ensure axios is installed for making HTTP requests

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
  const { token } = useContext(AuthContext);
  const { phone } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const flatListRef = useRef();
  const phoneNumber = removeAllSpaces(phone);
  const [page, setPage] = useState(1); // Pagination state

  useEffect(() => {
    const ws = new WebSocket(`ws://192.168.1.12:9999/chat-service/api/ws?token=${token}`);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setSocket(ws);
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, message]);
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(null);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [token]);

  useEffect(() => {
    // Fetch initial messages when the component mounts
    fetchMessages();
  }, [phone]);

  const fetchMessages = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.12:9999/chat-service/api/messages`, {
        params: {
          token: token,
          phone: phoneNumber,
          page: pageNumber,
          limit: 20, // Number of messages per page
        },
      });
      if (response.data.length > 0) {
        setMessages((prevMessages) => [...response.data, ...prevMessages]);
        setHasMoreMessages(response.data.length === 20);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMoreMessages && !loading) {
      setPage((prevPage) => prevPage + 1);
      fetchMessages(page + 1);
    }
  };

  const sendMessage = () => {
    if (socket && input.trim()) {
      if (socket.readyState === WebSocket.OPEN) {
        const message = { sender: phoneNumber, receiver: phoneNumber, type: "login", content: input, timestamp: new Date().toISOString() };
        console.log(message);
        socket.send(JSON.stringify(message));
        setMessages((prevMessages) => [...prevMessages, message]);
        setInput('');
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      } else {
        console.warn('WebSocket is not open. ReadyState:', socket.readyState);
      }
    } else {
      console.warn('Input is empty');
    }
  };

  const MessageItem = memo(({ item, phoneNumber }) => {
    const isSender = item.sender === phoneNumber;
    return (
      <View style={[styles.messageContainer, isSender ? styles.sender : styles.receiver]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timeStamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
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
  });

  const renderItem = ({ item }) => (
    <MessageItem item={item} phoneNumber={phoneNumber} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{phoneNumber}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp}
        style={styles.chatList}
        contentContainerStyle={{ paddingBottom: 20 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
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
  header: {
    padding: 10,
    backgroundColor: '#25D366',
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
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
