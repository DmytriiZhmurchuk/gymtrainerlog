import React from 'react';
import {View, Text, TextInput, SafeAreaView, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {CancelButton, SaveButton} from '../widgets/buttons';

const AddEditActivity = props => {
  const handleCancel = () => {
    Navigation.dismissModal(props.componentId);
  };
  const handleSave = () => {};
  return (
    <SafeAreaView>
      <View>
        <Text>Add new Activity screen</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.btnCancel}>
          <CancelButton onPress={handleCancel} />
        </View>
        <View style={styles.btnSave}>
          <SaveButton onPress={handleSave} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnCancel: {
    width: 150,
    marginRight: 30,
  },
  btnSave: {
    width: 150,
  },
});

export default AddEditActivity;
