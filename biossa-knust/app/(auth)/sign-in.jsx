import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, Image, TextInput } from "react-native";
import { user_login } from "../../utils/user_api";
import { COLORS, images } from "../../constants";
import { CustomButton } from "../../components";
import styles from "../../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email == "" || form.password == "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      user_login({ email: form.email, password: form.password })
        .then(async (result) => {
          if (result.status == "200") {
            await AsyncStorage.setItem("jwt", result?.data.token);
            await AsyncStorage.setItem("userUID", result?.data.data.user.id);
            await AsyncStorage.setItem("year", result?.data.data.user.year);
            Alert.alert("Welcome", `${result?.data.data.user.name}`);
            router.replace("/home");
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
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

          <Text style={styles.welcome}>Sign In</Text>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.textContainer}>
              <View style={styles.textWrapper}>
                <TextInput
                  inputMode="email"
                  keyboardType="default"
                  style={styles.textInput}
                  value={form.email}
                  onChangeText={(e) =>
                    setForm({ ...form, email: e.toLowerCase() })
                  }
                  placeholder="Email"
                  placeholderTextColor={COLORS.black}
                />
              </View>
            </View>
          </View>

          <View style={styles.textContainer}>
            <View style={styles.textWrapper}>
              <TextInput
                inputMode="text"
                keyboardType="default"
                style={styles.textInput}
                value={form.password}
                onChangeText={(e) => setForm({ ...form, password: e })}
                placeholder="Password"
                placeholderTextColor={COLORS.black}
                secureTextEntry={true}
              />
            </View>
          </View>

          {/* <View>
            <Link
              style={(styles.welcomemsg, styles.welcome)}
              href="/forgot-password">
              <Text>Forgot password</Text>
            </Link>
          </View> */}

          <CustomButton
            color={"#008000"}
            text="Sign In"
            handlePress={submit}
            isLoading={isSubmitting}
          />

          <View>
            <Text style={styles.welcomemsg}>Don't have an account?</Text>
            <Link style={(styles.welcomemsg, styles.welcome)} href="/sign-up">
              <Text>Signup</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
