import React, {useState, useRef, useEffect} from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Button, SpeedDial} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import WeekView from 'react-native-week-view';
import {openDBConnection, getEventsForWeek} from '../db';
import {showToast} from '../utils';
import {startOfWeek, endOfWeek} from 'date-fns';

const StyledEventComponent = ({event}) => {
  return (
    <View style={{paddingHorizontal: 5, paddingVertical: 15, flex: 1}}>
      <Text style={{fontSize: 16, fontWeight: '500'}}>{event.title}</Text>
      <Text>{event.description}</Text>
    </View>
  );
};

const TimeTable = props => {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const weekViewRef = useRef();

  const handleOnGridLongPress = (pressEvent, startHour, date) => {
    alert('add new Event');
  };

  const handelOnEventPress = event => {
    alert('edit event , might be in seperate screen');
  };

  const handleOnEventLongPress = event => {
    alert('remove event');
  };

  const handleOnDragEvent = (event, newStartDate, newEndDate) => {};

  const onModalDismiss = () => {};

  const showCreateNewEventModal = () => {
    setOpen(false);
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.events.NewEvent',
              passProps: {onModalDismiss},
              options: {
                topBar: {
                  title: {
                    text: 'Add new event',
                  },
                },
              },
            },
          },
        ],
      },
    });
  };

  const fetchEventsForCurrentWeek = async () => {
    const now = new Date();
    const start = startOfWeek(now, {weekStartsOn: 1});
    const end = endOfWeek(now, {weekStartsOn: 1});
    console.log(start);
    try {
      const db = await openDBConnection();
      const data = await getEventsForWeek(start, end, db);
      console.log(data);
    } catch (error) {
      console.log(error);
      showToast('Failed to fetch events Db error');
    }
  };

  useEffect(() => {
    fetchEventsForCurrentWeek();
    const screenEventListener =
      Navigation.events().registerComponentDidAppearListener(
        ({componentId, componentName}) => {
          if (componentName === 'com.gymtrainerlog.TimeTable') {
            //refetch events here
          }
        },
      );

    return () => {
      screenEventListener.remove();
    };
  }, [props.componentId]);

  return (
    <View style={{flex: 1}}>
      <WeekView
        onGridLongPress={handleOnGridLongPress}
        onEventPress={handelOnEventPress}
        onEventLongPress={handleOnEventLongPress}
        onDragEvent={handleOnDragEvent}
        events={events}
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
        ref={ref => {
          weekViewRef.current = ref;
        }}
      />

      <SpeedDial
        buttonStyle={{backgroundColor: 'rgba(33,150,243,1)'}}
        isOpen={open}
        icon={{name: 'edit', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          buttonStyle={{backgroundColor: 'rgba(33,150,243,1)'}}
          icon={{name: 'add', color: '#fff'}}
          title="Add new event"
          onPress={showCreateNewEventModal}
        />
        <SpeedDial.Action
          buttonStyle={{backgroundColor: 'rgba(33,150,243,1)'}}
          icon={<Icon name="calendar" color="white" size={20} />}
          title="Go to specific date"
          onPress={() => console.log('Delete Something')}
        />
      </SpeedDial>
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
