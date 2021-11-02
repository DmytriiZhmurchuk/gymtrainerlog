import React, {useEffect, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, ScrollView} from 'react-native';
import {
  getLogRecordById,
  openDBConnection,
  updateLogRecord,
  deleteLogRecord,
} from '../db';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Button, Input, Text} from 'react-native-elements';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {Navigation} from 'react-native-navigation';
import DeleteModal from '../widgets/DeleteModal';

const EditActivityRecord = props => {
  const [isEditMode, setEditMode] = useState(false);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [date, setDate] = useState('');

  const [title, setTitle] = useState('');
  const [count, setCount] = useState('');
  const [weight, setWeight] = useState('');
  const [time, setTime] = useState('');

  const fetchData = async () => {
    try {
      const db = await openDBConnection();
      const result = await getLogRecordById(props.recordId, db);
      if (result[0].rows.length) {
        const record = result[0].rows.item(0);
        setTitle(record.title);
        setWeight(record.weight);
        setCount(record.count);
        setTime(record.time);
        setDate(record.date);
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

  const handleSave = async () => {
    if (!title.length) {
      showToast('Title cannot be empty');
      return;
    }

    try {
      const db = await openDBConnection();
      await updateLogRecord(
        {id: props.recordId, title, count, weight, time},
        db,
      );
      setEditMode(false);
      showToast('Saved Successfully');
    } catch (error) {
      showToast('Failed to save changes');
    }
  };

  const handleCancel = () => {
    disableEditMode();
  };

  const onTitleChange = value => {
    setTitle(value.trim());
  };

  const onCountChange = value => {
    setCount(value.trim());
  };

  const onWeightChange = value => {
    setWeight(value.trim());
  };

  const onTimeChange = value => {
    setTime(value.trim());
  };

  const deleteRecord = async () => {
    try {
      const db = await openDBConnection();
      await deleteLogRecord(props.recordId, db);
      Navigation.pop(props.componentId);
    } catch (error) {
      console.log(error);
      showToast('Db Error');
    }
  };

  const onDelete = () => {
    setDeleteModal(true);
  };

  onDeleteCancel = () => {
    setDeleteModal(false);
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'backtohome',
            component: {
              name: 'com.gymtrainerlog.NavigationHomeButton',
              passProps: {
                id: props.componentId,
              },
            },
          },
        ],
      },
    });
    if (!isEditMode) {
      fetchData();
    }
  }, [isEditMode]);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={'padding'}
      keyboardVerticalOffset={80}>
      <SafeAreaProvider>
        <RootSiblingParent>
          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                marginTop: 20,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={{color: '#9e9e9e', paddingHorizontal: 10}}>
                  Created at:
                </Text>
                <Text style={{color: '#9e9e9e', paddingHorizontal: 10}}>
                  {date}
                </Text>
              </View>
              {!isEditMode && (
                <View style={{flexDirection: 'row'}}>
                  <Button
                    icon={
                      <IconMaterial
                        name="mode-edit"
                        size={20}
                        color="#2196F3"
                      />
                    }
                    type="clear"
                    onPress={enableEditMode}
                  />
                  <Button
                    icon={
                      <IconMaterial
                        name="delete-outline"
                        size={20}
                        color="#d32f2f"
                        onPress={onDelete}
                      />
                    }
                    type="clear"
                  />
                </View>
              )}
            </View>
            {!isEditMode && (
              <View style={{paddingHorizontal: 10}}>
                <View style={{marginBottom: 20}}>
                  <Text style={{color: '#9e9e9e'}}>Title:</Text>
                  <Text style={{fontSize: 20}}>{title}</Text>
                </View>
                <View style={styles.margin20}>
                  <Text style={{color: '#9e9e9e'}}>Count:</Text>
                  <Text style={{fontSize: 20}}>{count}</Text>
                </View>
                <View style={styles.margin20}>
                  <Text style={{color: '#9e9e9e'}}>Weight:</Text>
                  <Text style={{fontSize: 20}}>{weight}</Text>
                </View>
                <View style={styles.margin20}>
                  <Text style={{color: '#9e9e9e'}}>Time:</Text>
                  <Text style={{fontSize: 20}}>{time}</Text>
                </View>
              </View>
            )}
            {isEditMode && (
              <View>
                <Input
                  value={title}
                  label="Title:"
                  placeholder="Enter title e.g. Jumping for time"
                  onChangeText={onTitleChange}
                />
                <Input
                  label="Count:"
                  value={count}
                  placeholder="Enter number of repeating"
                  onChangeText={onCountChange}
                />
                <Input
                  value={weight}
                  label="Weight:"
                  placeholder="Enter Weight"
                  onChangeText={onWeightChange}
                />
                <Input
                  value={time}
                  label="Time:"
                  placeholder="Enter Time"
                  onChangeText={onTimeChange}
                />
                <View
                  style={{
                    ...styles.row,
                    marginTop: 10,
                    paddingHorizontal: 10,
                  }}>
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
            )}
          </ScrollView>
          <DeleteModal
            isOpen={isDeleteModal}
            onCancel={onDeleteCancel}
            onDelete={deleteRecord}
          />
        </RootSiblingParent>
      </SafeAreaProvider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  margin20: {
    marginBottom: 20,
  },
  container: {
    flex: 1,
  },
  row: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default EditActivityRecord;
