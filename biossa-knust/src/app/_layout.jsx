import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor="#05f805ff"
        translucent={true}
        animated={true}
        barStyle={'dark-content'}
        hidden={false}
        showHideTransition={'fade'}
      />
      <Stack>
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
  );
};

export default RootLayout;
