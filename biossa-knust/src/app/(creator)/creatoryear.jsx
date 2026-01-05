import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants';
import styles from '../../styles/globalStyles';
import { ErrorView } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getItems, deleteItems } from '../../utils/user_api';

const CreatorYearAnon = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const yearly = await AsyncStorage.getItem('year');
      const response = await getItems('yearanons');
      setData(response.data.data.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      Alert.alert('Something went wrong.', `${error.message}`);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const deleteitem = async (item) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          onPress: () => Alert.alert('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await deleteItems(`yearanons/${item}`);
              setIsLoading(false);
              Alert.alert('Success', response.data.message);
              refetch();
            } catch (error) {
              setIsLoading(false);
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter((item) =>
    item.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView
      style={{ flex: 1, marginTop: 20, marginBottom: 30, paddingBottom: 30 }}
    >
      <View>
        <View style={styles.searchcontainer}>
          <View>
            <Text style={styles.searchwelcomeMessage}>
              Creator Year Anonymous Page
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
          style={{ marginBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.homecontainer}>
            <View style={styles.homeheader}>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                }}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Icon name={'comments'} size={20} color={'#355e3b'} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginHorizontal: 10,
                  }}
                >
                  All Messages
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push('/createanon/year');
                }}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Icon name={'plus-square'} size={20} color={'#355e3b'} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginHorizontal: 10,
                  }}
                >
                  Add New Message
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.homecardsContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : error ? (
                ((<ErrorView msg={'Something went wrong. Please try again'} />),
                Alert.alert('Something went wrong.', error.message))
              ) : data.length === 0 || data == null ? (
                <ErrorView msg={'No Messages!!!'} />
              ) : (
                <FlatList
                  data={filteredData}
                  renderItem={({ item }) => (
                    <MainAnonCard
                      handleNavigate={() => {
                        router.push(`/yearanon-details/${item._id}`);
                      }}
                      yearanon={item}
                      handleDelete={() => deleteitem(item._id)}
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

const MainAnonCard = React.memo(
  ({ yearanon, handleNavigate, handleDelete }) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={styles.delcontainer(yearanon?.color)}
          onPress={() => handleNavigate()}
        >
          <View style={styles.textContainer}>
            <Text style={styles.anonName}>{yearanon?.message}</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              <Text style={styles.anonComment}>
                {yearanon.comments.length} Comments
              </Text>
              <View style={{ paddingRight: 15 }} />

              <Icon name={'heart'} size={20} color={'#355e3b'} />
              <View style={{ paddingRight: 2 }} />
              <Text style={styles.anonLike}>
                {yearanon.reactions.length} Likes
              </Text>
              <View style={{ paddingRight: 15 }} />
              <Text
                style={{
                  alignContent: 'end',
                  alignSelf: 'flex-end',
                  fontSize: 10,
                }}
              >
                🕗
                {new Date(yearanon?.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete()}
          style={{
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            textAlign: 'center',
          }}
        >
          <Icon name={'trash'} size={40} color={'#ff0000'} />
        </TouchableOpacity>
      </View>
    );
  }
);

export default CreatorYearAnon;
