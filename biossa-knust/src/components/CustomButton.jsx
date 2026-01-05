import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/globalStyles";

const CustomButton = ({ text, handlePress, color, isLoading }) => {
  return (
    <TouchableOpacity
      style={styles.btnBtn(color)}
      onPress={handlePress}
      disabled={isLoading}>
      <View style={styles.btnContainer}>
        <Text style={styles.btnText}>{text}</Text>
        {isLoading ? (
          <ActivityIndicator animating={isLoading} color="#fff" size="small" />
        ) : (
          <Text></Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
