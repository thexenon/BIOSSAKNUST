import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiManager from './ApiManager';

export async function registerForPushNotificationsAsync(userToken) {
  let expoPushToken;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for notifications!');
      return;
    }
    expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem('expoPushToken', expoPushToken);
    // Send token to backend
    if (userToken && expoPushToken) {
      await ApiManager('/api/v1/users/updateMe', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        data: { expoPushToken },
      });
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return expoPushToken;
}

export function setupNotificationListeners(onNotification, onResponse) {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const playSound = notification?.request?.content?.data?.playSound;
      return {
        shouldShowAlert: true,
        shouldPlaySound: playSound !== false,
        shouldSetBadge: true,
      };
    },
  });
  const sub1 = Notifications.addNotificationReceivedListener(onNotification);
  const sub2 =
    Notifications.addNotificationResponseReceivedListener(onResponse);
  return () => {
    sub1.remove();
    sub2.remove();
  };
}
