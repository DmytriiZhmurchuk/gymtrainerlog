import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, SafeAreaView, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {AddButton} from '../widgets/buttons';
import {getAllClients, openDBConnection} from '../db';
import {showToast} from '../utils';

const ClientsList = () => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const db = await openDBConnection();
      const results = await getAllClients(db);
      var temp = [];
      for (let i = 0; i < results[0].rows.length; ++i) {
        temp.push(results[0].rows.item(i));
      }
      setClients(temp);
    } catch (error) {
      showToast('DB error');
    }
  };

  const onModalDismiss = () => {
    fetchClients();
  };

  const showAddNewClient = () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.clients.AddClient',
              passProps: {onModalDismiss},
              options: {
                topBar: {
                  title: {
                    text: 'Add new client',
                  },
                },
              },
            },
          },
        ],
      },
    });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.row}>
          <AddButton title={'Add New Client'} onPress={showAddNewClient} />
        </View>
        <View>
          <TextInput placeholder="Search" />
        </View>
        <View>
          {clients.map(client => {
            return <Text>{`${client.firstName}-${client.lastName}`}</Text>;
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ClientsList;
