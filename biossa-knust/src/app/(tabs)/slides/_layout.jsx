import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../../constants';

const SlidesLayout = () => {
  const myDrawerIcon = ({ name, size, color }) => {
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  };

  return (
    <GestureHandlerRootView>
      <Drawer
        backBehavior="order"
        initialRouteName="index"
        screenOptions={{
          drawerActiveTintColor: COLORS.primary,
          drawerInactiveTintColor: '#666',
          popToTopOnBlur: true,
          drawerStyle: {
            backgroundColor: '#f6f8fa',
            width: 240,
            marginTop: 10,
            paddingVertical: 10,
            borderTopLeftRadius: 18,
            shadowColor: COLORS.gray2,
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 8,
          },
          drawerLabelStyle: {
            fontSize: 16,
            marginBottom: 8,
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Slides',
            title: 'Slides',
            animation: 'fade_from_bottom',
            drawerIcon: ({ color, size }) =>
              myDrawerIcon({
                name: 'book-open-variant',
                size: size + 2,
                color,
              }),
          }}
        />
        <Drawer.Screen
          name="downloads"
          options={{
            drawerLabel: 'My Downloads',
            title: 'My Downloads',
            animation: 'fade_from_bottom',
            drawerIcon: ({ color, size }) =>
              myDrawerIcon({
                name: 'download',
                size: size + 2,
                color,
              }),
          }}
        />
        <Drawer.Screen
          name="documents"
          options={{
            drawerLabel: 'My Documents',
            title: 'My Documents',
            animation: 'fade_from_bottom',
            drawerIcon: ({ color, size }) =>
              myDrawerIcon({
                name: 'file',
                size: size + 2,
                color,
              }),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default SlidesLayout;
