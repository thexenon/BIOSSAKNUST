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

const AnonChats = () => {
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
              uri: "https://thexenon.github.io/KYCM/BIOSSA/index.html",
            }}
            style={{ minHeight: 250 }}
          />
          <WebView
            scrollEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator size="large" color={COLORS.primary} />
            )}
            setBuiltInZoomControls={true}
            onError={() => <ErrorView msg={"Load failed"} />}
            source={{
              uri: "https://thexenon.github.io/KYCM/BIOSSA/results.html",
            }}
            style={{ minHeight: 500 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnonChats;