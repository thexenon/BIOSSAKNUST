import { useState } from 'react';
import { router, Stack } from 'expo-router';
import SafeKeyboardView from '../../components/SafeKeyboardView';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import { COLORS, images } from '../../constants';
import { CustomButton } from '../../components';
import { forgotPass } from '../../utils/user_api';
import styles from '../../styles/globalStyles';

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const submit = async () => {
    if (form.email === '') {
      return Alert.alert('Error', 'Please fill in your email');
    }

    setSubmitting(true);
    try {
      forgotPass({ email: form.email })
        .then(async (result) => {
          if (result.status == '200') {
            Alert.alert(
              'Email Sent!',
              `Check your mail for the Forget Password email to change your password`
            );
            router.push('/auth');
          } else if (result.status == 'fail') {
            Alert.alert(`${result.status.toUpperCase()}`, `${result.message}`);
            setSubmitting(false);
          } else {
            Alert.alert('Somethin went wrong. Please try again later');
            setSubmitting(false);
          }
        })
        .catch((err) => {
          Alert.alert('Error', err);
          setSubmitting(false);
        });
    } catch (error) {
      Alert.alert('Error', error.message);
      setSubmitting(false);
    }
  };

  return (
    <SafeKeyboardView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerShadowVisible: false,
          headerBackVisible: true,
          headerTitle: 'Forgot Password',
        }}
      />
      <ScrollView>
        <View>
          <Image
            style={{
              height: 200,
              width: 200,
              alignSelf: 'center',
              marginTop: 40,
            }}
            source={images.biossa}
            resizeMode="contain"
          />

          <Text style={styles.welcome}>Forget Password</Text>

          <View>
            {isSubmitting ? (
              <ActivityIndicator size="60" color={COLORS.primary} />
            ) : (
              <View>
                <View style={styles.textContainer}>
                  <View style={styles.textWrapper}>
                    <TextInput
                      inputMode="email"
                      keyboardType="default"
                      style={styles.textInput}
                      value={form.email}
                      onChangeText={(e) => setForm({ ...form, email: e })}
                      placeholder="Email"
                      placeholderTextColor={COLORS.black}
                    />
                  </View>
                </View>

                <CustomButton
                  color={'#008000'}
                  text="Forget Password"
                  handlePress={submit}
                  isLoading={isSubmitting}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeKeyboardView>
  );
};

export default SignIn;
