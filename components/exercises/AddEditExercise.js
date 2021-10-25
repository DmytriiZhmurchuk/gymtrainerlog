import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {CancelButton, SaveButton} from '../widgets/buttons';
import Input from '../widgets/Input';
import {RootSiblingParent} from 'react-native-root-siblings';
import {showToast} from '../utils';

const AddEditExercise = props => {
  const [exercise, setExercise] = useState('');

  const handleExcerciseChange = value => {
    setExercise(value);
  };

  const handleCancel = () => {
    Navigation.dismissModal(props.componentId);
  };

  const handleSave = () => {
    if (!exercise.length) {
      showToast('Exercise name  cannot be empty');
      return;
    }

    showToast('Saved Successfully');
  };
  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <View style={styles.exercise}>
          <Text style={styles.inputLabel}>Exercise title:</Text>
          <Input
            placeholder="Enter exercise name"
            onChangeText={handleExcerciseChange}
          />
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
    </RootSiblingParent>
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
