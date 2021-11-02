import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Input from '../widgets/Input';
import TextArea from '../widgets/TextArea';
import {RootSiblingParent} from 'react-native-root-siblings';
import {showToast} from '../utils';
import {openDBConnection, createClient, getClientByFirstLastName} from '../db';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {Button} from 'react-native-elements';

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
    setFirstName(value);
  };

  const onLastNameChange = value => {
    setLastName(value);
  };

  const onExtraNotesChange = value => {
    setExtraNotes(value);
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons: [],
      },
    });
  }, [props.componentId]);

  return (
    <RootSiblingParent>
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            <View style={{flexGrow: 0.8}}>
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
            <View style={styles.row}>
              <Button
                title="Save"
                icon={<EvilIcon name="check" size={30} color="white" />}
                buttonStyle={{height: 50}}
                onPress={handleSave}
                containerStyle={{flex: 1, marginRight: 2.5}}
              />
              <Button
                title="Cancel"
                type="outline"
                icon={<EvilIcon name="close-o" size={30} color="#d32f2f" />}
                buttonStyle={{height: 50}}
                titleStyle={{color: '#d32f2f'}}
                onPress={handleCancel}
                containerStyle={{flex: 1, marginLeft: 2.5}}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </RootSiblingParent>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnContainer: {
    flex: 1,
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
    paddingTop: 10,
    flex: 1,
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
