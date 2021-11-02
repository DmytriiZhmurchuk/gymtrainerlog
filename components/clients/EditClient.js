import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {
  getClientById,
  updateClientById,
  openDBConnection,
  removeClient,
} from '../db';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Avatar, Button, Input} from 'react-native-elements';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import DeleteModal from '../widgets/DeleteModal';
import {Navigation} from 'react-native-navigation';

const EditClient = props => {
  const [isEditMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchData = async () => {
    try {
      const db = await openDBConnection();

      const result = await getClientById(props.clientId, db);
      if (result[0].rows.length) {
        const client = result[0].rows.item(0);
        setFirstName(client.firstName);
        setLastName(client.lastName);
        setExtraNotes(client.extraNotes);
      }
    } catch (error) {
      showToast('DB error');
    }
  };

  const enableEditMode = () => {
    setEditMode(true);
  };

  const disableEditMode = () => {
    setEditMode(false);
  };

  const saveChanges = async () => {
    if (!firstName.length) {
      showToast('Client name  cannot be empty');
      return;
    }

    if (!lastName.length) {
      showToast('Client last name  cannot be empty');
      return;
    }

    try {
      const db = await openDBConnection();

      await updateClientById(
        {id: props.clientId, firstName, lastName, extraNotes},
        db,
      );
      setEditMode(false);
      showToast('Saved Successfully');
    } catch (error) {
      showToast('Failed to save changes');
    }
  };

  const cancelChanges = () => {
    disableEditMode();
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

  const deleteClient = async () => {
    try {
      const db = await openDBConnection();
      await removeClient(props.clientId, db);
      setShowDeleteModal(false);
      Navigation.pop(props.componentId);
    } catch (error) {
      setShowDeleteModal(false);
      showToast('Failed to remove client');
    }
  };

  const cancelDeleteClient = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (!isEditMode) {
      fetchData();
    }
  }, [isEditMode]);
  return (
    <SafeAreaProvider>
      <RootSiblingParent>
        <KeyboardAvoidingView
          behavior={'height'}
          style={{flex: 1}}
          contentContainerStyle={{flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flexGrow: 1}}>
              <View style={styles.container}>
                <Avatar
                  rounded
                  size="large"
                  icon={{name: 'user', type: 'font-awesome'}}
                  activeOpacity={0.7}
                  overlayContainerStyle={{backgroundColor: '#eeeeee'}}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      marginTop: 10,
                    }}>{`${firstName} ${lastName}`}</Text>
                </View>
                {!isEditMode && (
                  <View style={styles.row}>
                    <View>
                      <Button
                        icon={
                          <IconMaterial
                            name="delete-outline"
                            size={20}
                            color="#d32f2f"
                            onPress={() => {
                              setShowDeleteModal(true);
                            }}
                          />
                        }
                        buttonStyle={{borderColor: '#d32f2f', height: 50}}
                        type="clear"
                      />
                    </View>
                    <View style={{marginLeft: 20}}>
                      <Button
                        icon={
                          <IconMaterial
                            name="mode-edit"
                            size={20}
                            color="#2196F3"
                          />
                        }
                        buttonStyle={{height: 50}}
                        type="clear"
                        onPress={enableEditMode}
                      />
                    </View>
                  </View>
                )}
              </View>
              <View style={{flexGrow: 1}}>
                <Input
                  inputStyle={{fontSize: 16}}
                  placeholder="Enter firstname"
                  value={firstName}
                  onChangeText={onFirstNameChange}
                  disabled={!isEditMode}
                />
                <Input
                  inputStyle={{fontSize: 16}}
                  placeholder="Enter lastname"
                  value={lastName}
                  onChangeText={onLastNameChange}
                  disabled={!isEditMode}
                />
                <Input
                  inputStyle={{fontSize: 16}}
                  placeholder="Enter extra notes"
                  value={extraNotes}
                  onChangeText={onExtraNotesChange}
                  multiline={true}
                  numberOfLines={10}
                  disabled={!isEditMode}
                />
              </View>
              {isEditMode && (
                <View
                  style={{
                    marginTop: 50,
                    flexDirection: 'row',
                    paddingBottom: 60,
                    justifyContent: 'center',
                  }}>
                  <View style={{marginRight: 20}}>
                    <Button
                      buttonStyle={{height: 50}}
                      type="solid"
                      title={'Save changes'}
                      titleStyle={{fontSize: 16}}
                      onPress={saveChanges}
                    />
                  </View>
                  <View>
                    <Button
                      type="outline"
                      title={'Cancel changes'}
                      buttonStyle={{
                        borderColor: '#d32f2f',
                        height: 50,
                      }}
                      titleStyle={{color: '#d32f2f', fontSize: 16}}
                      onPress={cancelChanges}
                    />
                  </View>
                </View>
              )}

              <DeleteModal
                isOpen={showDeleteModal}
                onDelete={deleteClient}
                onCancel={cancelDeleteClient}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </RootSiblingParent>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
});

export default EditClient;
