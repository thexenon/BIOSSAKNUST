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

const link = "https://biossaknust.onrender.com";

const AnonChats = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const options = {
    method: "GET",
    url: `${link}/api/v1/mainanons/`,
  };

  const fetchData = async () => {
    setIsLoading(true);

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
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <View style={styles.searchcontainer}>
          <View>
            <Text style={styles.searchwelcomeMessage}>
              This is General BIOSSA Anonymous Page
            </Text>
          </View>
          <View style={styles.searchsearchContainer}>
            <View style={styles.searchsearchWrapper}>
              <TextInput
                style={styles.searchsearchInput}
                placeholder="Search Scriptures"
                placeholderTextColor={COLORS.black}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
            </View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.homecontainer}>
            <View style={styles.homeheader}>
              <Text style={styles.homeheaderTitle}>All Messages</Text>
              <TouchableOpacity
                onPress={() => {
                  onRefresh();
                }}>
                <Text style={styles.homeheaderBtn}>Refresh</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                }}>
                <Text style={styles.homeheaderBtn}>Show All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push("/createanon/main");
                }}>
                <Text style={styles.homeheaderTitle}>Add New</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.homecardsContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : error ? (
                ((<ErrorView msg={"Something went wrong. Please try again"} />),
                Alert.alert("Something went wrong.", error.message))
              ) : data.length === 0 || data == null ? (
                <ErrorView msg={"No Data!!!"} />
              ) : (
                <FlatList
                  data={filteredData}
                  renderItem={({ item }) => (
                    <MainAnonCard
                      handleNavigate={() => {
                        router.push(`/mainanon-details/${item._id}`);
                      }}
                      mainanon={item}
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

const MainAnonCard = React.memo(({ mainanon, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => handleNavigate()}>
      <View style={styles.textContainer}>
        <Text style={styles.anonName}>{mainanon?.message}</Text>
        <Text style={styles.anonComment}>
          Comments: {mainanon.comments.length}
        </Text>
        <Text style={styles.anonLike}>Likes: {mainanon.reactions.length}</Text>{" "}
        <Text style={styles.commentComment}>
          Posted at: {mainanon?.createdAt.split("T").join(" ")}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default AnonChats;
