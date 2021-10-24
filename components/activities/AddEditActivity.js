import React from 'react';
import {View, Text, TextInput, SafeAreaView, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {CancelButton} from '../buttons';

const AddEditActivity = props => {
  const handleCancel = () => {
    Navigation.dismissModal(props.componentId);
  };
  return (
    <SafeAreaView>
      <View>
        <Text>Add new Activity screen</Text>
      </View>
      <View style={styles.row}>
        <CancelButton onPress={handleCancel} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default AddEditActivity;
