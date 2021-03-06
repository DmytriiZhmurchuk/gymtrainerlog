import {Navigation} from 'react-native-navigation';
import {ClientsList, AddClient, EditClient} from './components/clients';
import NavigationHomeButton from './components/widgets/HomeButton';
import {
  ActivitiesList,
  ActivityRecords,
  AddActivityRecord,
  EditActivityRecord,
} from './components/activities';
import TimeTable from './components/timetable';
import NewEvent from './components/timetable/NewEvent';
import GoToDate from './components/timetable/GoToDate';
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
      text: 'Clients',
    },
  },
  bottomTab: {
    text: "Client's work log",
  },
};

Navigation.registerComponent(
  'com.gymtrainerlog.NavigationHomeButton',
  () => NavigationHomeButton,
);

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
  bottomTab: {
    fontSize: 14,
    selectedTextColor: '#2196F3',
  },
});

Navigation.registerComponent(
  'com.gymtrainerlog.NavigationHomeButton',
  () => NavigationHomeButton,
);

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

Navigation.registerComponent('com.gymtrainerlog.TimeTable', () => TimeTable);
Navigation.registerComponent(
  'com.gymtrainerlog.events.NewEvent',
  () => NewEvent,
);
Navigation.registerComponent(
  'com.gymtrainerlog.events.GoToDate',
  () => GoToDate,
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
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'com.gymtrainerlog.TimeTable',
                  },
                },
              ],
            },
          },
          {
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
        ],
      },
    },
  });
});
