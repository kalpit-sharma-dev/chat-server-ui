import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useNavigation } from '@react-navigation/native';
import { all } from 'axios';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data);
          console.log("contact",data)
          setFilteredContacts(data);
        }
      }
    })();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredContacts(filtered);
  };


  const checkUserRegistration = async (phoneNumber) => {
    try {
      const response = await fetch(`http://192.168.1.12:9999/chat-service/api/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const result = await response.json();

      if (result.isRegistered) {
        // Navigate to the ChatScreen with the phone number if the user is registered
        navigation.navigate('ChatScreen', { phoneNumber });
      } else {
        // Show an alert if the user is not registered
        Alert.alert('User Not Registered', 'The selected contact is not registered with the app.');
      }
    } catch (error) {
      console.error('Error checking user registration:', error);
      Alert.alert('Error', 'An error occurred while checking registration status.');
    }
  };


  const handleSelectContact = (item) => {
    
    const phoneNumbers  = item.phoneNumbers;
    console.log("contact****",phoneNumbers)
    const allPhones = [];

  //var loopData = ''
  for(i=0; i < phoneNumbers.length; i++){

    allPhones.push(`${phoneNumbers[i].number}`);

    //loopData += `<li>${phoneNumbers[i].number}</li>`
}
const trimmedArray = allPhones.map(item => item.replace(/\s+/g, ''));
const uniquePhoneNumber = [...new Set(trimmedArray)];
console.log("allPhones7777777777777",allPhones)
console.log("uniqueArray",uniquePhoneNumber)

    navigation.navigate('ChatScreen', { uniquePhoneNumber :uniquePhoneNumber });

///////////////////////////

    // try {
    //   const response = await fetch(`http://192.168.1.12:9999/chat-service/api/check-user`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ phoneNumber }),
    //   });

    //   const result = await response.json();

    //   if (result.isRegistered) {
    //     // Navigate to the ChatScreen with the phone number if the user is registered
    //     navigation.navigate('ChatScreen', { phoneNumber });
    //   } else {
    //     // Show an alert if the user is not registered
    //     Alert.alert('User Not Registered', 'The selected contact is not registered with the app.');
    //   }
    // } catch (error) {
    //   console.error('Error checking user registration:', error);
    //   Alert.alert('Error', 'An error occurred while checking registration status.');
    // }


////////////////////////////////////////////////////////



  };

  const renderItem = ({ item }) => (

    <TouchableOpacity style={styles.contactItem} onPress={() => handleSelectContact(item)}>
      <Text style={styles.contactName}>{item.name}</Text>
      {item.phoneNumbers && <Text style={styles.contactNumber}>{item.phoneNumbers[0].number}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search contacts"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  contactItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 18,
  },
  contactNumber: {
    fontSize: 14,
    color: '#555',
  },
});
