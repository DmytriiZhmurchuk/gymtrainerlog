import React from 'react';
import {View, Text} from 'react-native';
import {LinearProgress} from 'react-native-elements';

const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
      }}>
      <Text>Loading...</Text>
      <LinearProgress color="primary" />
    </View>
  );
};

export default Loading;
