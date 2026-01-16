import { Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import styles from '../styles/globalStyles';

const CustomButton = ({ text, handlePress, color, isLoading }) => {
  return (
    <TouchableOpacity
      style={styles.btnBtn(color)}
      onPress={handlePress}
      disabled={isLoading}
    >
      <View style={styles.btnContainer}>
        {isLoading ? (
          <ActivityIndicator animating={isLoading} color="#fff" size="small" />
        ) : (
          <Text style={styles.btnText}>{text}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
