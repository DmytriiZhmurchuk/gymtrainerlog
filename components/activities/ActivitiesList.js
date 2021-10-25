import React from 'react';
import {View, Text, TextInput, SafeAreaView, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {AddButton} from '../widgets/buttons';

const ActivitiesList = () => {
  const showAddNewRecord = () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.activities.AddEditActivity',
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
          <AddButton title={'Add New Record'} onPress={showAddNewRecord} />
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

export default ActivitiesList;
