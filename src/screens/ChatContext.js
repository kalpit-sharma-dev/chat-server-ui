// ChatContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a Context for the chat data
const ChatContext = createContext();

// Create a Provider component
export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);

  // Add a new chat to the list
  const addChat = (chat) => {
    setChats(prevChats => [...prevChats, chat]);
  };

  return (
    <ChatContext.Provider value={{ chats, addChat }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = () => useContext(ChatContext);
