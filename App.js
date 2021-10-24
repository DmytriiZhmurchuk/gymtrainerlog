import React from 'react';

import {SafeAreaView, StyleSheet} from 'react-native';

import HomeScreen from './components/main';
const App = props => {
  return (
    <SafeAreaView style={styles.container}>
      <HomeScreen {...props} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
