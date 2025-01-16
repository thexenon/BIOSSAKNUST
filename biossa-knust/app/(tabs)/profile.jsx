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
import { COLORS, SIZES } from "../../constants";
import styles from "../../styles/globalStyles";

const link = "https://biossaknust.onrender.com";

const Profile = () => {
  const router = useRouter();

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refetch} />
          }>
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
            </View>
          )}
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
        <Text style={styles.userName}>About</Text>
        <Text style={styles.userBody}>{currentuser?.description}</Text>
      </View>
    </View>
  );
};
export default Profile;
