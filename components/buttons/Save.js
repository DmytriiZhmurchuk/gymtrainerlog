import React from 'react';
import {Text} from 'react-native';

import Icon from 'react-native-vector-icons/EvilIcons';
const SaveButton = ({title, onPress}) => {
  return (
    <Icon.Button
      name="check"
      size={40}
      backgroundColor="white"
      style={{
        borderColor: '#2196F3',
        borderWidth: 1,
      }}
      iconStyle={{color: '#2196F3'}}
      onPress={onPress}>
      <Text
        style={{
          fontSize: 20,
          color: '#2196F3',
          fontWeight: '600',
          paddingRight: 20,
        }}>
        {title || 'Save'}
      </Text>
    </Icon.Button>
  );
};

export default SaveButton;
