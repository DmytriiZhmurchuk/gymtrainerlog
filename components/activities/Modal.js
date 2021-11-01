import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

const LogModal = ({isOpen, onCancel, onChangeText, onSave, value}) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={onCancel}>
        <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Input
                  label="Enter log name"
                  placeholder="e.g Leg day"
                  defaultValue={value}
                  onChangeText={onChangeText}
                />
                <View style={styles.row}>
                  <Button
                    title="Save"
                    icon={<EvilIcon name="check" size={30} color="white" />}
                    buttonStyle={{height: 50}}
                    onPress={onSave}
                    containerStyle={{flex: 1, marginRight: 2.5}}
                  />
                  <Button
                    title="Cancel"
                    type="outline"
                    icon={<EvilIcon name="close-o" size={30} color="#d32f2f" />}
                    buttonStyle={{height: 50}}
                    titleStyle={{color: '#d32f2f'}}
                    onPress={onCancel}
                    containerStyle={{flex: 1, marginLeft: 2.5}}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
export default LogModal;
