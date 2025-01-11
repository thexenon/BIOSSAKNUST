import { useState, useEffect } from "react";
import { View, ScrollView, SafeAreaView, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, images, SIZES } from "../constants";
import styles from "../styles/globalStyles";

const Splash = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.replace("/home");
    }, 10000);
  });

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
            style={{ height: 300, width: "100%", alignSelf: "center" }}
            source={images.logo}
            resizeMode="contain"
          />

          <Text style={styles.welcome}>Powered by</Text>
          <Text style={styles.churchName}>OPTYXENON GROUPS</Text>

          <Image
            style={{ height: 300, width: "100%", alignSelf: "center" }}
            source={images.optyxenon}
            resizeMode="contain"
          />

          <Text style={styles.welcomemsg}>
            We are glad that you are joining us
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Splash;
