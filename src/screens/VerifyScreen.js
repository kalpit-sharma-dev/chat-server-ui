import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { verify } from '../services/api';

const VerifyScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    try {
      await verify(phoneNumber, code);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Verify</Text>
      <TextInput
        placeholder="Verification Code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
};

export default VerifyScreen;
