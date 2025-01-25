import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from "react-native";
import axios from "axios";
import { Link, useRouter, Stack } from "expo-router";
import { useState, useEffect } from "react";

import { CustomButton, ErrorView } from "../../components";
import { COLORS, SIZES, images, FONT } from "../../constants";
import styles from "../../styles/globalStyles";

const link = "https://biossaknust.onrender.com";

const Profile = () => {
  const router = useRouter();

  // const appUpdate = AsyncStorage.getItem("appUpdate");
  // console.log("====================================");
  // console.log(appUpdate);
  // console.log("====================================");
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const options = {
    method: "GET",
    url: `${link}/api/v1/users/me`,
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.request(options);
      setData(response?.data.data.data);
      setIsLoading(false);
      setStatus(response.data.status);
    } catch (error) {
      setError(error);
      Alert.alert("Something went wrong.", `${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView style={styles.safeSpace}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refetch} />
          }>
          <View
            style={{ alignItems: "center", justifyContent: "center", top: 30 }}>
            <Text
              style={{
                fontSize: SIZES.xxLarge,
                fontFamily: "DMBold",
                color: COLORS.primary,
              }}>
              My Account Details
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            ((<ErrorView msg={"Something went wrong. Please try again"} />),
            Alert.alert("Something went wrong.", `${error.message}`))
          ) : data.length === 0 || data == null ? (
            <ErrorView msg={"No Data!!!"} />
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <View style={styles.homecardsContainer}>
                <UserProfile currentuser={data} />
              </View>

              <Link href={`${link}/me`} style={styles.btnBtnLink}>
                <Text style={styles.btnLinkText}>
                  Edit Details or Change Password
                </Text>
              </Link>
              <CustomButton
                handlePress={async () => {
                  await AsyncStorage.removeItem("userUID");
                  await AsyncStorage.removeItem("year");
                  await AsyncStorage.removeItem("jwt").then(() => {
                    router.replace("auth");
                  });
                }}
                color={"#355e3b"}
                text={"LogOut"}
              />
              {data?.role === "admin" ? (
                <CustomButton
                  color={COLORS.tertiary}
                  text={"Go to Admins Page"}
                  handlePress={() => {
                    router.push("/adminyear");
                  }}
                />
              ) : data?.role === "creator" ? (
                <CustomButton
                  color={COLORS.tertiary}
                  text={"Go to Creator Page"}
                  handlePress={() => {
                    router.push("/creatormain");
                  }}
                />
              ) : data?.role === "superadmin" ? (
                <CustomButton
                  color={COLORS.tertiary}
                  text={"Welcome Xenon"}
                  handlePress={() => {
                    router.push("/headmain");
                  }}
                />
              ) : (
                <View></View>
              )}
              {/* {appUpdate ? (
                <Link
                  href={
                    "https://drive.google.com/drive/folders/1vDugpS7NU4O5Yfz9dnatBSRLAtmnh5bI"
                  }
                  style={{
                    backgroundColor: "#ff0000",
                    alignSelf: "center",
                    borderRadius: 30,
                    width: "85%",
                    paddingVertical: 20,
                    marginVertical: 20,
                  }}>
                  <Text style={styles.btnLinkText}>App Update Available</Text>
                </Link>
              ) : (
                <View></View>
              )} */}
            </View>
          )}
          <View style={{ backgroundColor: "#000", height: "10" }}></View>
          <View style={{ padding: 10 }}>
            <Text
              style={{
                color: "#000",
                alignSelf: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: SIZES.xLarge,
                fontFamily: FONT.bold,
                marginBottom: 20,
                marginTop: 25,
              }}>
              Powered by
            </Text>

            <Image
              style={{
                height: 200,
                width: "100%",
                alignSelf: "center",
                marginVertical: 10,
              }}
              source={images.optyxenon}
              resizeMode="contain"
            />

            <UserCard
              fullname={"Derek Donkor (Xenon)"}
              email={"donkorderek@gmail.com"}
              skill={"Back-End Developer"}
              phone={"+233556585028"}
            />

            <UserCard
              fullname={"Optimus"}
              email={"optimustryumph1@gmail.com"}
              skill={
                "Front-End Developer || Graphic Designer || Project Manager"
              }
            />

            <UserCard
              fullname={"Bright Kumedzro (BK Designs"}
              phone={"+233248765886"}
              email={"kumedzrobright@gmail.com"}
              skill={"Front-End Developer || UI/UX"}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const UserProfile = ({ currentuser }) => {
  return (
    <View>
      <View>
        <Text style={styles.userName}></Text>
        <Text style={styles.userBody}></Text>
      </View>
      <View>
        <Text style={styles.userName}>Role</Text>
        <Text style={styles.userBody}>
          {" "}
          Level {currentuser?.year} {currentuser?.role.toUpperCase()}
        </Text>
      </View>
      <View>
        <Text style={styles.userName}>Name</Text>
        <Text style={styles.userBody}>{currentuser?.name}</Text>
      </View>
      <View>
        <Text style={styles.userName}>Email</Text>
        <Text style={styles.userBody}>{currentuser?.email}</Text>
      </View>
      <View>
        <Text style={styles.userName}>Phone</Text>
        <Text style={styles.userBody}>{currentuser?.phone}</Text>
      </View>
      <View>
        <Text style={styles.userName}>Year / Level</Text>
        <Text style={styles.userBody}>{currentuser?.year}</Text>
      </View>
      <View>
        <Text style={styles.userName}>Verification</Text>
        <Text style={styles.userBody}>
          {currentuser?.isVerifed
            ? "Email Verified ✅"
            : "Email Not Verified ❌"}
        </Text>
      </View>
      <View>
        <Text style={styles.userName}>About</Text>
        <Text style={styles.userBody}>{currentuser?.description}</Text>
      </View>
    </View>
  );
};

const UserCard = ({ fullname, phone, email, skill }) => {
  return (
    <View style={{ padding: 20, backgroundColor: COLORS.lightWhite }}>
      <Text style={styles.userName}>{fullname}</Text>
      <Text style={styles.userBody}>{skill}</Text>
      <Text style={styles.userBody}>{email}</Text>
      <Text style={styles.userBody}>{phone}</Text>
    </View>
  );
};
export default Profile;
