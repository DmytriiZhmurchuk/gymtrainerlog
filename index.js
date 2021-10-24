import {Navigation} from 'react-native-navigation';
import App from './App';
import {ClientsList} from './components/clients';
import {ExercisesList} from './components/exercises';
import {ActivitiesList, AddEditActivity} from './components/activities';

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

Navigation.registerComponent('com.gymtrainerlog.HomeScreen', () => App);

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

Navigation.events().registerAppLaunchedListener(() => {
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
