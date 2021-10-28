import React from 'react';
import {Navigation} from 'react-native-navigation';
import App from './App';
import {ClientsList, AddClient, EditClient} from './components/clients';
import {ExercisesList, AddEditExercise} from './components/exercises';
import {ActivitiesList, AddEditActivity} from './components/activities';
import {patchKeyboardListener} from './components/utils';
import {enablePromise} from 'react-native-sqlite-storage';

import {
  closeDbConnection,
  createTables,
  openDBConnection,
} from './components/db';

enablePromise(true);
patchKeyboardListener();

App.options = {
  topBar: {
    title: {
      text: 'Home',
    },
  },
};

Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: '#2196F3',
  },
  topBar: {
    title: {
      color: 'white',
    },
    backButton: {
      color: 'white',
    },
    background: {
      color: '#2196F3',
    },
  },
});

Navigation.registerComponent('com.gymtrainerlog.HomeScreen', props => App);

Navigation.registerComponent(
  'com.gymtrainerlog.ClientsList',
  () => ClientsList,
);

Navigation.registerComponent(
  'com.gymtrainerlog.ActivitiesList',
  () => ActivitiesList,
);

Navigation.registerComponent(
  'com.gymtrainerlog.ExercisesList',
  () => ExercisesList,
);

Navigation.registerComponent(
  'com.gymtrainerlog.activities.AddEditActivity',
  () => AddEditActivity,
);

Navigation.registerComponent(
  'com.gymtrainerlog.clients.AddClient',
  () => AddClient,
);

Navigation.registerComponent(
  'com.gymtrainerlog.clients.EditClient',
  () => EditClient,
);

Navigation.registerComponent(
  'com.gymtrainerlog.exercises.AddEditExercise',
  () => AddEditExercise,
);

Navigation.events().registerAppLaunchedListener(async () => {
  try {
    const db = await openDBConnection();
    await createTables(db);
    await closeDbConnection(db);
  } catch (error) {
    console.log(error);
  }
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.HomeScreen',
            },
          },
        ],
      },
    },
  });
});
