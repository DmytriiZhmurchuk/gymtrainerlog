import React from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import {Button, Text} from 'react-native-elements';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

const DeleteModal = ({isOpen, onCancel, onDelete}) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={onCancel}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{paddingVertical: 10, flex: 1}}>
              <Text h4>Remove?</Text>
            </View>
            <View style={styles.row}>
              <Button
                title="Yes"
                type="outline"
                icon={<EvilIcon name="check" size={30} color="#d32f2f" />}
                buttonStyle={{height: 50}}
                titleStyle={{color: '#d32f2f'}}
                onPress={onDelete}
                containerStyle={{flex: 1, marginRight: 2.5}}
              />
              <Button
                title="No"
                type="outline"
                icon={<EvilIcon name="close-o" size={30} color="#2196F3" />}
                buttonStyle={{height: 50}}
                onPress={onCancel}
                containerStyle={{flex: 1, marginLeft: 2.5}}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    height: 200,
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
export default DeleteModal;
