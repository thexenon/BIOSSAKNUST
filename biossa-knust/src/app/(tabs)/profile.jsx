import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, Stack } from 'expo-router';
import { getItems, deleteAccount } from '../../utils/user_api';
import { handleLogout } from '../../utils/authState';
import { CustomButton, ErrorView } from '../../components';
import { COLORS, SIZES, images, FONT } from '../../constants';
import styles from '../../styles/globalStyles';

const Profile = () => {
  const router = useRouter();

  // const appUpdate = AsyncStorage.getItem("appUpdate");
  // console.log("====================================");
  // console.log(appUpdate);
  // console.log("====================================");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getItems('users/me');
      setData(response?.data.data.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      Alert.alert('Something went wrong.', `${error.message}`);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
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

  const logout = () => {
    Alert.alert(
      'Logout Account',
      'Are you sure you want to logout of your Account?',
      [
        {
          text: 'Cancel',
          onPress: () => Alert.alert('Cancelled', 'Account Logout Cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setIsLoading(true);
            try {
              await handleLogout();
              Alert.alert('Success', 'Logout Successful');
            } catch (error) {
              setIsLoading(false);
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const deleteMe = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your Account?\nYou will not be able to create a new account or log in for the next seven days.\nThis action can not be reversed!!!',
      [
        {
          text: 'Cancel',
          onPress: () => Alert.alert('Cancelled', 'Account Deletion Cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await deleteAccount();
              setIsLoading(false);
              Alert.alert('Success', response.data.message);
              await handleLogout();
            } catch (error) {
              setIsLoading(false);
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeSpace, { backgroundColor: COLORS.lightWhite }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{ alignItems: 'center', justifyContent: 'center', top: 30 }}
        >
          <Text
            style={{
              fontSize: SIZES.xxLarge,
              fontFamily: 'DMBold',
              color: COLORS.primary,
            }}
          >
            My Account Details
          </Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          ((<ErrorView msg={'Something went wrong. Please try again'} />),
          Alert.alert('Something went wrong.', `${error.message}`))
        ) : data.length === 0 || data == null ? (
          <ErrorView msg={'No User!!!'} />
        ) : (
          <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
            <View style={styles.homecardsContainer}>
              <UserProfile currentuser={data} />
            </View>
            <CustomButton
              color={COLORS.primary}
              text={'Edit Details or Change Password'}
              handlePress={() => {
                router.push('/settings');
              }}
            />
            <CustomButton
              handlePress={logout}
              color={'#355e3b'}
              text={'LogOut'}
            />
            <CustomButton
              handlePress={deleteMe}
              color={'#ff0000ff'}
              text={'Delete My Account'}
            />
            {data?.role === 'admin' ? (
              <CustomButton
                color={COLORS.tertiary}
                text={'Go to Admins Page'}
                handlePress={() => {
                  router.push('/adminyear');
                }}
              />
            ) : data?.role === 'creator' || data?.role === 'superadmin' ? (
              <CustomButton
                color={COLORS.tertiary}
                text={'Go to Creator Page'}
                handlePress={() => {
                  router.push('/creatormain');
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
        <View
          style={{ backgroundColor: '#000', height: 10, marginVertical: 20 }}
        ></View>
        <View style={{ padding: 10 }}>
          <Text
            style={{
              color: '#000',
              alignSelf: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontSize: SIZES.xLarge,
              fontFamily: FONT.bold,
              marginBottom: 20,
              marginTop: 25,
            }}
          >
            Powered by
          </Text>

          <Image
            style={{
              height: 200,
              width: '100%',
              alignSelf: 'center',
              marginVertical: 10,
            }}
            source={images.optyxenon}
            resizeMode="contain"
          />

          <UserCard
            fullname={'Derek Donkor (DD / Xenon)'}
            email={'donkorderek@gmail.com'}
            skill={'Full-Stack Mobile/Web Developer || Software Lead Engineer'}
            phone={'+233556585028 || +233505389520'}
            github={'thexenon'}
          />

          <UserCard
            fullname={'Optimus'}
            email={'optimustryumph1@gmail.com'}
            skill={
              'Front-End Web Developer || Graphic Designer || Project Manager'
            }
            github={''}
            phone={'+233543634363'}
          />

          <UserCard
            fullname={'Bright Kumedzro (BK Designs All)'}
            phone={'+233248765886'}
            email={'kumedzrobright@gmail.com'}
            skill={
              'Front-End Developer || Graphic Designer || UI/UX || Project/Product Manager'
            }
            github={'bright-kumedzro'}
          />
        </View>
      </ScrollView>
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
          {' '}
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
        <Text style={styles.userBody}>
          {'+233-(0)'}
          {currentuser?.phone}
        </Text>
      </View>
      <View>
        <Text style={styles.userName}>Year / Level</Text>
        <Text style={styles.userBody}>{currentuser?.year}</Text>
      </View>
      <View>
        <Text style={styles.userName}>Verification</Text>
        <Text style={styles.userBody}>
          {currentuser?.isVerified
            ? 'Email Verified ✅'
            : 'Email Not Verified ❌'}
        </Text>
      </View>
      <View>
        <Text style={styles.userName}>About</Text>
        <Text style={styles.userBody}>{currentuser?.description}</Text>
      </View>
    </View>
  );
};

const UserCard = ({ fullname, phone, email, skill, github }) => {
  return (
    <View style={{ padding: 20, backgroundColor: COLORS.lightWhite }}>
      <Text style={styles.userName}>{fullname}</Text>
      <Link style={{ fontSize: 20 }} href={`https://github.com/${github}`}>
        <Text
          style={{
            fontSize: SIZES.large,
            fontFamily: 'DMBold',
            color: COLORS.secondary,
            marginTop: 3,
            marginBottom: 10,
          }}
        >
          Github Profile
        </Text>
      </Link>
      <Text style={styles.userBody}>{skill}</Text>
      <Text style={styles.userBody}>{email}</Text>
      <Text style={styles.userBody}>{phone}</Text>
    </View>
  );
};
export default Profile;
