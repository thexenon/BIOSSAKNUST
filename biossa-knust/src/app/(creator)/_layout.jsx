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
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="creatormain"
          options={{
            title: 'Creator Main',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={'eye'} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="creatoryear"
          options={{
            title: 'Creator Year',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={'eye'} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="adminsyear"
          options={{
            title: 'Admin Year',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={'eye'} color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
