import { useState } from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import SafeKeyboardView from '../../components/SafeKeyboardView';
import { COLORS, images, SIZES } from '../../constants';
import CustomButton from '../../components/CustomButton';
import styles from '../../styles/globalStyles';

const Auth = () => {
  const router = useRouter();
  return (
    <SafeKeyboardView style={{ flex: 1, backgroundColor: COLORS.gray }}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.medium }}>
          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.churchName}>
            Biological Sciences Students's Association, BIOSSA - KNUST
          </Text>

          <Image
            style={{ height: 200, width: 200, alignSelf: 'center' }}
            source={images.biossa}
            resizeMode="contain"
          />

          <Text style={styles.welcomemsg}>
            Sign-in or Sign-up if you don't have an account to join our
            Wonderful family
          </Text>

          <CustomButton
            text={'Sign In'}
            color={'#213555'}
            handlePress={() => {
              router.push('/(auth)/sign-in');
            }}
          />

          <CustomButton
            text={'Sign Up'}
            color={'#3e5879'}
            handlePress={() => {
              router.push('/(auth)/sign-up');
            }}
          />
        </View>
      </ScrollView>
    </SafeKeyboardView>
  );
};

export default Auth;
