import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import WebSocket from 'react-native-websocket';
import { addReaction, editMessage, deleteMessage } from '../services/api';

const ChatScreen = ({ route }) => {
  console.log(route)
  const { phoneNumber } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.12:9999/chat-service/api/ws');

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'login', phoneNumber }));
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && input.trim()) {
      const message = { sender: phoneNumber, content: input };
      socket.send(JSON.stringify(message));
      setInput('');
    }
  };

  const handleAddReaction = async (messageId, emoji) => {
    try {
      await addReaction(messageId, phoneNumber, emoji);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      await editMessage(messageId, newContent);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View>
            <Text>{item.sender}: {item.content}</Text>
            <Button title="React" onPress={() => handleAddReaction(item.id, '👍')} />
            <Button title="Edit" onPress={() => handleEditMessage(item.id, 'Edited message')} />
            <Button title="Delete" onPress={() => handleDeleteMessage(item.id)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <TextInput
        placeholder="Type a message"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default ChatScreen;
