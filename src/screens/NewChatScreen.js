// NewChatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useChat } from './ChatContext';

const NewChatScreen = () => {
  const [contactName, setContactName] = useState('');
  const navigation = useNavigation();
  const { addChat } = useChat();

  const startChat = () => {
    if (contactName.trim() === '') {
      Alert.alert('Error', 'Please enter a contact name');
      return;
    }

    // Create a new chat object
    const newChat = {
      id: Date.now(),  // Use timestamp as a unique ID
      name: contactName,
      lastMessage: 'Start a conversation...',  // Initial message
    };

    // Add the new chat to the chat list
    addChat(newChat);

    // Navigate back to the AllChats screen
    navigation.navigate('AllChats');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Contact Name:</Text>
      <TextInput
        style={styles.input}
        value={contactName}
        onChangeText={setContactName}
        placeholder="Contact Name"
      />
      <Button title="Start Chat" onPress={startChat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default NewChatScreen;
