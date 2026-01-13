import { StatusBar } from 'expo-status-bar';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
        color={focused ? color : '#355e3b'}
        resizeMode="contain"
      />
    </View>
  );
};

const TabLayout = () => {
  return (
    <>
      <StatusBar
        backgroundColor="#05f805ff"
        translucent={true}
        animated={true}
        barStyle={'dark-content'}
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarShowLabel: true,
          headerBackButtonDisplayMode: 'minimal',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 60,
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
              <TabIcon icon={'home'} color={color} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="anonmain"
          options={{
            title: 'Main Anon',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={'eye-slash'} color={color} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="anonyeargroup"
          options={{
            title: 'Class Anon',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={'eye-slash'} color={color} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="slides"
          options={{
            title: 'Slides',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={'book'} color={color} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chats',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={'robot'} color={color} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={'address-card'} color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
