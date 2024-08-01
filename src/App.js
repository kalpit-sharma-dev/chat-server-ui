import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './src/screens/RegisterScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import logo from './logo.svg';
import './App.css';



const API_URL = 'https://example.com/api'; // Replace with your actual API URL

export const getChats = async () => {
  try {
    const response = await axios.get(`${API_URL}/chats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const getChatMessages = async (chatId) => {
  try {
    const response = await axios.get(`${API_URL}/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

export const sendMessage = async (chatId, message) => {
  try {
    const response = await axios.post(`${API_URL}/chats/${chatId}/messages`, { text: message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};













const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
