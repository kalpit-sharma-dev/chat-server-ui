import React from 'react';
import { FlatList, View, StyleSheet, Text ,TouchableOpacity  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import firebase from '@react-native-firebase/app'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './src/screens/RegisterScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatsScreen from './src/screens/ChatsScreen';
import NewChatScreen from './src/screens/NewChatScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import { ChatProvider } from './src/screens/ChatContext';
import ReelsScreen from './src/screens/ReelsScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CameraScreen from './src/screens/CameraScreen';
import { AuthProvider } from './src/context/AuthContext';
import PostVideoScreen from './src/screens/PostVideoScreen';
import PostPhotoScreen from './src/screens/PostPhotoScreen';
//import Save from './src/screens/Save';



import logo from './src/logo.svg';
import './src/App.css';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();


const API_URL = 'http://192.168.1.12:9999/chat-service/api'; // Replace with your actual API URL





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

// Bottom Tabs for Home and Settings
function HomeTabs(route) {
 // console.log(route)
 // const { value } = route.params; 
  return (
    <Tab.Navigator>
        <Tab.Screen name="Chats" initialParams={route}>
        {(props) => <ChatsScreen {...props} route={route} />}
        </Tab.Screen>
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Reels" component={ReelsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

const App = () => {


 
  



  return (
    <AuthProvider>
    <ChatProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Chats" component={ChatsScreen} />
        <Stack.Screen name="NewChat" component={NewChatScreen} />
        <Stack.Screen name="ContactsScreen" component={ContactsScreen} />
        <Stack.Screen name="Reels" component={ReelsScreen} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="PostVideoScreen" component={PostVideoScreen} options={{ title: 'Edit Video' }} />
        <Stack.Screen name="PostPhotoScreen" component={PostPhotoScreen} options={{ title: 'Edit Photo' }} />

      </Stack.Navigator>
    </NavigationContainer>
    </ChatProvider>
    </AuthProvider>
  );
};

export default App;
