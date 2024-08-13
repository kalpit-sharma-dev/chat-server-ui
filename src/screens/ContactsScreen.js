import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function loadContacts() {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app would like to view your contacts.',
            buttonPositive: 'Please accept bare mortal',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Contacts permission denied');
          return;
        }
      }

      Contacts.getAll()
        .then((contacts) => {
          setContacts(contacts);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    loadContacts();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.contactItem} 
      onPress={() => {
        // Handle contact selection (e.g., start a chat)
        console.log('Selected contact:', item.givenName, item.familyName);
      }}
    >
      <Text style={styles.contactName}>
        {item.givenName} {item.familyName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.recordID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 18,
  },
});
