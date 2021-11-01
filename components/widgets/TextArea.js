import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

const TextArea = props => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderColor: '#2196F3',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 100,
  },
});

export default TextArea;
