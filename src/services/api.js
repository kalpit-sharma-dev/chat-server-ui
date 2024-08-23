import axios from 'axios';

const API_URL = 'http://192.168.1.10:9999/chat-service/api'; // Replace with your server URL

export const register = async (phoneNumber) => {
  return axios.post(`${API_URL}/register`, { phoneNumber });
};

export const verify = async (phoneNumber, code) => {
  return axios.post(`${API_URL}/verify`, { phoneNumber, code });
};

export const login = async (phoneNumber) => {
  return axios.post(`${API_URL}/login`, { phoneNumber });
};

export const addReaction = async (messageId, user, emoji) => {
  return axios.post(`${API_URL}/reactions`, { messageId, user, emoji });
};

export const editMessage = async (messageId, newContent) => {
  return axios.post(`${API_URL}/messages/edit`, { messageId, newContent });
};

export const deleteMessage = async (messageId) => {
  return axios.post(`${API_URL}/messages/delete`, { messageId });
};
