import React, {useState, useRef} from 'react';
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
import {RootSiblingParent} from 'react-native-root-siblings';
import {showToast} from '../utils';
import {openDBConnection, createLogRecord} from '../db';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {Button} from 'react-native-elements';

const AddActivityRecord = props => {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState('');
  const [weight, setWeight] = useState('');
  const [time, setTime] = useState('');

  const dbRef = useRef();

  const handleCancel = () => {
    Navigation.dismissModal(props.componentId);
  };

  const handleSave = async () => {
    if (!title.length) {
      showToast('record title  cannot be empty');
      return;
    }

    try {
      if (!dbRef.current) {
        dbRef.current = await openDBConnection();
      }
      const result = await createLogRecord(
        {logId: props.logId, title, weight, count, time},
        dbRef.current,
      );
      props.onModalDismiss(result[0].insertId);
      handleCancel();
    } catch (err) {
      showToast('Failed to add record');
    }
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

  return (
    <RootSiblingParent>
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            <View style={{flexGrow: 1}}>
              <View style={styles.margin20}>
                <Text style={styles.inputLabel}>Title:</Text>
                <Input
                  placeholder="Enter title e.g. Jumping for time"
                  onChangeText={onTitleChange}
                />
              </View>

              <View style={styles.margin20}>
                <Text style={styles.inputLabel}>Count:</Text>
                <Input
                  placeholder="Enter number of repeating"
                  onChangeText={onCountChange}
                />
              </View>

              <View style={styles.margin20}>
                <Text style={styles.inputLabel}>Weight:</Text>
                <Input
                  placeholder="Enter Weight"
                  onChangeText={onWeightChange}
                />
              </View>

              <View style={styles.margin20}>
                <Text style={styles.inputLabel}>Enter time:</Text>
                <Input placeholder="Enter Time" onChangeText={onTimeChange} />
              </View>
            </View>
            <View style={{...styles.row, marginBottom: 50}}>
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
  margin20: {
    marginBottom: 20,
  },
});

export default AddActivityRecord;
