import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {
  getAllClients,
  openDBConnection,
  searchClients,
  removeClient,
} from '../db';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ListItem, Avatar, SearchBar, Button} from 'react-native-elements';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import DeleteModal from '../widgets/DeleteModal';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ClientsList = props => {
  const [listState, setListState] = useState({
    data: [],
    limit: 10,
    startIndex: 0,
  });
  const [search, setSearch] = useState();
  const [isRefresh, setIsRefresh] = useState(false);
  const [clientId, setClientId] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const onCancelDelete = () => {
    setClientId(null);
    setShowDeleteModal(false);
  };

  const onRemove = async () => {
    try {
      const db = await openDBConnection();
      await removeClient(clientId, db);
      setShowDeleteModal(false);
      showToast('Removed succesfully');
      resetClientList();
    } catch (error) {
      setClientId(null);
      setShowDeleteModal(false);
      showToast('Failed to remove client');
    }
  };

  const onDeletePress = id => {
    setClientId(id);
    setShowDeleteModal(true);
  };

  const updateSearch = value => {
    setSearch(value);
  };

  const doSearch = async () => {
    try {
      const db = await openDBConnection();
      const {data} = await searchClients(search, db);

      setListState({
        ...listState,
        data: data,
      });
    } catch (error) {
      showToast('DB error');
    }
  };

  const fetchClients = async () => {
    try {
      const db = await openDBConnection();
      const {data, count} = await getAllClients(
        db,
        listState.limit,
        listState.startIndex,
        search,
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

  const resetClientList = async () => {
    try {
      setSearch(undefined);

      const db = await openDBConnection();
      const {data, count} = await getAllClients(db, listState.limit, 0);

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

  const onModalDismiss = () => {
    if (!search) {
      resetClientList();
    }
  };

  const showAddNewClient = () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'com.gymtrainerlog.clients.AddClient',
              passProps: {onModalDismiss},
              options: {
                topBar: {
                  title: {
                    text: 'Add new client',
                  },
                },
              },
            },
          },
        ],
      },
    });
  };

  const openClient = id => {
    Navigation.push(props.componentId, {
      component: {
        name: 'com.gymtrainerlog.clients.EditClient',
        passProps: {clientId: id},
        options: {
          topBar: {
            title: {
              text: 'Edit client',
            },
          },
        },
      },
    });
  };

  const openLogs = id => {
    Navigation.push(props.componentId, {
      component: {
        name: 'com.gymtrainerlog.ActivitiesList',
        passProps: {clientId: id},
        options: {
          topBar: {
            title: {
              text: 'Client activity',
            },
          },
        },
      },
    });
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
          onDeletePress(item.id);
        }}
        onPress={() => {
          openLogs(item.id);
        }}>
        <Avatar
          rounded
          size="small"
          icon={{name: 'user', type: 'font-awesome'}}
          onPress={() => {
            openClient(item.id);
          }}
          activeOpacity={0.7}
          overlayContainerStyle={{backgroundColor: '#eeeeee'}}
        />
        <ListItem.Content>
          <ListItem.Title>{item.firstName}</ListItem.Title>
          <ListItem.Subtitle>{item.lastName}</ListItem.Subtitle>
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
        <Text style={{fontSize: 16}}>Please press add new client</Text>
      </View>
    );
  };

  useEffect(() => {
    resetClientList();
    setIsFetched(true);

    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons: [],
      },
    });

    const screenEventListener =
      Navigation.events().registerComponentDidAppearListener(
        ({componentId, componentName}) => {
          if (componentName === 'com.gymtrainerlog.HomeScreen' && !isFetched) {
            resetClientList();
          }
        },
      );

    return () => {
      screenEventListener.remove();
    };
  }, [props.componentId]);

  useEffect(() => {
    if (search === undefined) {
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      if (search === '') {
        resetClientList();
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
          <View style={{marginTop: 10}}>
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
              onEndReached={info => {
                if (info.distanceFromEnd > 0 && !search) {
                  fetchClients();
                }
              }}
              extraData={listState}
              ListEmptyComponent={renderEmptyList}
              onRefresh={() => {
                setIsRefresh(true);
                resetClientList();
              }}
              refreshing={isRefresh}
            />
            <View
              style={{paddingHorizontal: 10, marginBottom: 10, marginTop: 10}}>
              <Button
                title="Add new client"
                icon={<EvilIcon name="plus" size={30} color="white" />}
                buttonStyle={{height: 50}}
                onPress={showAddNewClient}
              />
            </View>
          </View>
        </View>
        <DeleteModal
          isOpen={showDeleteModal}
          onDelete={onRemove}
          onCancel={onCancelDelete}
        />
      </RootSiblingParent>
    </SafeAreaProvider>
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

export default ClientsList;
