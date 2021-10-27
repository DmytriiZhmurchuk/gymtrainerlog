import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {AddButton} from '../widgets/buttons';
import {getAllClients, openDBConnection} from '../db';
import {showToast} from '../utils';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ListItem, Avatar, SearchBar} from 'react-native-elements';

const ClientsList = () => {
  const [listState, setListState] = useState({
    data: [],
    limit: 10,
    startIndex: 0,
  });
  const [search, setSearch] = useState();

  const updateSearch = value => {
    setSearch(value);
  };

  const fetchClients = async () => {
    try {
      const db = await openDBConnection();
      const results = await getAllClients(
        db,
        listState.limit,
        listState.startIndex,
      );
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
      showToast('DB error');
    }
  };

  const onModalDismiss = () => {
    fetchClients();
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

  const openClient = () => {
    alert('open');
  };

  const renderItem = ({item}) => {
    return (
      <ListItem key={item.id} bottomDivider onPress={openClient}>
        <Avatar
          rounded
          size="medium"
          icon={{name: 'user', type: 'font-awesome'}}
          onPress={() => console.log('Works!')}
          activeOpacity={0.7}
          overlayContainerStyle={{backgroundColor: '#eeeeee'}}
        />
        <ListItem.Content>
          <ListItem.Title style={{fontSize: 20}}>
            {item.firstName}
          </ListItem.Title>
          <ListItem.Subtitle style={{fontSize: 20}}>
            {item.lastName}
          </ListItem.Subtitle>
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
          There are no items. Please press add new client
        </Text>
      </View>
    );
  };

  useEffect(() => {
    fetchClients();
  }, []);

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
              data={listState.data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={fetchClients}
              extraData={listState}
              ListEmptyComponent={renderEmptyList}
            />
            <View
              style={{paddingHorizontal: 10, marginBottom: 50, marginTop: 10}}>
              <AddButton title={'Add new client'} onPress={showAddNewClient} />
            </View>
          </View>
        </View>
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
