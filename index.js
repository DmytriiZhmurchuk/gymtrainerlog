import {Navigation} from 'react-native-navigation';
import {ClientsList, AddClient, EditClient} from './components/clients';
import {
  ActivitiesList,
  ActivityRecords,
  AddActivityRecord,
  EditActivityRecord,
} from './components/activities';
import {patchKeyboardListener} from './components/utils';
import {enablePromise} from 'react-native-sqlite-storage';

import {
  closeDbConnection,
  createTables,
  openDBConnection,
} from './components/db';

enablePromise(true);
patchKeyboardListener();

ClientsList.options = {
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

Navigation.registerComponent(
  'com.gymtrainerlog.HomeScreen',
  props => ClientsList,
);

Navigation.registerComponent(
  'com.gymtrainerlog.ActivitiesList',
  () => ActivitiesList,
);

Navigation.registerComponent(
  'com.gymtrainerlog.activities.ActivityRecords',
  () => ActivityRecords,
);

Navigation.registerComponent(
  'com.gymtrainerlog.activities.EditActivityRecord',
  () => EditActivityRecord,
);

Navigation.registerComponent(
  'com.gymtrainerlog.clients.AddClient',
  () => AddClient,
);

Navigation.registerComponent(
  'com.gymtrainerlog.activities.AddActivityRecord',
  () => AddActivityRecord,
);

Navigation.registerComponent(
  'com.gymtrainerlog.clients.EditClient',
  () => EditClient,
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
