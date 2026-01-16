import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const FILE_HOST_URL = 'https://thexenon.github.io/TAB-KNUST/'; // GitHub Pages root

const DOWNLOAD_DIR =
  Platform.OS === 'android'
    ? FileSystem.documentDirectory
    : FileSystem.documentDirectory;

export default function SlidesIndex() {
  const webViewRef = useRef(null);

  const [currentUrl, setCurrentUrl] = useState(FILE_HOST_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- DOWNLOAD ---------------- */
  const downloadFile = async () => {
    try {
      const cleanUrl = currentUrl.split('?')[0];
      const fileName = decodeURIComponent(cleanUrl.split('/').pop());
      const localPath = DOWNLOAD_DIR + fileName;

      setLoading(true);

      const download = FileSystem.createDownloadResumable(cleanUrl, localPath);

      const result = await download.downloadAsync();

      setLoading(false);

      if (result?.uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri);
        } else {
          Alert.alert('Downloaded', 'File saved successfully.');
        }
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Download failed', err.message);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <View style={{ flex: 1 }}>
      {/* HEADER CONTROLS */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          disabled={!canGoBack}
          onPress={() => webViewRef.current?.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={canGoBack ? '#000' : '#aaa'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!canGoForward}
          onPress={() => webViewRef.current?.goForward()}
        >
          <Ionicons
            name="arrow-forward"
            size={22}
            color={canGoForward ? '#000' : '#aaa'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
          <Ionicons name="reload" size={22} />
        </TouchableOpacity>

        <TouchableOpacity onPress={downloadFile}>
          <Ionicons name="download-outline" size={22} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size={'large'}
            color="#00ff55ff"
            style={{ marginTop: 8 }}
          />
          <Text style={{ color: '#fff' }}>Loading</Text>
        </View>
      )}
      {/* WEBVIEW */}
      <WebView
        ref={webViewRef}
        source={{ uri: FILE_HOST_URL }}
        startInLoadingState
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(nav) => {
          setCurrentUrl(nav.url);
          setCanGoBack(nav.canGoBack);
          setCanGoForward(nav.canGoForward);
        }}
        allowsBackForwardNavigationGestures
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 20,
    backgroundColor: '#07ff28ff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
