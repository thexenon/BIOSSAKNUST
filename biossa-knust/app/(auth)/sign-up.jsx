import { useState } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, images } from "../../constants";
import styles from "../../styles/globalStyles";
import { CustomButton } from "../../components";
import { user_signup } from "../../utils/user_api";
import Icon from "react-native-vector-icons/Ionicons";

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [viewPassword, setViewPassword] = useState(true);
  const [viewPassword2, setViewPassword2] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    name: "",
    phone: "",
    year: "",
  });

  const submit = async () => {
    if (form.name === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      user_signup({
        email: form.email,
        phone: form.phone,
        year: form.year,
        name: form.name,
        password: form.password,
        passseen: form.password,
        passwordConfirm: form.confirmpassword,
      })
        .then(async (result) => {
          if (result.status == 201) {
            await AsyncStorage.setItem("jwt", result?.data.token);
            await AsyncStorage.setItem("userUID", result?.data.data.user.id);
            await AsyncStorage.setItem("year", result?.data.data.user.year);
            Alert.alert("Welcome", `${result?.data.data.user.name}`);
            router.replace("/home");
          } else if (result.status == "fail") {
            Alert.alert(`${result.status.toUpperCase()}`, `${result.message}`);
          } else {
            console.log(result.status);

            Alert.alert("Somethin went wrong. Please try again later");
          }
        })
        .catch((err) => {
          Alert.alert("Error", err.message);
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

          <Text style={styles.welcome}>Sign Up</Text>

          <View style={{ marginBottom: 10 }}>
            <View style={styles.textContainer}>
              <View style={styles.textWrapper}>
                <TextInput
                  inputMode="text"
                  keyboardType="default"
                  style={styles.textInput}
                  value={form.name}
                  onChangeText={(e) => setForm({ ...form, name: e })}
                  placeholder="Fullname"
                  placeholderTextColor={COLORS.black}
                />
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 10 }}>
            <View style={styles.textContainer}>
              <View style={styles.textWrapper}>
                <TextInput
                  inputMode="tel"
                  keyboardType="numeric"
                  style={styles.textInput}
                  value={form.phone}
                  onChangeText={(e) => setForm({ ...form, phone: e })}
                  placeholder="Mobile Number"
                  placeholderTextColor={COLORS.black}
                />
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 10 }}>
            <View style={styles.textContainer}>
              <View style={styles.textWrapper}>
                <TextInput
                  inputMode="text"
                  keyboardType="default"
                  style={styles.textInput}
                  value={form.year}
                  onChangeText={(e) => setForm({ ...form, year: e })}
                  placeholder="Academic Year |(100 - 400)|"
                  placeholderTextColor={COLORS.black}
                />
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 10 }}>
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
          </View>

          <View style={{ marginBottom: 10 }}>
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
          </View>

          <View style={{ marginBottom: 10 }}>
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
                    value={form.confirmpassword}
                    onChangeText={(e) =>
                      setForm({ ...form, confirmpassword: e })
                    }
                    placeholder="Confirm Password"
                    placeholderTextColor={COLORS.black}
                    secureTextEntry={viewPassword2}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setViewPassword2(!viewPassword2)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingRight: 10,
                }}>
                <Icon
                  name={viewPassword2 ? "eye" : "eye-off"}
                  size={20}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>
          </View>
          <CustomButton
            color={"#008000"}
            text="Sign Up"
            handlePress={submit}
            isLoading={isSubmitting}
          />

          <View>
            <Text style={styles.welcomemsg}>Already have an account?</Text>
            <Link style={styles.welcome} href="/sign-in">
              <Text
                style={{ color: "#008000", textDecorationLine: "underline" }}>
                SignIn
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
