import React, {useState, useRef, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {SpeedDial} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import WeekView from 'react-native-week-view';
import {
  openDBConnection,
  getEventsForWeek,
  cancelEvent,
  removeEvent,
} from '../db';
import {showToast} from '../utils';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ContextMenu from 'react-native-context-menu-view';

import {
  startOfWeek,
  endOfWeek,
  addDays,
  isAfter,
  isBefore,
  isEqual,
  addHours,
} from 'date-fns';

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
            startFrom: event.startDate,
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
  const currenDateRef = useRef();

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

    showCreateNewEventModal({startTime, endTime, eventDate: date});
  };

  const handleOnEventLongPress = event => {
    //do nothing required just to prevent bubbling and show ctx menu
  };

  const handleMoveNext = async date => {
    setCurrentDate(date);
    currenDateRef.current = date;
    if (isAfter(date, sundayDate)) {
      fetchEventsForCurrentWeek(date);
    }
  };
  const handleMovePrev = async date => {
    setCurrentDate(date);
    currenDateRef.current = date;
    if (isBefore(date, mondayDate)) {
      fetchEventsForCurrentWeek(date);
    }
  };

  const onModalDismiss = () => {
    fetchEventsForCurrentWeek(currentDate);
  };
  const onDateSelected = date => {
    setCurrentDate(date);
    weekViewRef.current.goToDate(date, false);
    fetchEventsForCurrentWeek(date);
  };

  const showCreateNewEventModal = ({
    startFrom,
    startTime,
    endTime,
    eventDate,
    title,
    description,
    eventId,
    occurDays,
    cancellationDates,
  } = {}) => {
    setOpen(false);
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.events.NewEvent',
              passProps: {
                onModalDismiss,
                ...{
                  startFrom,
                  startTime,
                  endTime,
                  eventDate,
                  title,
                  description,
                  eventId,
                  cancellationDates,
                  occurDays,
                },
              },
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

  goToDate = () => {
    setOpen(false);
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.events.GoToDate',
              passProps: {
                onDateSelected,
              },
              options: {
                topBar: {
                  title: {
                    text: 'Select date to view events',
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
      const normalizedEvents = normalizeData(now, data);
      const filteredEvents = normalizedEvents.filter(evt => {
        const cancelDates = evt?.cancellationDates || [];
        const isFound = cancelDates.find(d => {
          const evtDate = new Date(
            evt.startDate.getFullYear(),
            evt.startDate.getMonth(),
            evt.startDate.getDate(),
          );
          const cancelDate = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
          );
          return isEqual(cancelDate, evtDate);
        });
        return !isFound;
      });
      setEvents(filteredEvents);
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
              fetchEventsForCurrentWeek(currenDateRef.current);
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

  const StyledEventComponent = ({event}) => {
    let menuActions = [
      {title: 'Edit'},
      {title: 'Remove', destructive: true, systemIcon: 'trash'},
    ];
    if (event.occurDays) {
      menuActions = [
        {title: 'Edit'},
        {title: 'Cancel', destructive: true, systemIcon: 'trash.slash'},
        {title: 'Remove', destructive: true, systemIcon: 'trash'},
      ];
    }
    return (
      <ContextMenu
        previewBackgroundColor="#E1F5FE"
        style={{
          alignSelf: 'flex-start',
          flexGrow: 1,
          width: '100%',
        }}
        actions={menuActions}
        onPress={async e => {
          const actionName = e.nativeEvent.name;
          if (actionName === 'Edit') {
            showCreateNewEventModal({
              startFrom: event.startFrom,
              startTime: event.startDate,
              endTime: event.endDate,
              eventDate: event.startDate,
              title: event.title,
              description: event.description,
              eventId: event.id,
              occurDays: event.occurDays,
              cancellationDates: event.cancellationDates,
            });
          }
          if (actionName === 'Cancel') {
            try {
              const db = await openDBConnection();
              await cancelEvent(event.id, currentDate, db);
              fetchEventsForCurrentWeek(currentDate);
            } catch (error) {
              showToast('cancellation failed, db error');
            }
          }
          if (actionName === 'Remove') {
            try {
              const db = await openDBConnection();
              await removeEvent(event.id, db);
              fetchEventsForCurrentWeek(currentDate);
            } catch (error) {
              showToast('remove failed, db error');
            }
          }
        }}>
        <ScrollView
          style={{
            paddingHorizontal: 5,
            paddingVertical: 15,
            flex: 1,
          }}>
          <Text style={{fontWeight: '500'}}>{event.title.trim()}</Text>
          <Text>{event.description}</Text>
        </ScrollView>
      </ContextMenu>
    );
  };

  return (
    <View style={{flex: 1}}>
      <WeekView
        onGridLongPress={handleOnGridLongPress}
        onEventLongPress={handleOnEventLongPress}
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
          borderTopColor: 'rgba(33,150,243,1)',
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
          onPress={() => showCreateNewEventModal()}
        />
        <SpeedDial.Action
          buttonStyle={{backgroundColor: 'rgba(33,150,243,1)'}}
          icon={<Icon name="calendar" color="white" size={20} />}
          title="Go to specific date"
          onPress={() => goToDate()}
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
