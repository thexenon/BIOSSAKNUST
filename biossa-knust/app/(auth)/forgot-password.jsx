import { useState } from "react";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, Image, TextInput } from "react-native";

import { COLORS, icons, images } from "../../constants";
import { CustomButton, ScreenHeaderBtn } from "../../components";
import styles from "../../styles/globalStyles";

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // const submit = async () => {
  //   if (form.email === "" || form.password === "") {
  //     Alert.alert("Error", "Please fill in all fields");
  //   }

  //   setSubmitting(true);

  //   try {
  //     Alert.alert("Success", "User signed in successfully");
  //     router.replace("/home");
  //   } catch (error) {
  //     Alert.alert("Error", error.message);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.gray }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              handlePress={() => router.back()}
              dimension="50%"
            />
          ),
          headerTitle: "Forgot Password",
        }}
      />
      <ScrollView>
        <View>
          <Image
            style={{
              height: 200,
              width: 200,
              alignSelf: "center",
              marginTop: 40,
            }}
            source={images.logo}
            resizeMode="contain"
          />

          <Text style={styles.welcome}>Forgot Password</Text>

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

          {/* <CustomButton
            color={"#213555"}
            text="Forget Password"
            handlePress={submit}
            isLoading={isSubmitting}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
