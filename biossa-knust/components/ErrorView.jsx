import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images, COLORS, SIZES, FONT } from "../constants";

const ErrorView = ({ msg }) => {
  return (
    <View style={{ alignItems: "center", alignContent: "center" }}>
      <Image
        source={images.empty}
        resizeMode="cover"
        style={{ height: 300, width: "80%", alignSelf: "center" }}
      />

      <Text
        style={{
          alignSelf: "center",
          fontSize: SIZES.xLarge,
          color: COLORS.black,
          fontFamily: FONT.bold,
          alignItems: "center",
          textAlign: "center",
        }}>
        {msg}
      </Text>
    </View>
  );
};

export default ErrorView;
