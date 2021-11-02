import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ListItem, SearchBar, Button} from 'react-native-elements';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import LogModal from './Modal';
import DeleteModal from '../widgets/DeleteModal';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {
  createLog,
  openDBConnection,
  getLogsByClientId,
  updateLog,
  deleteLog,
  searchLogs,
} from '../db';

const ActivitiesList = props => {
  const [search, setSearch] = useState();
  const [showNewLogModal, setShowNewLogModal] = useState(false);
  const [showDeleteLogModal, setShowDeleteLogModal] = useState(false);

  const [logName, setLogName] = useState('');
  const [logId, setLogId] = useState();
  const [showEditModal, setEditModal] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const [listState, setListState] = useState({
    data: [],
    limit: 10,
    startIndex: 0,
  });

  const updateSearch = value => {
    setSearch(value);
  };

  const showAddNewRecord = () => {
    setShowNewLogModal(true);
  };

  const showEditLogModal = title => {
    setLogName(title);
    setEditModal(true);
  };

  const cancelEditModal = () => {
    setEditModal(false);
    setLogName('');
    setLogId(null);
  };

  const doSearch = async () => {
    try {
      const db = await openDBConnection();
      const {data} = await searchLogs(search, db);

      setListState({
        ...listState,
        data: data,
      });
    } catch (error) {
      showToast('DB error');
    }
  };

  const saveEdit = async () => {
    try {
      const db = await openDBConnection();
      await updateLog({title: logName, id: logId}, db);
      setEditModal(false);
      showToast('Saved succesfully');
      onRefresh();
    } catch (error) {
      showToast('DB error');
    }
  };

  const fetchLogs = async () => {
    try {
      const db = await openDBConnection();
      const {data, count} = await getLogsByClientId(
        props.clientId,
        listState.limit,
        listState.startIndex,
        db,
      );

      const len = listState.data.length + data.length;

      if (count > len) {
        setListState({
          ...listState,
          startIndex: len,
          data: listState.data.concat(data),
        });
      } else if (count === len) {
        setListState({
          ...listState,
          data: listState.data.concat(data),
        });
      }
    } catch (error) {
      showToast('DB error');
    }
  };

  const onRefresh = async () => {
    setSearch(undefined);
    try {
      const db = await openDBConnection();
      const {data, count} = await getLogsByClientId(
        props.clientId,
        listState.limit,
        0,
        db,
      );
      let startIdx = 0;
      if (count > data.length) {
        startIdx = listState.limit;
      }

      setListState({
        ...listState,
        startIndex: startIdx,
        data: data,
      });

      setIsRefresh(false);
    } catch (error) {
      setIsRefresh(false);
      showToast('DB error');
    }
  };

  const openLogRecords = id => {
    Navigation.push(props.componentId, {
      component: {
        name: 'com.gymtrainerlog.activities.ActivityRecords',
        passProps: {logId: id},
        options: {
          topBar: {
            title: {
              text: 'Records',
            },
          },
        },
      },
    });
  };

  const removeLog = async () => {
    try {
      const db = await openDBConnection();
      await deleteLog(logId, db);
      setLogId(null);
      setShowDeleteLogModal(false);
      showToast('Removed successfully');
      onRefresh();
    } catch (error) {
      setLogId(null);
      setShowDeleteLogModal(false);
      showToast('Failed to delete activity');
    }
  };

  const cancelDeleteLog = () => {
    setLogId(null);
    setShowDeleteLogModal(false);
  };

  const renderItem = ({item}) => {
    return (
      <ListItem
        key={item.id}
        bottomDivider
        onLongPress={() => {
          const options = {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          };

          ReactNativeHapticFeedback.trigger('impactHeavy', options);
          setLogId(item.id);
          setShowDeleteLogModal(true);
        }}
        onPress={() => {
          openLogRecords(item.id);
        }}>
        <IconMaterial
          name="mode-edit"
          size={20}
          color="#2196F3"
          onPress={() => {
            setLogId(item.id);
            showEditLogModal(item.title);
          }}
        />
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron size={20} />
      </ListItem>
    );
  };

  const renderEmptyList = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 16}}>There are no items.</Text>
        <Text style={{fontSize: 16}}>Please press add new log</Text>
      </View>
    );
  };

  const saveNewLog = async () => {
    if (!logName) {
      return;
    }
    try {
      const db = await openDBConnection();
      await createLog({title: logName, clientId: props.clientId}, db);
      setShowNewLogModal(false);
      setLogName('');
      showToast('Saved');
      onRefresh();
    } catch (error) {
      showToast('DB error');
      setLogName('');
    }
  };

  const cancelNewLog = () => {
    setShowNewLogModal(false);
    setLogName('');
  };

  useEffect(() => {
    const navigationEventListener = Navigation.events().bindComponent({
      props: {componentId: props.componentId},
      componentWillAppear() {
        fetchLogs();
      },
    });

    return () => {
      navigationEventListener.remove();
    };
  }, [props.componentId]);

  useEffect(() => {
    if (search === undefined) {
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      if (search === '') {
        onRefresh();
      } else {
        doSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <SafeAreaProvider>
      <RootSiblingParent>
        <View style={styles.container}>
          <View>
            <SearchBar
              platform="ios"
              placeholder="Type Here..."
              onChangeText={updateSearch}
              value={search}
            />
          </View>
          <View style={{flex: 1}}>
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
              }}
              data={listState.data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReachedThreshold={0.1}
              initialNumToRender={9}
              onEndReached={info => {
                if (!search) {
                  fetchLogs();
                }
              }}
              extraData={listState}
              ListEmptyComponent={renderEmptyList}
              onRefresh={() => {
                setIsRefresh(true);
                onRefresh();
              }}
              refreshing={isRefresh}
            />
          </View>
          <View
            style={{paddingHorizontal: 10, marginBottom: 50, marginTop: 10}}>
            <Button
              title="New log"
              icon={<EvilIcon name="plus" size={30} color="white" />}
              buttonStyle={{height: 50}}
              onPress={showAddNewRecord}
            />
          </View>
          <LogModal
            isOpen={showNewLogModal}
            onCancel={cancelNewLog}
            onSave={saveNewLog}
            onChangeText={setLogName}
            value={logName}
          />
          <LogModal
            isOpen={showEditModal}
            onCancel={cancelEditModal}
            onSave={saveEdit}
            onChangeText={setLogName}
            value={logName}
          />
          <DeleteModal
            isOpen={showDeleteLogModal}
            onDelete={removeLog}
            onCancel={cancelDeleteLog}
          />
        </View>
      </RootSiblingParent>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ActivitiesList;
