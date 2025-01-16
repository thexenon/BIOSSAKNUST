import React, { useState, useRef, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import styles from "../../styles/globalStyles";
import { ErrorView } from "../../components";
import { COLORS } from "../../constants";

const Slides = () => {
  const webViewRef = useRef();
  const [isLoadong, setLoading] = useState(false);

  const handleBackButtonPress = () => {
    try {
      webViewRef.current?.goBack();
    } catch (err) {
      console.log("[handleBackButtonPress] Error : ", err.message);
    }

    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonPress);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonPress
      );
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeSpace}>
      <ScrollView>
        <View>
          <WebView
            scrollEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            renderLoading={() => (
              <ActivityIndicator size="large" color={COLORS.primary} />
            )}
            setBuiltInZoomControls={true}
            onError={() => <ErrorView msg={"Load failed"} />}
            source={{
              uri: "https://drive.google.com/drive/folders/1vDugpS7NU4O5Yfz9dnatBSRLAtmnh5bI",
            }}
            ref={webViewRef}
            style={{ height: 830 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Slides;
