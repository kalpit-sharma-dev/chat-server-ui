// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');


  const formData = new FormData();
  formData.append('phone', phone);
  formData.append('password', password);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.12:9999/chat-service/api/login', formData,{
        // phone,
        // password,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.status === 200) {
        // Save the JWT token
        await AsyncStorage.setItem('jwtToken', response.data.token);
        console.log("#####token######### ",response.data.token)
        //navigation.navigate('Chats',{ value: phone });
        navigation.navigate('HomeTabs',{ value : phone });
      } else {
        Alert.alert('Error', 'Login failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput 
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhoneNumber}
      />
      <TextInput 
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} color="#075E54" />
      <Button title="Register" onPress={() => navigation.navigate('Register')} color="#128C7E" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
