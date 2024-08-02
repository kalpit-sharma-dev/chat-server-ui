// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert ,Animated} from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Append form fields to the FormData object
  const formData = new FormData();
  formData.append('phone', mobile);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('email', email);

  const handleRegister = async () => {
    if (!username || !password || !email) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.8:9999/chat-service/api/register',formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // username,
        // password,
        // email,

      });
      console.log('Response:', response);
      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', 'Registration failed');
      }
    } catch (error) {

      if (error.response) {
        // Server responded with a status code outside of the 2xx range
        console.error('Error Response1:', error.response.data);
      } else if (error.request) {
        // No response was received from the server
        console.error('Error Request2:', error.request);
      } else {
        // Something else went wrong
        console.error('Error Message3:', error.message);
      }
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };
  const moveToLogin =async ()=> {
    navigation.navigate('Login') 
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput 
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput 
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="numeric"
        value={mobile}
        onChangeText={setMobile}
      />
      <TextInput 
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Login" onPress={moveToLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default RegisterScreen;
