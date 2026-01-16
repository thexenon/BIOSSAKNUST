import { useEffect } from 'react';
import { View, ScrollView, Text, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import SafeKeyboardView from '../components/SafeKeyboardView';
import { COLORS, images, SIZES } from '../constants';
import styles from '../styles/globalStyles';

const Splash = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await requestPermissions();
      await delay(3000);
      await isUserLoggedIn();
    })();
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const requestPermissions = async () => {
    try {
      /* ================= NOTIFICATIONS ================= */
      const notifPerm = await Notifications.getPermissionsAsync();
      if (notifPerm.status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }

      /* ================= LOCATION (ONLY IF USED) ================= */
      const locPerm = await Location.getForegroundPermissionsAsync();
      if (locPerm.status !== 'granted') {
        await Location.requestForegroundPermissionsAsync();
      }

      /* ================= IMAGE PICKER (UPLOADS) ================= */
      const imgPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (imgPerm.status !== 'granted') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
    } catch (error) {
      Alert.alert(
        'Permission Warning',
        'Some features may not work correctly without permissions.'
      );
    }
  };

  const isUserLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      router.replace(token ? '/home' : '/auth');
    } catch {
      router.replace('/auth');
    }
  };

  return (
    <SafeKeyboardView style={{ backgroundColor: COLORS.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.churchName}>BIOSSA - KNUST</Text>

          <Image
            source={images.biossa}
            style={{ height: 400, width: '100%' }}
            resizeMode="contain"
          />

          <Text style={styles.welcomemsg}>
            Welcome to a family worth belonging to...
          </Text>
          <Text style={styles.welcomemsg}>BIOSSA - Life</Text>
        </View>
      </ScrollView>
    </SafeKeyboardView>
  );
};

export default Splash;
