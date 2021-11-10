import React, {useState} from 'react';
import {format} from 'date-fns';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {Button, Input} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';

const NewEvent = props => {
  const now = new Date();
  const [date, setDate] = useState(now);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState(
    new Date().setHours(now.getHours() + 1),
  );

  const handleSave = () => {
    if (!title) {
      showToast('Title cannot be empty');
      return;
    }
    if (!desc) {
      showToast('Description cannot be empty');
      return;
    }
  };
  const handleCancel = () => {
    Navigation.dismissModal(props.componentId);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onStartimeChange = (event, selectedTime) => {
    console.log(selectedTime);
    const start = selectedTime || startTime;
    setStartTime(start);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const end = selectedTime || endTime;
    setEndTime(end);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, paddingHorizontal: 10, paddingTop: 20}}
      behavior={'padding'}>
      <RootSiblingParent>
        <ScrollView>
          <Input label="Event title" value={title} onChangeText={setTitle} />
          <Input
            label="Event description"
            numberOfLines={4}
            value={desc}
            onChangeText={setDesc}
          />
          <Input
            label="Event date"
            value={format(date, ' MMMM dd yyyy')}
            disabled
          />

          <DateTimePicker
            value={date}
            minimumDate={date}
            mode="date"
            display="compact"
            onChange={onChange}
          />

          <Input
            label="Event start time"
            value={format(startTime, 'HH:mm')}
            disabled
          />

          <DateTimePicker
            value={startTime}
            mode="time"
            display="compact"
            onChange={onStartimeChange}
          />

          <Input
            label="Event end time"
            value={format(endTime, 'HH:mm')}
            disabled
          />

          <DateTimePicker
            style={{marginBottom: 30}}
            value={endTime}
            mode="time"
            display="compact"
            onChange={onEndTimeChange}
          />

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
        </ScrollView>
      </RootSiblingParent>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default NewEvent;
