import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import { useDownloader } from '../../../utils/useDownloader';

const DOWNLOAD_DIR =
  Platform.OS === 'android'
    ? RNFS.ExternalDirectoryPath
    : RNFS.DocumentDirectoryPath;

const DOWNLOADABLE_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'mp4',
  'png',
];

const isDownloadable = (url) => {
  const clean = url.split('?')[0].toLowerCase();
  return DOWNLOADABLE_EXTENSIONS.some((ext) => clean.endsWith(`.${ext}`));
};

export default function DocumentsScreen({ navigation }) {
  const webViewRef = useRef(null);
  const { startDownload } = useDownloader();

  const [currentUrl, setCurrentUrl] = useState(null);
  const [showDownload, setShowDownload] = useState(false);

  const onDownloadPress = () => {
    if (!currentUrl) return;

    const clean = currentUrl.split('?')[0];
    const fileName = decodeURIComponent(clean.split('/').pop());
    const id = `${Date.now()}-${fileName}`;
    const path = `${DOWNLOAD_DIR}/${fileName}`;

    startDownload(id, currentUrl, path);
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{
          uri: 'https://drive.google.com/drive/folders/1gw4Z79qWrOJIHfwsy1ad1XIp1Lc6TQRt',
        }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" />}
        onNavigationStateChange={(navState) => {
          setCurrentUrl(navState.url);
          setShowDownload(isDownloadable(navState.url));
        }}
      />

      {showDownload && (
        <TouchableOpacity style={styles.downloadBtn} onPress={onDownloadPress}>
          <Text style={styles.downloadText}>⬇ Download</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.downloadsPageBtn}
        onPress={() => navigation.navigate('Downloads')}
      >
        <Text style={{ color: '#fff' }}>Downloads</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  downloadBtn: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#1e88e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  downloadsPageBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 24,
  },
});
