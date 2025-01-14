import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View
      style={{
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        textAlign: "center",
      }}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ height: 30 }}
      />
    </View>
  );
};

const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 60,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="anonmain"
          options={{
            title: "Anon Main",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.eyeHide}
                color={color}
                name="Anon Main"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="anonyeargroup"
          options={{
            title: "Anon TAB",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.eyeHide}
                color={color}
                name="Anon TAB"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
