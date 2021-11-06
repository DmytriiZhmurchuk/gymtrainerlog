import React from 'react';
import {View, Text, Dimensions} from 'react-native';
// import EventCalendar from 'react-native-events-calendar';
import WeekView from 'react-native-week-view';
const myEvents = [
  {
    id: 1,
    title: 'Event title',
    description:
      'Dmytrii Zhmurchuk Zhmurchuk  Zhmurchuk Zhmurchuk Zhmurchuk Zhmurchuk',
    startDate: new Date(2021, 10, 6, 12, 0),
    endDate: new Date(2021, 10, 6, 13, 0),
    color: 'blue',
    // ... more properties if needed,
  },
  // More events...
];

const handleOnGridLongPress = (pressEvent, startHour, date) => {
  alert('add new Event');
};

const handelOnEventPress = event => {
  alert('edit event , might be in seperate screen');
};

const handleOnEventLongPress = event => {
  alert('remove event');
};

const handleOnDragEvent = (event, newStartDate, newEndDate) => {
  alert('handle on drag event');
};

const StyledEventComponent = ({event}) => {
  return (
    <View style={{paddingHorizontal: 5, paddingVertical: 15, flex: 1}}>
      <Text style={{fontSize: 16, fontWeight: '500'}}>{event.title}</Text>
      <Text>{event.description}</Text>
    </View>
  );
};

const TimeTable = () => {
  return (
    <View style={{flex: 1}}>
      <WeekView
        onGridLongPress={handleOnGridLongPress}
        onEventPress={handelOnEventPress}
        onEventLongPress={handleOnEventLongPress}
        onDragEvent={handleOnDragEvent}
        events={myEvents}
        selectedDate={new Date()}
        numberOfDays={1}
        showTitle={false}
        startHour={6}
        formatDateHeader="YYYY MMM D, ddd"
        headerStyle={{
          backgroundColor: '#78909C',
          color: '#fff',
          borderColor: '#fff',
        }}
        headerTextStyle={{
          color: '#fff',
          fontSize: 16,
        }}
        eventContainerStyle={{
          backgroundColor: '#E1F5FE',
          color: '#000',
        }}
        hoursInDisplay={10}
        EventComponent={StyledEventComponent}
      />
    </View>
  );
};

TimeTable.options = {
  topBar: {
    title: {
      text: 'Time table',
    },
  },
  bottomTab: {
    text: 'Schedule',
  },
};

export default TimeTable;
