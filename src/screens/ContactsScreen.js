import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        setContacts(data);
        setFilteredContacts(data);
      }
    })();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const handleContactPress = (contact) => {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 1) {
      setSelectedContact(contact);
      setModalVisible(true);
    } else if (contact.phoneNumbers.length === 1) {
      navigateToChat(contact.phoneNumbers[0].number);
    }
  };

   async function navigateToChat (phoneNumber) {
    setModalVisible(false);
    try {
      const response = await axios.post('http://192.168.1.12:9999/chat-service/api/check-user', {
        phoneNumber: phoneNumber,
    });   
      console.log(response.data)
      const result = response.data;

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



    //navigation.navigate('ChatScreen', { phoneNumber });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Contacts"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleContactPress(item)}>
            <Text style={styles.contactName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedContact && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select a number for {selectedContact.name}:</Text>
            {selectedContact.phoneNumbers.map((phone, index) => (
              <Button
                key={index}
                title={phone.number}
                onPress={() => navigateToChat(phone.number)}
              />
            ))}
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  searchBar: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  contactName: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContactsScreen;
