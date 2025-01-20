import { router } from "expo-router";
import { View, Text } from "react-native";

import { COLORS, SIZES, FONT } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";

const ErrorView = ({ msg }) => {
  return (
    <View style={{ alignItems: "center", alignContent: "center" }}>
      <Icon name="exclamation-triangle" size={100} color={"#023020"} />

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
