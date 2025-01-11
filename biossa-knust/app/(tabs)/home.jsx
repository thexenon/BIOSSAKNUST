import React from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import styles from "../../styles/globalStyles";
import { ErrorView } from "../../components";
import { COLORS } from "../../constants";

const Home = () => {
  return (
    <SafeAreaView style={styles.safeSpace}>
      <ScrollView>
        <View>
          <WebView
            scrollEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator size="large" color={COLORS.primary} />
            )}
            setBuiltInZoomControls={true}
            onError={() => <ErrorView msg={"Load failed"} />}
            source={{
              uri: "https://www.biossaknust.com",
            }}
            style={{ minHeight: 900 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
