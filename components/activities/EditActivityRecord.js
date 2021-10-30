import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  getLogRecordById,
  openDBConnection,
  updateLogRecord,
  deleteLogRecord,
} from '../db';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Button, Input, Card, Text} from 'react-native-elements';
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
    // setDeleteModal(false);
    //debugger;
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
    if (!isEditMode) {
      fetchData();
    }
  }, [isEditMode]);
  return (
    <SafeAreaProvider>
      <RootSiblingParent>
        {!isEditMode && (
          <View style={styles.container}>
            <Card containerStyle={{flexGrow: 1, marginBottom: 30}}>
              <View style={styles.row}>
                <View style={{flexGrow: 1}}>
                  <Text h4>{date}</Text>
                </View>
                <View>
                  <Button
                    icon={
                      <IconMaterial
                        name="mode-edit"
                        size={30}
                        color="#2196F3"
                      />
                    }
                    type="clear"
                    onPress={enableEditMode}
                  />
                </View>
                <View>
                  <Button
                    icon={
                      <IconMaterial
                        name="delete-outline"
                        size={30}
                        color="#d32f2f"
                        onPress={onDelete}
                      />
                    }
                    type="clear"
                  />
                </View>
              </View>
              <Card.Divider />
              <View style={{marginTop: 40, marginBottom: 20}}>
                <Text h4>Title:</Text>
                <Text style={{fontSize: 20}}>{title}</Text>
              </View>
              <View style={styles.margin20}>
                <Text h4>Count:</Text>
                <Text style={{fontSize: 20}}>{count}</Text>
              </View>
              <View style={styles.margin20}>
                <Text h4>Weight:</Text>
                <Text style={{fontSize: 20}}>{weight}</Text>
              </View>
              <View style={styles.margin20}>
                <Text h4>Time:</Text>
                <Text style={{fontSize: 20}}>{time}</Text>
              </View>
            </Card>
            <DeleteModal
              isOpen={isDeleteModal}
              onCancel={onDeleteCancel}
              onDelete={deleteRecord}
            />
          </View>
        )}
        {isEditMode && (
          <View style={styles.container}>
            <Card containerStyle={{flexGrow: 1}}>
              <View style={styles.row}>
                <View style={{paddingBottom: 15}}>
                  <Text h4>{date}</Text>
                </View>
              </View>
              <Card.Divider />
              <View>
                <View style={{marginTop: 40}}>
                  <Input
                    value={title}
                    label="Title"
                    placeholder="Enter title e.g. Jumping for time"
                    onChangeText={onTitleChange}
                  />
                </View>

                <View style={styles.margin20}>
                  <Input
                    label="Count"
                    value={count}
                    placeholder="Enter number of repeating"
                    onChangeText={onCountChange}
                  />
                </View>

                <View style={styles.margin20}>
                  <Input
                    value={weight}
                    label="Weight:"
                    placeholder="Enter Weight"
                    onChangeText={onWeightChange}
                  />
                </View>

                <View style={styles.margin20}>
                  <Input
                    value={time}
                    label="Time"
                    placeholder="Enter Time"
                    onChangeText={onTimeChange}
                  />
                </View>
              </View>
            </Card>
            <View
              style={{
                ...styles.row,
                marginBottom: 60,
                marginTop: 10,
                paddingHorizontal: 15,
              }}>
              <Button
                title="Save changes"
                icon={<EvilIcon name="check" size={30} color="white" />}
                buttonStyle={{height: 50}}
                onPress={handleSave}
                containerStyle={{flex: 1, marginRight: 2.5}}
              />
              <Button
                title="Cancel changes"
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
      </RootSiblingParent>
    </SafeAreaProvider>
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
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 15,
  },
});

export default EditActivityRecord;
