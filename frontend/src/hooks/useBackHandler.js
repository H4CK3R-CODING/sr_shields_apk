import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useBackHandler = (customHandler = null) => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (customHandler) {
        return customHandler();
      }

      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }

      return false; // Let the global handler take care of it
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation, customHandler]);
};
