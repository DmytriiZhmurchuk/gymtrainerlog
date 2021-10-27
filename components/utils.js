import Toast from 'react-native-root-toast';
import {Keyboard} from 'react-native';

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
export const patchKeyboardListener = () => {
  if (!Keyboard.removeListener && 'removeEventListener' in Keyboard) {
    Keyboard.removeListener = Keyboard.removeEventListener;
  }
};
