import React, {useState, useRef, useEffect} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {SpeedDial} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import WeekView from 'react-native-week-view';
import {openDBConnection, getEventsForWeek} from '../db';
import {showToast} from '../utils';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {
  startOfWeek,
  endOfWeek,
  addDays,
  isAfter,
  isBefore,
  isEqual,
  addHours,
  getMonth,
  getDate,
} from 'date-fns';

const StyledEventComponent = ({event}) => {
  return (
    <View
      style={{
        paddingHorizontal: 5,
        paddingVertical: 15,
        flex: 1,
        alignSelf: 'flex-start',
      }}>
      <Text style={{fontSize: 16, fontWeight: '500'}}>{event.title}</Text>
      <Text>{event.description}</Text>
    </View>
  );
};

const normalizeData = (dateInWeek, data) => {
  const mondayDate = startOfWeek(dateInWeek, {weekStartsOn: 1});
  const events = [];
  for (let k = 0; k < data.length; k++) {
    const event = data[k];
    if (event.occurDays) {
      for (let i = 0; i < event.occurDays.length; i++) {
        const occurDay = event.occurDays[i];
        const eventDate = new Date(addDays(mondayDate, occurDay - 1));
        const eventStartDate = event.startDate;
        if (
          isAfter(eventDate, eventStartDate) ||
          isEqual(eventDate, eventStartDate)
        ) {
          const newEvent = {
            ...event,
            startDate: new Date(
              eventDate.getFullYear(),
              eventDate.getMonth(),
              eventDate.getDate(),
              event.startTime.hours,
              event.startTime.minutes,
            ),
            endDate: new Date(
              eventDate.getFullYear(),
              eventDate.getMonth(),
              eventDate.getDate(),
              event.endTime.hours,
              event.endTime.minutes,
            ),
          };
          events.push(newEvent);
        }
      }
    } else {
      events.push(event);
    }
  }
  return events;
};

const TimeTable = props => {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [sundayDate, setSundayDate] = useState();
  const [mondayDate, setMondayDate] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekViewRef = useRef();
  const isFetched = useRef();

  const handleOnGridLongPress = (pressEvent, startHour, date) => {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    const startTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startHour,
      0,
    );
    const endTime = addHours(startTime, 1);

    showCreateNewEventModal(startTime, endTime, date);
  };

  const handelOnEventPress = event => {
    alert('edit event , might be in seperate screen');
  };

  const handleOnEventLongPress = event => {
    alert('remove event');
  };

  const handleOnDragEvent = (event, newStartDate, newEndDate) => {};

  const handleMoveNext = async date => {
    setCurrentDate(date);
    if (isAfter(date, sundayDate)) {
      fetchEventsForCurrentWeek(date);
    }
  };
  const handleMovePrev = async date => {
    setCurrentDate(date);
    if (isBefore(date, mondayDate)) {
      fetchEventsForCurrentWeek(date);
    }
  };

  const onModalDismiss = () => {
    fetchEventsForCurrentWeek(currentDate);
  };

  const showCreateNewEventModal = (startTime, endTime, eventDate) => {
    setOpen(false);
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.events.NewEvent',
              passProps: {onModalDismiss, ...{startTime, endTime, eventDate}},
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

  const fetchEventsForCurrentWeek = async date => {
    const now = date || new Date();
    const start = startOfWeek(now, {weekStartsOn: 1});
    const end = endOfWeek(now, {weekStartsOn: 1});
    setMondayDate(start);
    setSundayDate(end);
    try {
      const db = await openDBConnection();
      const data = await getEventsForWeek(start, end, db);
      setEvents(normalizeData(now, data));
    } catch (error) {
      showToast('Failed to fetch events Db error');
    }
  };

  useEffect(() => {
    fetchEventsForCurrentWeek();
    isFetched.current = true;
    const screenEventListener =
      Navigation.events().registerComponentDidAppearListener(
        ({componentId, componentName}) => {
          if (componentName === 'com.gymtrainerlog.TimeTable') {
            if (!isFetched.current) {
              fetchEventsForCurrentWeek();
            } else {
              isFetched.current = false;
            }
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
          borderTopWidth: 1,
          borderTopColor: 'rgba(33,150,243,1)', //'#00E676',
        }}
        hoursInDisplay={10}
        EventComponent={StyledEventComponent}
        onSwipeNext={handleMoveNext}
        onSwipePrev={handleMovePrev}
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
