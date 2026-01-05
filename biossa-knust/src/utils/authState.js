import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const router = useRouter();

export const isUserLoggedIn = async () => {
  const token = await AsyncStorage.getItem('jwt');
  if (!token) {
    router.replace('/auth');
  } else {
    router.replace('/home');
  }
};

export const handleLogout = async () => {
  await AsyncStorage.clear().then(() => {
    router.replace('/auth');
  });
};
