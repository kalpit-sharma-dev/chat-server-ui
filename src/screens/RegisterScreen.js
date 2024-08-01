import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { register } from '../services/api';

const RegisterScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleRegister = async () => {
    try {
      await register(phoneNumber);
      navigation.navigate('Verify', { phoneNumber });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Register</Text>
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
