import React from 'react';
import {Text} from 'react-native';

import Icon from 'react-native-vector-icons/EvilIcons';
const CancelButton = ({title, onPress}) => {
  return (
    <Icon.Button
      name="close-o"
      size={40}
      backgroundColor="white"
      style={{
        borderColor: '#d32f2f',
        borderWidth: 1,
      }}
      iconStyle={{color: '#d32f2f'}}
      onPress={onPress}>
      <Text
        style={{
          fontSize: 20,
          color: '#d32f2f',
          fontWeight: '600',
          paddingRight: 20,
        }}>
        {title || 'Cancel'}
      </Text>
    </Icon.Button>
  );
};

export default CancelButton;
