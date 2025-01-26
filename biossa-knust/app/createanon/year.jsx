import {
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { CustomButton } from "../../components";
import { COLORS, SIZES } from "../../constants";
import { submitPost } from "../../utils/user_api";

const CreateYear = () => {
  const router = useRouter();
  const [messageText, setMessageText] = useState({ message: "" });
  const [mycolor, setColor] = useState("#00ff22");
  const [showPicker, setShowPicker] = useState(false);

  const submitMyPost = async () => {
    if (messageText.message == "") {
      return Alert.alert("Error", "Please fill in a message");
    }

    try {
      await submitPost(
        { message: messageText.message, color: mycolor },
        `yearanons`
      )
        .then((result) => {
          if (result.status == "201") {
            Alert.alert("Success", "Post Submitted");
            router.back();
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
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#355e3b" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: true,
          headerTitle: `Create new class Anonymous post`,
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 40 }}>
          <View style={{ padding: SIZES.medium }}>
            <View style={{ marginBottom: 10, top: 50 }}>
              <CustomButton
                color={"#023020"}
                text={"Post message"}
                handlePress={submitMyPost}
              />
              <View
                style={{
                  backgroundColor: COLORS.gray2,
                  margin: SIZES.small,
                  borderRadius: SIZES.medium,
                }}>
                <View>
                  <TextInput
                    style={{
                      minHeight: 200,
                      fontSize: SIZES.large,
                      padding: 10,
                      textAlign: "left",
                    }}
                    inputMode="text"
                    keyboardType="default"
                    value={messageText}
                    onChangeText={(e) => setMessageText({ message: e })}
                    placeholder="Enter a message to post"
                    placeholderTextColor={COLORS.black}
                    multiline={true}
                  />
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  padding: 20,
                  marginVertical: 20,
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}>
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                  Select a Background Color for your Post or the default will be
                  used:
                </Text>

                <TouchableOpacity
                  onPress={() => setShowPicker(!showPicker)}
                  style={{ marginVertical: 10 }}>
                  <View
                    style={{
                      width: 300,
                      height: 70,
                      backgroundColor: mycolor,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Text
                      style={{
                        color: "#000",
                        fontWeight: "bold",
                        fontSize: 20,
                      }}>
                      Pick Color
                    </Text>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    flex: 1,
                    padding: 10,
                    marginVertical: 10,
                    width: "100%",
                    minHeight: 500,
                  }}>
                  {showPicker && (
                    <ColorPicker
                      color={mycolor}
                      onColorChangeComplete={(color) => setColor(color)}
                      onColorChange={(color) => setColor(color)}
                      palette={[
                        "#888888",
                        "#ed1c24",
                        "#d11cd5",
                        "#1633e6",
                        "#00aeef",
                        "#ffde17",
                        "#f26522",
                      ]}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    </SafeAreaView>
  );
};

export default CreateYear;
