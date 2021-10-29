import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Modal} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  ListItem,
  Avatar,
  SearchBar,
  Button,
  Input,
} from 'react-native-elements';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {createLog, openDBConnection, getLogsByClientId} from '../db';

const ActivitiesList = props => {
  const [search, setSearch] = useState();
  const [showNewLogModal, setShowNewLogModal] = useState(false);
  const [logName, setLogName] = useState('');

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

  const fetchLogs = () => {
    setListState({...listState});
  };

  const refreshLogs = async () => {
    debugger;
    setListState({
      limit: 10,
      startIndex: 0,
      data: [],
    });

    try {
      const db = await openDBConnection();
      const results = await getLogsByClientId(
        props.clientId,
        listState.limit,
        listState.startIndex,
        db,
      );
      debugger;
      if (!results[0].rows.length) {
        return;
      }

      var temp = [];
      for (let i = 0; i < results[0].rows.length; ++i) {
        temp.push(results[0].rows.item(i));
      }

      setListState({
        ...listState,
        startIndex: listState.startIndex + listState.limit,
        data: listState.data.concat(temp),
      });
    } catch (error) {
      console.log(error);
      showToast('DB error to fetch log list');
    }
  };

  const renderItem = ({item}) => {
    return (
      <ListItem
        key={item.id}
        bottomDivider
        onPress={() => {
          alert('press');
        }}>
        <ListItem.Content>
          <ListItem.Title style={{fontSize: 20}}>{item.title}</ListItem.Title>
          <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron size={30} />
      </ListItem>
    );
  };

  const renderEmptyList = () => {
    return (
      <View
        style={{
          marginTop: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 16}}>
          There are no items. Please press New log
        </Text>
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
        refreshLogs();
      },
    });

    return () => {
      navigationEventListener.remove();
    };
  }, [props.componentId]);

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
              data={listState.data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={fetchLogs}
              extraData={listState}
              ListEmptyComponent={renderEmptyList}
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
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showNewLogModal}
              onRequestClose={() => {
                cancelNewLog();
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Input
                    label="Enter log name"
                    placeholder="e.g Leg day"
                    onChangeText={value => {
                      setLogName(value);
                    }}
                  />
                  <View style={styles.row}>
                    <Button
                      title="Save"
                      icon={<EvilIcon name="check" size={30} color="white" />}
                      buttonStyle={{height: 50}}
                      onPress={saveNewLog}
                      containerStyle={{flex: 1, marginRight: 2.5}}
                    />
                    <Button
                      title="Cancel"
                      type="outline"
                      icon={
                        <EvilIcon name="close-o" size={30} color="#d32f2f" />
                      }
                      buttonStyle={{height: 50}}
                      titleStyle={{color: '#d32f2f'}}
                      onPress={cancelNewLog}
                      containerStyle={{flex: 1, marginLeft: 2.5}}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </View>
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

export default ActivitiesList;
