import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import SafeKeyboardView from '../../components/SafeKeyboardView';
import ColorPicker from 'react-native-wheel-color-picker';
import { Stack, useRouter } from 'expo-router';

import { CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants';
import { submitPost } from '../../utils/user_api';

const CreateMain = () => {
  const router = useRouter();

  // -------------------- STATE --------------------
  const [messageText, setMessageText] = useState({ message: '' });
  const [mycolor, setColor] = useState('#00ff22');
  const [showPicker, setShowPicker] = useState(false);

  // -------------------- SUBMIT --------------------
  const submitMyPost = async () => {
    if (!messageText.message.trim()) {
      return Alert.alert('Error', 'Please fill in a message');
    }

    try {
      const result = await submitPost(
        { message: messageText.message, color: mycolor },
        'mainanons'
      );

      if (result?.status === 201) {
        Alert.alert('Success', 'Post Submitted');
        router.back();
      } else {
        Alert.alert('Error', result.message);
      }

      console.log('====================================');
      console.log(result);
      console.log('====================================');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // -------------------- UI --------------------
  return (
    <SafeKeyboardView style={{ flex: 1, backgroundColor: '#355e3b' }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerShadowVisible: false,
          headerBackVisible: true,
          headerTitle: 'Create new General Anonymous post',
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={{ padding: SIZES.medium, marginTop: 40 }}>
          {/* SUBMIT BUTTON */}
          <CustomButton
            color="#023020"
            text="Post message"
            handlePress={submitMyPost}
          />

          {/* MESSAGE INPUT */}
          <View
            style={{
              backgroundColor: COLORS.gray2,
              margin: SIZES.small,
              borderRadius: SIZES.medium,
            }}
          >
            <TextInput
              style={{
                minHeight: 200,
                fontSize: SIZES.large,
                padding: 12,
                textAlignVertical: 'top',
              }}
              value={messageText.message}
              onChangeText={(text) => setMessageText({ message: text })}
              placeholder="Enter a message to post"
              placeholderTextColor={COLORS.black}
              multiline
              maxLength={600}
            />
          </View>

          {/* COLOR PICKER SECTION */}
          <View
            style={{
              alignItems: 'center',
              marginVertical: 20,
            }}
          >
            <Text
              style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}
            >
              Select a background color (optional)
            </Text>

            {/* COLOR PREVIEW */}
            <TouchableOpacity
              onPress={() => setShowPicker((prev) => !prev)}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: 300,
                  height: 70,
                  backgroundColor: mycolor,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                  {showPicker ? 'Close Color Picker' : 'Pick Color'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* COLOR PICKER */}
            <View
              style={{
                width: '100%',
                height: showPicker ? 360 : 0,
                overflow: 'hidden',
                marginTop: 10,
              }}
            >
              <ColorPicker
                color={mycolor}
                onColorChangeComplete={setColor}
                thumbSize={30}
                sliderSize={30}
                noSnap
                row={false}
                wheelLodingIndicator={
                  <ActivityIndicator size="large" color={COLORS.primary} />
                }
                sliderLodingIndicator={
                  <ActivityIndicator size="small" color={COLORS.primary} />
                }
                palette={[
                  '#888888',
                  '#ed1c24',
                  '#d11cd5',
                  '#1633e6',
                  '#00aeef',
                  '#ffde17',
                  '#f26522',
                ]}
              />
            </View>

            {/* SELECTED COLOR */}
            <Text style={{ marginTop: 10 }}>
              Selected color: {mycolor.toUpperCase()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeKeyboardView>
  );
};

export default CreateMain;
