import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Modal} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ListItem, Button} from 'react-native-elements';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import DeleteModal from '../widgets/DeleteModal';

import {openDBConnection, getLogRecordsByLogId, deleteLogRecord} from '../db';

const ActivityRecords = props => {
  const [listState, setListState] = useState({
    data: [],
    limit: 10,
    startIndex: 0,
  });
  const [isRefresh, setIsRefresh] = useState(false);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [logRecordID, setLogRecordId] = useState();
  const [isFetched, setIsFetched] = useState(false);

  const onDelete = id => {
    setLogRecordId(id);
    setDeleteModal(true);
  };

  const onDeleteCancel = () => {
    setLogRecordId(null);
    setDeleteModal(false);
  };

  const deleteRecord = async () => {
    try {
      const db = await openDBConnection();
      await deleteLogRecord(logRecordID, db);
      setDeleteModal(false);
      refreshList();
      showToast('Removed');
    } catch (error) {
      setDeleteModal(false);
      showToast('Db Error');
    }
  };

  const onModalDismiss = async id => {
    try {
      refreshList();
      showToast('Saved successfully');
    } catch (error) {
      showToast('Db Error');
    }
  };

  const showAddNewRecord = () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.activities.AddActivityRecord',
              passProps: {onModalDismiss, logId: props.logId},
              options: {
                topBar: {
                  title: {
                    text: 'Add new record',
                  },
                },
              },
            },
          },
        ],
      },
    });
  };

  const openRecord = id => {
    Navigation.push(props.componentId, {
      component: {
        name: 'com.gymtrainerlog.activities.EditActivityRecord',
        passProps: {recordId: id},
        options: {
          topBar: {
            title: {
              text: 'Record',
            },
          },
        },
      },
    });
  };

  const fetchLogRecords = async () => {
    try {
      const db = await openDBConnection();
      const {data, count} = await getLogRecordsByLogId(
        props.logId,
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

  const refreshList = async () => {
    try {
      const db = await openDBConnection();
      const {data, count} = await getLogRecordsByLogId(
        props.logId,
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

  const renderItem = ({item}) => {
    return (
      <ListItem
        key={item.id}
        bottomDivider
        onPress={() => {
          openRecord(item.id);
        }}>
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
        </ListItem.Content>
        <IconMaterial
          name="delete-forever"
          size={30}
          color="#d32f2f"
          onPress={() => {
            onDelete(item.id);
          }}
        />
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
        <Text style={{fontSize: 16}}>Please press add new record</Text>
      </View>
    );
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'backtohome',
            component: {
              name: 'com.gymtrainerlog.NavigationHomeButton',
              passProps: {
                id: props.componentId,
              },
            },
          },
        ],
      },
    });
    refreshList();
    setIsFetched(true);

    const screenEventListener =
      Navigation.events().registerComponentDidAppearListener(
        ({componentId, componentName}) => {
          if (
            componentName === 'com.gymtrainerlog.activities.ActivityRecords' &&
            !isFetched
          ) {
            refreshList();
          }
        },
      );
    return () => {
      screenEventListener.remove();
    };
  }, [props.componentId]);

  return (
    <SafeAreaProvider>
      <RootSiblingParent>
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <FlatList
              contentContainerStyle={{flexGrow: 1}}
              data={listState.data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={fetchLogRecords}
              extraData={listState}
              ListEmptyComponent={renderEmptyList}
              onRefresh={() => {
                setIsRefresh(true);
                refreshList();
              }}
              refreshing={isRefresh}
            />
          </View>
          <View
            style={{paddingHorizontal: 10, marginBottom: 50, marginTop: 10}}>
            <Button
              title="New record"
              icon={<EvilIcon name="plus" size={30} color="white" />}
              buttonStyle={{height: 50}}
              onPress={showAddNewRecord}
            />
          </View>
          <DeleteModal
            isOpen={isDeleteModal}
            onCancel={onDeleteCancel}
            onDelete={deleteRecord}
          />
          <View />
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    height: 210,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ActivityRecords;
