import React, { useCallback, useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import SafeKeyboardView from '../../components/SafeKeyboardView';
import { Share } from 'react-native';
import * as Linking from 'expo-linking';
import { sendNotification } from '../../utils/user_api';
import { Stack } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router/build/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorView } from '../../components';
import { COLORS, SIZES } from '../../constants';
import styles from '../../styles/globalStyles';
import { submitComment, submitArray, getItemById } from '../../utils/user_api';
import { Ionicons as Icon } from '@expo/vector-icons';

let senderID = '';

const AnonDetails = () => {
  const params = useGlobalSearchParams();
  const [data, setData] = useState([]);
  const [isSubmitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState({ comment: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getItemById('mainanons', params.id);
      setData(response.data.data.data);
      setIsLoading(false);
      senderID = response.data.data.data.sender;
    } catch (error) {
      setError(error);
      Alert.alert('Something went wrong.', error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onShare = async () => {
    try {
      const url = Linking.createURL(`mainanon-details/${params.id}`);
      await Share.share({
        message: `Check out this anonymous post on BIOSSA: ${url}`,
        url,
        title: 'BIOSSA - Anonymous Post',
      });
    } catch (error) {
      Alert.alert('Share failed', error.message);
    }
  };

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  const submitMyComment = async () => {
    const myUID = await AsyncStorage.getItem('userUID');
    const localCommentors = data?.commentors;

    if (!localCommentors.includes(myUID)) {
      localCommentors.push(myUID);
    }

    if (commentText.comment == '') {
      return Alert.alert('Error', 'Please fill in a comment');
    }

    setSubmitting(true);

    try {
      await submitArray(
        { commentors: localCommentors },
        `mainanons/${params.id}`
      )
        .then(async () => {
          await submitComment(
            { comment: commentText.comment },
            `mainanons/${params.id}`
          )
            .then((result) => {
              if (result.status == '201') {
                setCommentText({ comment: '' });
                fetchData();
                // notify post sender
                try {
                  sendNotification({
                    to: senderID,
                    type: 'comment',
                    message: `${commentText.comment}`,
                    postId: params.id,
                  });
                } catch (err) {
                  console.warn('notify failed', err.message);
                }
              } else if (result.status == 'fail') {
                Alert.alert(
                  `${result.status.toUpperCase()}`,
                  `${result.message}`
                );
              } else {
                Alert.alert('Somethin went wrong. Please try again later');
              }
            })
            .catch((err) => {
              Alert.alert('Error', err);
            });
        })
        .catch((err) => {
          Alert.alert('Error', err);
        });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitMyReactionLike = async () => {
    const myUID = await AsyncStorage.getItem('userUID');
    const localReactions = data?.reactions;
    localReactions.push(myUID);

    try {
      await submitArray({ reactions: localReactions }, `mainanons/${params.id}`)
        .then((result) => {
          if (result.status == '200') {
            fetchData();
            try {
              sendNotification({
                to: senderID,
                type: 'reaction',
                message: `Someone reacted to your post`,
                postId: params.id,
              });
            } catch (err) {
              console.warn('notify failed', err.message);
            }
          } else if (result.status == 'fail') {
            Alert.alert(`${result.status.toUpperCase()}`, `${result.message}`);
          } else {
            Alert.alert('Somethin went wrong. Please try again later');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitting || isLoading) {
    return (
      <>
        <View style={{ padding: 16 }}>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonLineShort} />
          <View style={styles.skeletonLine} />
        </View>
        <View style={{ padding: 16 }}>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonLineShort} />
          <View style={styles.skeletonLine} />
        </View>
        <View style={{ padding: 16 }}>
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonLineShort} />
          <View style={styles.skeletonLine} />
        </View>
      </>
    );
  }

  return (
    <SafeKeyboardView
      style={{ flex: 1, backgroundColor: data?.color || COLORS.lightWhite }}
    >
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerShadowVisible: false,
          headerBackVisible: true,
          headerTitle: `Message Details`,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          ((<ErrorView msg={'Something went wrong. Please try again'} />),
          Alert.alert('Something went wrong.', error.message))
        ) : data.length === 0 || data == null ? (
          <ErrorView msg={'No Data!!!'} />
        ) : (
          <View style={{ padding: SIZES.medium, paddingBottom: 20 }}>
            <View
              style={{
                backgroundColor: COLORS.lightWhite,
                borderRadius: 20,
                paddingVertical: 15,
              }}
            >
              <View style={styles.textContainer}>
                <Text style={styles.anonName}>{data?.message}</Text>{' '}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.anonComment}>
                    {data.comments.length} Comments
                  </Text>
                  <View style={{ paddingRight: 15 }} />

                  <TouchableOpacity
                    onPress={submitMyReactionLike}
                    style={{
                      paddingRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center',
                      alignSelf: 'center',
                    }}
                  >
                    <Icon name={'heart'} size={20} color={'#355e3b'} />
                  </TouchableOpacity>
                  <Text style={styles.anonLike}>
                    {data.reactions.length} Likes
                  </Text>
                  <View style={{ paddingRight: 15 }} />
                  <Icon name={'time'} size={20} color={'#355e3b'} />
                  <Text
                    style={{
                      alignContent: 'end',
                      alignSelf: 'flex-end',
                      fontSize: 12,
                    }}
                  >
                    {new Date(data?.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                paddingVertical: 10,
                alignContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
              }}
            />
            {error ? (
              <ErrorView msg={'Something went wrong. Please try again'} />
            ) : data?.comments.length === 0 || data == null ? (
              <ErrorView msg={'No Comments!!!'} />
            ) : (
              <FlatList
                data={data?.comments}
                renderItem={({ item }) => (
                  <CommentCard
                    comment={item}
                    index={senderID}
                    commentors={data?.commentors}
                  />
                )}
                keyExtractor={(data) => data?._id}
                contentContainerStyle={{
                  columnGap: SIZES.medium,
                  paddingBottom: 120,
                }}
                vertical
                showsVerticalScrollIndicator={false}
              />
            )}
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.commentsearchcontainer}>
                <View style={styles.commentContainer}>
                  <View style={styles.commentWrapper}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Leave a comment"
                      placeholderTextColor={COLORS.black}
                      value={commentText.comment}
                      onChangeText={(e) => setCommentText({ comment: e })}
                      multiline={true}
                      maxLength={600}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.commentBtnUpload}
                    onPress={submitMyComment}
                  >
                    <Icon name={'send'} size={25} color={'#355e3b'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeKeyboardView>
  );
};

const CommentCard = ({ comment, index, commentors }) => {
  return (
    <View style={styles.container(COLORS.gray2)}>
      <View style={styles.textContainer}>
        <Text style={styles.anonSummary}>
          {comment.sender.id == index
            ? 'Original Poster'
            : `BIOSSAN ${commentors.indexOf(comment.sender.id) + 1}`}
        </Text>
        <Text style={styles.commentName}>{comment?.comment}</Text>

        <Text style={styles.commentComment}>
          🕗
          {new Date(comment?.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export default AnonDetails;
