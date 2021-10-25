import React from 'react';
import {View, Text, TextInput, SafeAreaView, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {AddButton} from '../buttons';

const ExercisesList = () => {
  const showAddNewExercise = () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.exercises.AddEditExercise',
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
          <AddButton title={'Add New Exercise'} onPress={showAddNewExercise} />
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

export default ExercisesList;
