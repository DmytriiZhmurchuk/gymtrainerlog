import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {CancelButton, SaveButton} from '../widgets/buttons';
import Input from '../widgets/Input';
import TextArea from '../widgets/TextArea';

const AddEditClient = props => {
  const handleCancel = () => {
    Navigation.dismissModal(props.componentId);
  };
  const handleSave = () => {};
  return (
    <View style={styles.container}>
      <View style={{flexGrow: 1}}>
        <View style={styles.firstName}>
          <Text style={styles.inputLabel}>First name:</Text>
          <Input placeholder="Enter first name" />
        </View>
        <View style={styles.lastName}>
          <Text style={styles.inputLabel}>Last name:</Text>
          <Input placeholder="Enter last name" />
        </View>
        <View style={styles.notes}>
          <Text style={styles.inputLabel}>Additional Notes:</Text>
          <TextArea
            placeholder="Enter additional notes"
            multiline={true}
            numberOfLines={10}
          />
        </View>
      </View>
      <View style={styles.btnContainer}>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnContainer: {
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
  container: {
    paddingHorizontal: 10,
    paddingTop: 40,
    flex: 1,
    paddingBottom: 60,
  },
  inputLabel: {
    color: '#9e9e9e',
  },
  firstName: {
    marginBottom: 20,
  },
  lastName: {
    marginBottom: 20,
  },
  notes: {
    marginBottom: 20,
  },
});

export default AddEditClient;
