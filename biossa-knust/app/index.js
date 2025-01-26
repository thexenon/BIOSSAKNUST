import { useState, useEffect } from "react";
import { View, ScrollView, SafeAreaView, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { COLORS, images, SIZES } from "../constants";
import styles from "../styles/globalStyles";

const Splash = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      isUserLoggedIn();
    }, 5000);
  });

  const isUserLoggedIn = async () => {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) {
      router.replace("/auth");
    } else {
      router.replace("/home");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
            alignContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}>
          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.churchName}>BIOSSA - KNUST</Text>

          <Image
            style={{ height: 400, width: "100%", alignSelf: "center" }}
            source={images.biossa}
            resizeMode="contain"
          />

          <Text style={styles.welcomemsg}>
            Welcome to a family worth belonging to...
          </Text>
          <Text style={styles.welcomemsg}>BIOSSA - Life</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Splash;
