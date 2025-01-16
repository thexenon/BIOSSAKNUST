import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import { useCallback, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenHeaderBtn, ErrorView } from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import styles from "../../styles/globalStyles";
import { submitComment, submitReactionLike } from "../../utils/user_api";

const link = "https://biossaknust.onrender.com";

const AnonDetails = () => {
  const router = useRouter();
  const params = useGlobalSearchParams();

  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState({ comment: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const options = {
    method: "GET",
    url: `${link}/api/v1/mainanons/${params.id}`,
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.request(options);
      setData(response.data.data.data);
      console.log(response.data.data.data);
      setIsLoading(false);
      setStatus(response.data.status);
    } catch (error) {
      setError(error);
      Alert.alert("Something went wrong.", error.message);
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

  const submitMyComment = async () => {
    if (commentText.comment == "") {
      Alert.alert("Error", "Please fill in a comment");
    }

    setSubmitting(true);
    if (isSubmitting) {
      return <ActivityIndicator size="large" color={COLORS.primary} />;
    }

    try {
      await submitComment(
        { comment: commentText.comment },
        `mainanons/${params.id}`
      )
        .then((result) => {
          if (result.status == "201") {
            Alert.alert("Success", "Comment Submitted");
          } else if (result.status == "fail") {
            Alert.alert(`${result.status.toUpperCase()}`, `${result.message}`);
          } else {
            Alert.alert("Somethin went wrong. Please try again later");
          }
        })
        .catch((err) => {
          Alert.alert("Error", err);
        });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitMyReactionLike = async () => {
    const myUID = await AsyncStorage.getItem("userUID");
    const localReactions = data?.reactions;
    localReactions.push(myUID);

    try {
      await submitReactionLike(
        { reactions: localReactions },
        `mainanons/${params.id}`
      )
        .then((result) => {
          // console.log(result);
          // console.log(myUID);

          if (result.status == "200") {
            Alert.alert("Success", "Reaction Submitted");
          } else if (result.status == "fail") {
            Alert.alert(`${result.status.toUpperCase()}`, `${result.message}`);
          } else {
            Alert.alert("Somethin went wrong. Please try again later");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerTitle: `Message Details`,
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refetch} />
          }>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            ((<ErrorView msg={"Something went wrong. Please try again"} />),
            Alert.alert("Something went wrong.", error.message))
          ) : data.length === 0 || data == null ? (
            <ErrorView msg={"No Data!!!"} />
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 20 }}>
              <View
                style={{
                  backgroundColor: "#008000",
                  width: "100%",
                  paddingVertical: 10,
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Text style={styles.homeheaderTitle}>Anonymous Message</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.anonMessage}>{data?.message}</Text>{" "}
                <Text style={styles.anonComment}>
                  Comments: {data.comments.length}
                </Text>
                <Text style={styles.anonLike}>
                  Likes: {data.reactions.length}
                </Text>{" "}
                <Text style={styles.commentComment}>
                  Posted at: {data?.createdAt.split("T").join(" ")}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#008000",
                  width: "100%",
                  paddingVertical: 10,
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Text style={styles.homeheaderTitle}>
                  All Comments for this message
                </Text>
              </View>
              {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : error ? (
                <ErrorView msg={"Something went wrong. Please try again"} />
              ) : data?.comments.length === 0 || data == null ? (
                <ErrorView msg={"No Comments!!!"} />
              ) : (
                <FlatList
                  data={data?.comments}
                  renderItem={({ item }) => <CommentCard comment={item} />}
                  keyExtractor={(data) => data?._id}
                  contentContainerStyle={{ columnGap: SIZES.medium }}
                  vertical
                  showsVerticalScrollIndicator={false}
                />
              )}
              <View style={{ flexDirection: "row" }}>
                <View style={styles.searchcontainer}>
                  <View style={styles.commentContainer}>
                    <TouchableOpacity
                      style={styles.commentBtnLike}
                      onPress={submitMyReactionLike}>
                      <Image
                        source={icons.heartOutline}
                        resizeMode="contain"
                        style={styles.commentBtnImage}
                      />
                    </TouchableOpacity>
                    <View style={styles.commentWrapper}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Leave a comment"
                        placeholderTextColor={COLORS.black}
                        value={commentText}
                        onChangeText={(e) => setCommentText({ comment: e })}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.commentBtnUpload}
                      onPress={submitMyComment}>
                      <Image
                        source={icons.upload}
                        resizeMode="contain"
                        style={styles.commentBtnImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </>
    </SafeAreaView>
  );
};

const CommentCard = ({ comment }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.commentName}>{comment?.comment}</Text>

        <Text style={styles.commentComment}>
          Posted at: {comment?.createdAt.split("T").join(" ")}
        </Text>
      </View>
    </View>
  );
};

export default AnonDetails;
