import { View, SafeAreaView, ScrollView, TextInput, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { ScreenHeaderBtn, CustomButton } from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import { submitPost } from "../../utils/user_api";

const CreateMain = () => {
  const router = useRouter();
  const [messageText, setMessageText] = useState({ message: "" });

  const submitMyPost = async () => {
    if (messageText.message == "") {
      Alert.alert("Error", "Please fill in a message");
    }

    try {
      await submitPost({ message: messageText.message }, `mainanons`)
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
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#355e3b" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: true,
          headerTitle: `Create new general Anonymous post`,
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 100 }}>
          <View style={{ padding: SIZES.medium }}>
            <View style={{ marginBottom: 10, minHeight: 400, top: 50 }}>
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
              <CustomButton
                color={"#023020"}
                text={"Post message"}
                handlePress={submitMyPost}
              />
            </View>
          </View>
        </ScrollView>
      </>
    </SafeAreaView>
  );
};

export default CreateMain;
