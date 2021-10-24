import React, {FC} from 'react';
import {Navigation} from 'react-native-navigation';

import {View, Text, Button, StyleSheet, TouchableHighlight} from 'react-native';
import {ButtonPrimary} from '../buttons';

const HomeScreen = props => {
  const navigateToClientsList = () => {
    Navigation.push(props.componentId, {
      component: {
        name: 'com.gymtrainerlog.ClientsList',
        options: {
          topBar: {
            title: {
              text: 'Clients List',
            },
          },
        },
      },
    });
  };

  const navigateToActivitiesList = () => {
    Navigation.push(props.componentId, {
      component: {
        name: 'com.gymtrainerlog.ActivitiesList',
        options: {
          topBar: {
            title: {
              text: 'Activity Records List',
            },
          },
        },
      },
    });
  };

  const navigateToExercisesList = () => {
    Navigation.push(props.componentId, {
      component: {
        name: 'com.gymtrainerlog.ExercisesList',
        options: {
          topBar: {
            title: {
              text: 'Activity Records List',
            },
          },
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <ButtonPrimary title="Clients" onPress={navigateToClientsList} />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonPrimary title="Exercises" onPress={navigateToExercisesList} />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonPrimary title="Activities" onPress={navigateToActivitiesList} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 300,
    marginBottom: 30,
  },
});

export default HomeScreen;
