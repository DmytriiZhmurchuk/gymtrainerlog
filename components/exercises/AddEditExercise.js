import React from 'react';
import {View, Text, TextInput, SafeAreaView, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {CancelButton, SaveButton} from '../widgets/buttons';
import Input from '../widgets/Input';

const AddEditExercise = props => {
  const handleCancel = () => {
    Navigation.dismissModal(props.componentId);
  };
  const handleSave = () => {};
  return (
    <View style={styles.container}>
      <View style={styles.exercise}>
        <Text style={styles.inputLabel}>Exercise title:</Text>
        <Input placeholder="Enter exercise name" />
      </View>
      <View style={styles.row}>
        <View style={styles.btnCancel}>
          <CancelButton onPress={handleCancel} />
        </View>
        <View style={styles.btnSave}>
          <SaveButton onPress={handleSave} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 10,
    flex: 1,
  },
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
  inputLabel: {
    color: '#9e9e9e',
  },
  exercise: {
    flexGrow: 1,
  },
});

export default AddEditExercise;
