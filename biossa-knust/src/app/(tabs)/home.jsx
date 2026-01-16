import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, BackHandler, Dimensions } from 'react-native';
import SafeKeyboardView from '../../components/SafeKeyboardView';
import { WebView } from 'react-native-webview';
import styles from '../../styles/globalStyles';
import { ErrorView } from '../../components';
import { COLORS } from '../../constants';

const Home = () => {
  const webViewRef = useRef();
  const [isLoadong, setLoading] = useState(false);

  const handleBackButtonPress = () => {
    try {
      webViewRef.current?.goBack();
    } catch (err) {
      console.log('[handleBackButtonPress] Error : ', err.message);
    }

    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress
      );
    };
  }, []);

  return (
    <SafeKeyboardView>
      <ScrollView>
        <View>
          <WebView
            scrollEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            renderLoading={() => (
              <>
                <View style={{ padding: 16 }}>
                  <View style={styles.skeletonCard} />
                  <View style={styles.skeletonLineShort} />
                  <View style={styles.skeletonLine} />
                </View>
                <View style={{ padding: 16 }}>
                  <View style={styles.skeletonCard} />
                  <View style={styles.skeletonLineShort} />
                  <View style={styles.skeletonLine} />
                </View>
                <View style={{ padding: 16 }}>
                  <View style={styles.skeletonCard} />
                  <View style={styles.skeletonLineShort} />
                  <View style={styles.skeletonLine} />
                </View>
              </>
            )}
            setBuiltInZoomControls={true}
            onError={() => <ErrorView msg={'Load failed'} />}
            source={{
              // uri: 'https://www.biossaknust.com',
              uri: 'https://sites.google.com/view/biossa-knust/home',
            }}
            ref={webViewRef}
            style={{ minHeight: Dimensions.get('window').height - 100 }}
          />
        </View>
      </ScrollView>
    </SafeKeyboardView>
  );
};

export default Home;
