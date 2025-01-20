import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { user_login } from "../../utils/user_api";
import { COLORS, images } from "../../constants";
import { CustomButton } from "../../components";
import styles from "../../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [viewPassword, setViewPassword] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email == "" || form.password == "") {
      return Alert.alert("Error", "Please fill in all fields");
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
            setSubmitting(false);
          } else {
            Alert.alert("Somethin went wrong. Please try again later");
            setSubmitting(false);
          }
        })
        .catch((err) => {
          Alert.alert("Error", err);
          setSubmitting(false);
        });
    } catch (error) {
      Alert.alert("Error", error.message);
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
            source={images.biossa}
            resizeMode="contain"
          />

          <Text style={styles.welcome}>Sign In</Text>
          <View>
            {isSubmitting ? (
              <ActivityIndicator size="60" color={COLORS.primary} />
            ) : (
              <View>
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

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginHorizontal: 15,
                    backgroundColor: COLORS.gray2,
                    borderRadius: 15,
                  }}>
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
                        secureTextEntry={viewPassword}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setViewPassword(!viewPassword)}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingRight: 10,
                    }}>
                    <Icon
                      name={viewPassword ? "eye" : "eye-off"}
                      size={20}
                      color={COLORS.black}
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  <Link
                    style={(styles.welcomemsg, styles.welcome)}
                    href="/forgot-password">
                    <Text>Forgot password</Text>
                  </Link>
                </View>

                <CustomButton
                  color={"#008000"}
                  text="Sign In"
                  handlePress={() => {
                    setSubmitting(true);
                    submit();
                  }}
                />

                <View>
                  <Text style={styles.welcomemsg}>
                    If you don't have an account?
                  </Text>
                  <Link
                    style={(styles.welcomemsg, styles.welcome)}
                    href="/sign-up">
                    <Text
                      style={{
                        color: "#008000",
                        textDecorationLine: "underline",
                      }}>
                      SignUp
                    </Text>
                  </Link>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
