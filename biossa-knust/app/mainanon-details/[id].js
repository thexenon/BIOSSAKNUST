import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import { useCallback, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorView } from "../../components";
import { COLORS, SIZES } from "../../constants";
import styles from "../../styles/globalStyles";
import { submitComment, submitReactionLike } from "../../utils/user_api";
import Icon from "react-native-vector-icons/Ionicons";

const link = "https://biossaknust.onrender.com";
let senderID = "";

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
      setIsLoading(false);
      setStatus(response.data.status);
      senderID = response.data.data.data.sender;
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
      return Alert.alert("Error", "Please fill in a comment");
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
            setCommentText({ comment: "" });
            fetchData();
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
          if (result.status == "200") {
            fetchData();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#355e3b" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: true,
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
                  backgroundColor: COLORS.lightWhite,
                  borderRadius: 20,
                  paddingVertical: 15,
                }}>
                <View style={styles.textContainer}>
                  <Text style={styles.anonName}>{data?.message}</Text>{" "}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      marginTop: 10,
                    }}>
                    <Text style={styles.anonComment}>
                      {data.comments.length} Comments
                    </Text>
                    <View style={{ paddingRight: 15 }} />

                    <TouchableOpacity
                      onPress={submitMyReactionLike}
                      style={{
                        paddingRight: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        alignSelf: "center",
                      }}>
                      <Icon name={"heart"} size={20} color={"#355e3b"} />
                    </TouchableOpacity>
                    <Text style={styles.anonLike}>
                      {data.reactions.length} Likes
                    </Text>
                    <View style={{ paddingRight: 15 }} />
                    <Icon name={"time"} size={20} color={"#355e3b"} />
                    <Text
                      style={{
                        alignContent: "end",
                        alignSelf: "flex-end",
                        fontSize: 12,
                      }}>
                      {"   "}
                      {data?.createdAt.split("T")[0]}
                      {"   "}
                      {data?.createdAt.split("T")[1].split(".")[0]}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  paddingVertical: 10,
                  alignContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                }}
              />
              {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : error ? (
                <ErrorView msg={"Something went wrong. Please try again"} />
              ) : data?.comments.length === 0 || data == null ? (
                <ErrorView msg={"No Comments!!!"} />
              ) : (
                <FlatList
                  data={data?.comments}
                  renderItem={({ item }) => (
                    <CommentCard comment={item} index={senderID} />
                  )}
                  keyExtractor={(data) => data?._id}
                  contentContainerStyle={{ columnGap: SIZES.medium }}
                  vertical
                  showsVerticalScrollIndicator={false}
                />
              )}
              <View style={{ flexDirection: "row" }}>
                <View style={styles.commentsearchcontainer}>
                  <View style={styles.commentContainer}>
                    <View style={styles.commentWrapper}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Leave a comment"
                        placeholderTextColor={COLORS.black}
                        value={commentText}
                        onChangeText={(e) => setCommentText({ comment: e })}
                        multiline={true}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.commentBtnUpload}
                      onPress={submitMyComment}>
                      <Icon name={"send"} size={35} color={"#355e3b"} />
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

const CommentCard = ({ comment, index }) => {
  return (
    <View style={styles.container(COLORS.gray2)}>
      <View style={styles.textContainer}>
        <Text style={styles.anonSummary}>
          {comment.sender.id == index ? "Original Poster" : ""}
        </Text>
        <Text style={styles.commentName}>{comment?.comment}</Text>

        <Text style={styles.commentComment}>
          Posted at:
          {comment?.createdAt.split("T")[0]}
          {"   "}
          {comment?.createdAt.split("T")[1].split(".")[0]}
        </Text>
      </View>
    </View>
  );
};

export default AnonDetails;
