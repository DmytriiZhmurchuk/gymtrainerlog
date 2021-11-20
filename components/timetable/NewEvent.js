import React, {useState} from 'react';
import {format} from 'date-fns';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {Button, Input, CheckBox} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  createOneDayEvent,
  createRegularEvent,
  removeEvent,
  openDBConnection,
} from '../db';

const NewEvent = props => {
  const now = new Date();
  const eventId = props.eventId;
  const occurDays = props.occurDays;
  const startFrom = props.startFrom;
  const cancellationDates = props.cancellationDates;
  const nowPlusHour = new Date(new Date().setHours(now.getHours() + 1));
  const [date, setDate] = useState(
    startFrom ? startFrom : props.eventDate || now,
  );
  const [title, setTitle] = useState(props.title || '');
  const [desc, setDesc] = useState(props.description || '');
  const [startTime, setStartTime] = useState(props.startTime || now);
  const [endTime, setEndTime] = useState(props.endTime || nowPlusHour);

  const [occurrance, setOccurrence] = useState({
    mon: {
      id: 1,
      value: occurDays ? occurDays.indexOf(1) !== -1 : false,
    },
    tue: {
      id: 2,
      value: occurDays ? occurDays.indexOf(2) !== -1 : false,
    },
    wed: {
      id: 3,
      value: occurDays ? occurDays.indexOf(3) !== -1 : false,
    },
    thu: {
      id: 4,
      value: occurDays ? occurDays.indexOf(4) !== -1 : false,
    },
    fri: {
      id: 5,
      value: occurDays ? occurDays.indexOf(5) !== -1 : false,
    },
    sat: {
      id: 6,
      value: occurDays ? occurDays.indexOf(6) !== -1 : false,
    },
    sun: {
      id: 7,
      value: occurDays ? occurDays.indexOf(7) !== -1 : false,
    },
  });

  const handleSave = async () => {
    if (!title) {
      showToast('Title cannot be empty');
      return;
    }
    if (!desc) {
      showToast('Description cannot be empty');
      return;
    }
    try {
      const propertyNames = Object.keys(occurrance);
      const repeatsOn = [];
      for (let i = 0; i < propertyNames.length; i++) {
        if (occurrance[propertyNames[i]].value) {
          repeatsOn.push(occurrance[propertyNames[i]].id);
        }
      }
      const db = await openDBConnection();
      if (eventId) {
        await removeEvent(eventId, db);
      }
      if (repeatsOn.length) {
        await createRegularEvent(
          {
            title,
            desc,
            eventDate: date,
            startTime,
            endTime,
            occurance: repeatsOn,
            cancellationDates,
          },
          db,
        );
      } else {
        await createOneDayEvent(
          {
            title,
            desc,
            eventDate: date,
            startTime,
            endTime,
          },
          db,
        );
      }
      props.onModalDismiss();
      handleCancel();
    } catch (error) {
      showToast('Cannot save due to Db error');
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
    const start = selectedTime || startTime;
    setStartTime(start);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const end = selectedTime || endTime;
    setEndTime(end);
  };

  const onMonCheck = () => {
    setOccurrence({
      ...occurrance,
      mon: {...occurrance.mon, value: !occurrance.mon.value},
    });
  };
  const onTueCheck = () => {
    setOccurrence({
      ...occurrance,
      tue: {...occurrance.tue, value: !occurrance.tue.value},
    });
  };
  const onWedCheck = () => {
    setOccurrence({
      ...occurrance,
      wed: {...occurrance.wed, value: !occurrance.wed.value},
    });
  };
  const onThuCheck = () => {
    setOccurrence({
      ...occurrance,
      thu: {...occurrance.thu, value: !occurrance.thu.value},
    });
  };
  const onFriCheck = () => {
    setOccurrence({
      ...occurrance,
      fri: {...occurrance.fri, value: !occurrance.fri.value},
    });
  };
  const onSatCheck = () => {
    setOccurrence({
      ...occurrance,
      sat: {...occurrance.sat, value: !occurrance.sat.value},
    });
  };
  const onSunCheck = () => {
    setOccurrence({
      ...occurrance,
      sun: {...occurrance.sun, value: !occurrance.sun.value},
    });
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, paddingHorizontal: 10, paddingTop: 20}}
      behavior={'padding'}>
      <RootSiblingParent>
        <ScrollView>
          <Input
            label="Event title:"
            value={title}
            onChangeText={setTitle}
            maxLength={40}
          />
          <Input
            label="Event description:"
            multiline
            maxLength={80}
            value={desc}
            onChangeText={setDesc}
          />
          <Input
            label={startFrom ? 'Start from:' : 'Event date:'}
            value={format(new Date(date), ' MMMM dd yyyy')}
            disabled
          />
          <DateTimePicker
            value={date}
            minimumDate={now}
            mode="date"
            display="compact"
            onChange={onChange}
          />
          <Input
            label="Event start time:"
            value={format(new Date(startTime), 'HH:mm')}
            disabled
          />

          <DateTimePicker
            value={startTime}
            mode="time"
            display="compact"
            onChange={onStartimeChange}
          />
          <Input
            label="Event end time:"
            value={format(new Date(endTime), 'HH:mm')}
            disabled
          />

          <DateTimePicker
            style={{marginBottom: 30}}
            value={endTime}
            mode="time"
            display="compact"
            onChange={onEndTimeChange}
          />
          <View style={{marginBottom: 30}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                paddingVertical: 10,
                paddingHorizontal: 15,
              }}>
              Repeats on:
            </Text>
            <View>
              <CheckBox
                checked={occurrance.mon.value}
                title="Every Monday"
                onIconPress={onMonCheck}
              />
              <CheckBox
                checked={occurrance.tue.value}
                title="Every Tuesday"
                onIconPress={onTueCheck}
              />
              <CheckBox
                checked={occurrance.wed.value}
                title="Every Wednesday"
                onIconPress={onWedCheck}
              />
              <CheckBox
                checked={occurrance.thu.value}
                title="Every Thursday"
                onIconPress={onThuCheck}
              />
              <CheckBox
                checked={occurrance.fri.value}
                title="Every Friday"
                onIconPress={onFriCheck}
              />
              <CheckBox
                checked={occurrance.sat.value}
                title="Every Saturday"
                onIconPress={onSatCheck}
              />
              <CheckBox
                checked={occurrance.sun.value}
                title="Every Sunday"
                onIconPress={onSunCheck}
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
