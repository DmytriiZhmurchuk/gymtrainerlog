import React, {useState} from 'react';
import {View, KeyboardAvoidingView, ScrollView, StyleSheet} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import {Button} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';

const GoToDate = props => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleCancel = () => {
    Navigation.dismissModal(props.componentId);
  };

  const onDateChange = (e, date) => {
    setSelectedDate(date);
  };

  const handleSave = () => {
    props.onDateSelected(selectedDate);
    handleCancel();
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, paddingHorizontal: 10, paddingTop: 20}}
      behavior={'padding'}>
      <RootSiblingParent>
        <ScrollView>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="inline"
            onChange={onDateChange}
          />

          <View>
            <Button
              title="Go"
              buttonStyle={{height: 50}}
              onPress={handleSave}
              containerStyle={{flex: 1, marginBottom: 20}}
            />
            <Button
              title="Close"
              type="outline"
              buttonStyle={{height: 50}}
              titleStyle={{color: '#d32f2f'}}
              onPress={handleCancel}
              containerStyle={{flex: 1}}
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

export default GoToDate;
