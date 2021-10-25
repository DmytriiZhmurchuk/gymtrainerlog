import React from 'react';
import {View, Text, TextInput, SafeAreaView, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {AddButton} from '../buttons';

import {ButtonPrimary} from '../buttons';
const ClientsList = () => {
  const showAddNewClient = () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.clients.AddEditClient',
              options: {
                topBar: {
                  title: {
                    text: 'dynamic title',
                  },
                },
              },
            },
          },
        ],
      },
    });
  };
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
          <Text>List</Text>
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
