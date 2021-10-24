import React from 'react';
import {Text} from 'react-native';

import Icon from 'react-native-vector-icons/EvilIcons';
const AddButton = ({title, onPress}) => {
  return (
    <Icon.Button
      name="plus"
      size={50}
      backgroundColor="#2196F3"
      onPress={onPress}>
      <Text
        style={{
          fontSize: 20,
          color: 'white',
          fontWeight: '600',
          paddingRight: 20,
        }}>
        {title}
      </Text>
    </Icon.Button>
  );
};

export default AddButton;
