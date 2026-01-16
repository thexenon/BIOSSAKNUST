import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { COLORS } from '../constants';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DownloadsProvider } from '../utils/useDownloader';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    DMBold: require('../assets/fonts/DMSans-Bold.ttf'),
    DMMedium: require('../assets/fonts/DMSans-Medium.ttf'),
    DMRegular: require('../assets/fonts/DMSans-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
    (async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (token) await registerForPushNotificationsAsync(token);
      } catch (err) {
        console.warn('Push token registration failed', err.message);
      }
    })();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <DownloadsProvider>
      <SafeAreaProvider>
        <StatusBar
          backgroundColor={COLORS.primary}
          translucent={true}
          animated={true}
          barStyle={'dark-content'}
        />

        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.primary },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false, animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="(admin)"
            options={{ headerShown: false, animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="(creator)"
            options={{ headerShown: false, animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="settings"
            options={{ headerShown: false, animation: 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="index"
            options={{ headerShown: false, animation: 'fade_from_bottom' }}
          />
        </Stack>
      </SafeAreaProvider>
    </DownloadsProvider>
  );
};

export default RootLayout;
