import { useCallback, useState, useEffect } from "react";
import React from "react";

import axios from "axios";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Alert,
  TextInput,
  SafeAreaView,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import styles from "../../styles/globalStyles";
import { ErrorView } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";

const link = "https://biossaknust.onrender.com";
const year = AsyncStorage.getItem("year");

const AnonChats = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    const yearly = await AsyncStorage.getItem("year");
    const options = {
      method: "GET",
      url: `${link}/api/v1/yearanons/?year=${yearly}`,
    };
    try {
      const response = await axios.request(options);
      setData(response.data.data.data);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((item) =>
    item.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView
      style={{ flex: 1, marginTop: 20, marginBottom: 30, paddingBottom: 30 }}>
      <View>
        <View style={styles.searchcontainer}>
          <View>
            <Text style={styles.searchwelcomeMessage}>
              Level {year} Anonymous Page
            </Text>
          </View>
          <View style={styles.searchsearchContainer}>
            <View style={styles.searchsearchWrapper}>
              <TextInput
                style={styles.searchsearchInput}
                placeholder="Search Messages"
                placeholderTextColor={COLORS.black}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
            </View>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 120 }}>
          <View style={styles.homecontainer}>
            <View style={styles.homeheader}>
              <TouchableOpacity
                onPress={() => {
                  onRefresh();
                }}>
                <Icon name={"undo"} size={20} color={"#355e3b"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                }}>
                <Icon name={"comments"} size={20} color={"#355e3b"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push("/createanon/year");
                }}>
                <Icon name={"plus-square"} size={20} color={"#355e3b"} />
              </TouchableOpacity>
            </View>

            <View style={styles.homecardsContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : error ? (
                ((<ErrorView msg={"Something went wrong. Please try again"} />),
                Alert.alert("Something went wrong.", error.message))
              ) : data.length === 0 || data == null ? (
                <ErrorView msg={"No Messages!!!"} />
              ) : (
                <FlatList
                  data={filteredData}
                  renderItem={({ item }) => (
                    <MainAnonCard
                      handleNavigate={() => {
                        router.push(`/yearanon-details/${item._id}`);
                      }}
                      yearanon={item}
                    />
                  )}
                  keyExtractor={(data) => data?._id}
                  contentContainerStyle={{ columnGap: SIZES.medium }}
                  vertical
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const MainAnonCard = React.memo(({ yearanon, handleNavigate }) => {
  return (
    <TouchableOpacity
      style={styles.container(yearanon?.color)}
      onPress={() => handleNavigate()}>
      <View style={styles.textContainer}>
        <Text style={styles.anonName}>{yearanon?.message}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 10,
          }}>
          <Text style={styles.anonComment}>
            {yearanon.comments.length} Comments
          </Text>
          <View style={{ paddingRight: 15 }} />

          <Icon name={"heart"} size={20} color={"#355e3b"} />
          <View style={{ paddingRight: 2 }} />
          <Text style={styles.anonLike}>{yearanon.reactions.length} Likes</Text>
          <View style={{ paddingRight: 15 }} />
          <Text
            style={{
              alignContent: "end",
              alignSelf: "flex-end",
              fontSize: 10,
            }}>
            🕗
            {yearanon?.createdAt.split("T")[0]}
            {"   "}
            {yearanon?.createdAt.split("T")[1].split(".")[0]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default AnonChats;
