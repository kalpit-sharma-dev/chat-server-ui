// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('jwtToken');
      if (savedToken) {
        setToken(savedToken);
      }
    };
    loadToken();
  }, []);

  const login = async (newToken) => {
    await AsyncStorage.setItem('jwtToken', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
