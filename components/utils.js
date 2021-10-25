import Toast from 'react-native-root-toast';

export const showToast = text => {
  return Toast.show(text, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
  });
};
