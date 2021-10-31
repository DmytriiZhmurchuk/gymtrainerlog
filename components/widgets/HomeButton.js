import React from 'react';
import {Icon} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';

const NavigationHomeButton = props => {
  const onPress = () => {
    Navigation.popToRoot(props.id);
  };
  return (
    <Icon
      size={20}
      name="home"
      type="font-awesome"
      color="white"
      onPress={onPress}
    />
  );
};

export default NavigationHomeButton;
