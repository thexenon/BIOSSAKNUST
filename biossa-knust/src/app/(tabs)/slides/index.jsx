import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from 'react-native';
import SafeKeyboardView from '../../../components/SafeKeyboardView';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import BackgroundDownloader from '@kesha-antonov/react-native-background-downloader';
import { ProgressBar } from 'react-native-paper';
import FileViewer from 'react-native-file-viewer';

const DOWNLOAD_DIR =
  Platform.OS === 'android'
    ? RNFS.DownloadDirectoryPath
    : RNFS.DocumentDirectoryPath;

const Slides = () => {
  const webViewRef = useRef(null);

  /**
   * downloads = {
   *   [id]: {
   *     id,
   *     url,
   *     path,
   *     progress,
   *     speed,
   *     status, // downloading | paused | done | error
   *     task
   *   }
   * }
   */
  const [downloads, setDownloads] = useState({});

  /* ---------------------------------- */
  /* Permissions */
  /* ---------------------------------- */
  const requestPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  /* ---------------------------------- */
  /* Restore background tasks */
  /* ---------------------------------- */
  useEffect(() => {
    BackgroundDownloader.checkForExistingDownloads()
      .then((tasks) => {
        tasks.forEach((task) => attachListeners(task));
      })
      .catch(console.log);
  }, []);

  /* ---------------------------------- */
  /* Add Download */
  /* ---------------------------------- */
  const addDownload = async (url) => {
    const granted = await requestPermission();
    if (!granted) return;

    const fileName = url.split('/').pop();
    const path = `${DOWNLOAD_DIR}/${fileName}`;
    const id = `${Date.now()}-${fileName}`;

    const task = BackgroundDownloader.download({
      id,
      url,
      destination: path,
    });

    setDownloads((prev) => ({
      ...prev,
      [id]: {
        id,
        url,
        path,
        progress: 0,
        speed: 0,
        status: 'downloading',
        task,
      },
    }));

    attachListeners(task);
  };

  /* ---------------------------------- */
  /* Attach listeners */
  /* ---------------------------------- */
  const attachListeners = (task) => {
    let lastBytes = 0;
    let lastTime = Date.now();

    task
      .begin(() => {})
      .progress((percent, bytesDownloaded) => {
        const now = Date.now();
        const deltaTime = (now - lastTime) / 1000;
        const deltaBytes = bytesDownloaded - lastBytes;

        const speed = deltaTime > 0 ? deltaBytes / deltaTime : 0;

        lastBytes = bytesDownloaded;
        lastTime = now;

        setDownloads((prev) => ({
          ...prev,
          [task.id]: {
            ...prev[task.id],
            progress: percent,
            speed,
          },
        }));
      })
      .done(() => {
        setDownloads((prev) => ({
          ...prev,
          [task.id]: {
            ...prev[task.id],
            status: 'done',
            progress: 1,
          },
        }));
      })
      .error(() => {
        setDownloads((prev) => ({
          ...prev,
          [task.id]: {
            ...prev[task.id],
            status: 'error',
          },
        }));
      });
  };

  /* ---------------------------------- */
  /* Controls */
  /* ---------------------------------- */
  const pause = (id) => {
    downloads[id]?.task?.pause();
    setDownloads((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: 'paused' },
    }));
  };

  const resume = (id) => {
    downloads[id]?.task?.resume();
    setDownloads((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: 'downloading' },
    }));
  };

  const openFile = (path) => {
    FileViewer.open(path).catch(() => Alert.alert('Error', 'Cannot open file'));
  };

  /* ---------------------------------- */
  /* UI */
  /* ---------------------------------- */
  return (
    <SafeKeyboardView style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{
          uri: 'https://drive.google.com/drive/folders/1gw4Z79qWrOJIHfwsy1ad1XIp1Lc6TQRt',
        }}
        startInLoadingState
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
        style={{ height: Dimensions.get('window').height * 0.6 }}
        onShouldStartLoadWithRequest={(e) => {
          if (e.url.endsWith('.pdf') || e.url.endsWith('.zip')) {
            addDownload(e.url);
            return false;
          }
          return true;
        }}
      />

      <ScrollView style={{ padding: 12 }}>
        {Object.values(downloads).map((d) => (
          <View key={d.id} style={{ marginBottom: 16 }}>
            <Text>{d.path.split('/').pop()}</Text>

            <ProgressBar progress={d.progress} />

            <Text>
              {(d.speed / 1024).toFixed(1)} KB/s — {d.status}
            </Text>

            {d.status === 'downloading' && (
              <TouchableOpacity onPress={() => pause(d.id)}>
                <Text>Pause</Text>
              </TouchableOpacity>
            )}

            {d.status === 'paused' && (
              <TouchableOpacity onPress={() => resume(d.id)}>
                <Text>Resume</Text>
              </TouchableOpacity>
            )}

            {d.status === 'done' && (
              <TouchableOpacity onPress={() => openFile(d.path)}>
                <Text>Open</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeKeyboardView>
  );
};

export default Slides;
