import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {CancelButton, SaveButton} from '../widgets/buttons';
import Input from '../widgets/Input';
import TextArea from '../widgets/TextArea';
import {RootSiblingParent} from 'react-native-root-siblings';
import {showToast} from '../utils';
import {openDBConnection, createClient, getClientByFirstLastName} from '../db';

const AddClient = props => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const dbRef = useRef();

  const handleCancel = () => {
    Navigation.dismissModal(props.componentId);
  };

  const handleSave = async () => {
    if (!firstName.length) {
      showToast('Client name  cannot be empty');
      return;
    }

    if (!lastName.length) {
      showToast('Client last name  cannot be empty');
      return;
    }

    try {
      if (!dbRef.current) {
        dbRef.current = await openDBConnection();
      }
      const result = await getClientByFirstLastName(
        {firstName, lastName},
        dbRef.current,
      );
      if (result[0]?.rows?.raw()?.length) {
        showToast(`Client ${firstName} ${lastName} is already exists`);
        return;
      }

      await createClient({firstName, lastName, extraNotes}, dbRef.current);
      showToast('Saved successfully');
      props.onModalDismiss();
      handleCancel();
    } catch (err) {
      showToast('Failed to save new client');
    }
  };

  const onFirstNameChange = value => {
    setFirstName(value.trim());
  };

  const onLastNameChange = value => {
    setLastName(value.trim());
  };

  const onExtraNotesChange = value => {
    setExtraNotes(value.trim());
  };

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <View style={{flexGrow: 1}}>
          <View style={styles.firstName}>
            <Text style={styles.inputLabel}>First name:</Text>
            <Input
              placeholder="Enter first name"
              onChangeText={onFirstNameChange}
            />
          </View>
          <View style={styles.lastName}>
            <Text style={styles.inputLabel}>Last name:</Text>
            <Input
              placeholder="Enter last name"
              onChangeText={onLastNameChange}
            />
          </View>
          <View style={styles.notes}>
            <Text style={styles.inputLabel}>Additional Notes:</Text>
            <TextArea
              placeholder="Enter additional notes"
              multiline={true}
              numberOfLines={10}
              onChangeText={onExtraNotesChange}
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
    </RootSiblingParent>
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

export default AddClient;
