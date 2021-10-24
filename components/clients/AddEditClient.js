import React from 'react';
import {View, Text, TextInput, SafeAreaView, StyleSheet} from 'react-native';
import {ButtonPrimary} from '../buttons';
const AddEditClient = () => {
  return (
    <SafeAreaView>
      <View>
        <View>
          <TextInput placeholder="First name" />
        </View>
        <View>
          <TextInput placeholder="Last name" />
        </View>
        <View>
          <TextInput
            placeholder="Additional Notes"
            multiline={true}
            numberOfLines={10}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addNew: {
    marginTop: 60,
  },
});

export default AddEditClient;
