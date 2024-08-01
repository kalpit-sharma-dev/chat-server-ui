import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { login } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = async () => {
    try {
      await login(phoneNumber);
      navigation.navigate('Chat', { phoneNumber });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
