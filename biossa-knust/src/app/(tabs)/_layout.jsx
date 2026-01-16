import { StatusBar } from 'expo-status-bar';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '../../constants';

const TabIcon = ({ icon, color, focused }) => {
  return (
    <View
      style={{
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center',
      }}
    >
      <Icon
        name={icon}
        size={20}
        color={focused ? color : '#B7C8B0'}
        resizeMode="contain"
      />
    </View>
  );
};

const TabLayout = () => {
  return (
    <>
      <StatusBar
        backgroundColor={COLORS.primary}
        translucent={true}
        animated={true}
        barStyle={'dark-content'}
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarShowLabel: true,
          headerStyle: { backgroundColor: COLORS.primary },
          headerBackButtonDisplayMode: 'minimal',
          tabBarStyle: {
            position: 'absolute',
            bottom: 30,
            left: 16,
            right: 16,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            backgroundColor: COLORS.primary,
            borderRadius: 18,
            borderTopWidth: 0,
            height: 64,
            paddingBottom: Platform.OS === 'android' ? 8 : 14,
            marginHorizontal: 20,
          },
          popToTopOnBlur: true,
        }}
        backBehavior="order"
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={focused ? 'home' : 'home-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="anonmain"
          options={{
            title: 'Main Anon',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={focused ? 'account-group' : 'account-group-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="anonyeargroup"
          options={{
            title: 'Class Anon',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={focused ? 'account-group' : 'account-group-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="slides"
          options={{
            title: 'Slides',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={'book-open-variant'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="chats"
          options={{
            href: null,
            title: 'Chats',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={focused ? 'robot' : 'robot-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={focused ? 'account-box' : 'account-box-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
