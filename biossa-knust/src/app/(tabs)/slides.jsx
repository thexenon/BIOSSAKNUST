import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Alert,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
// import RNFS from "react-native-fs";
import * as DocumentPicker from 'expo-document-picker';
import * as Notifications from 'expo-notifications';
import BackgroundDownloader from '@kesha-antonov/react-native-background-downloader';
import FileViewer from 'react-native-file-viewer';
import { ProgressBar } from 'react-native-paper';
import styles from '../../styles/globalStyles';
import { ErrorView } from '../../components';
import { COLORS } from '../../constants';

const Slides = () => {
  const webViewRef = useRef();
  const [isLoadong, setLoading] = useState(false);
  const [downloadQueue, setDownloadQueue] = useState([]); // Queue for downloads
  const [downloadHistory, setDownloadHistory] = useState([]); // Completed downloads
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSpeeds, setDownloadSpeeds] = useState({}); // Track download speeds

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

  const showNotification = async (title, message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
      },
      trigger: null,
    });
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to download files.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickSaveLocation = async (fileName) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (res.type === 'success') {
        // Use res.uri as the save path
        return res.uri;
      }
      return null;
    } catch (err) {
      console.warn('File picker error:', err);
      return null;
    }
  };

  const addToQueue = async (url) => {
    const permissionGranted = await requestStoragePermission();
    if (!permissionGranted) {
      Alert.alert('Permission Denied', 'Storage permission is required.');
      return;
    }

    const fileName = url.split('/').pop();
    const savePath = await pickSaveLocation(fileName);

    if (!savePath) {
      Alert.alert('Download Cancelled', 'No save location selected.');
      return;
    }

    setDownloadQueue((prevQueue) => [
      ...prevQueue,
      {
        url,
        savePath,
        progress: 0,
        task: null,
        isPaused: false,
        retryCount: 0,
      },
    ]);

    if (!isDownloading) {
      processQueue();
    }
  };

  const processQueue = async () => {
    if (downloadQueue.length === 0) {
      setIsDownloading(false);
      return;
    }

    setIsDownloading(true);
    const file = downloadQueue[0];

    let lastBytes = 0;
    let lastUpdateTime = Date.now();

    const task = BackgroundDownloader.download({
      id: file.url,
      url: file.url,
      destination: file.savePath,
    })
      .begin(() => {
        console.log('Download started:', file.savePath);
      })
      .progress((percent, bytesDownloaded) => {
        const now = Date.now();
        const timeDiff = (now - lastUpdateTime) / 1000;
        const bytesDiff = bytesDownloaded - lastBytes;

        if (timeDiff > 0) {
          const speed = bytesDiff / timeDiff;
          setDownloadSpeeds((prevSpeeds) => ({
            ...prevSpeeds,
            [file.url]: speed,
          }));
        }

        lastBytes = bytesDownloaded;
        lastUpdateTime = now;

        setDownloadQueue((prevQueue) =>
          prevQueue.map((item) =>
            item.url === file.url ? { ...item, progress: percent * 100 } : item
          )
        );
      })
      .done(() => {
        Alert.alert('Download Complete', `File saved to: ${file.savePath}`);
        showNotification('Download Complete', file.savePath.split('/').pop());
        setDownloadHistory((prevHistory) => [...prevHistory, file]);
        removeFromQueue(file.url);
      })
      .error(() => {
        handleDownloadError(file);
      });

    setDownloadQueue((prevQueue) =>
      prevQueue.map((item) =>
        item.url === file.url ? { ...item, task } : item
      )
    );
  };

  const handleDownloadError = (file) => {
    if (file.retryCount < 3) {
      console.log(
        `Retrying download (${file.retryCount + 1}/3) for ${file.url}`
      );
      Alert.alert('Download Failed', `Retrying (${file.retryCount + 1}/3)...`);
      setDownloadQueue((prevQueue) =>
        prevQueue.map((item) =>
          item.url === file.url
            ? { ...item, retryCount: item.retryCount + 1 }
            : item
        )
      );
      processQueue();
    } else {
      Alert.alert('Download Failed', 'Maximum retry attempts reached.');
      removeFromQueue(file.url);
    }
  };

  const pauseDownload = (url) => {
    setDownloadQueue((prevQueue) =>
      prevQueue.map((file) => {
        if (file.url === url) {
          file.task.pause();
          file.isPaused = true;
        }
        return file;
      })
    );
  };

  const resumeDownload = (url) => {
    setDownloadQueue((prevQueue) =>
      prevQueue.map((file) => {
        if (file.url === url && file.isPaused) {
          file.task.resume();
          file.isPaused = false;
        }
        return file;
      })
    );
  };

  const removeFromQueue = (url) => {
    setDownloadQueue((prevQueue) =>
      prevQueue.filter((file) => file.url !== url)
    );
    processQueue();
  };

  const openFile = (filePath) => {
    FileViewer.open(filePath)
      .then(() => {
        console.log('File opened successfully');
      })
      .catch((error) => {
        console.error('Error opening file:', error);
        Alert.alert('Error', 'Unable to open file.');
      });
  };

  return (
    <SafeAreaView style={styles.safeSpace}>
      <View>
        <View style={{ flex: 1 }}>
          <WebView
            scrollEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            renderLoading={() => (
              <ActivityIndicator size="large" color={COLORS.primary} />
            )}
            setBuiltInZoomControls={true}
            onError={() => <ErrorView msg={'Load failed'} />}
            source={{
              uri: 'https://drive.google.com/drive/folders/1vDugpS7NU4O5Yfz9dnatBSRLAtmnh5bI',
            }}
            ref={webViewRef}
            style={{ minHeight: Dimensions.get('window').height - 100 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onShouldStartLoadWithRequest={(event) => {
              if (event.url.endsWith('.pdf') || event.url.endsWith('.zip')) {
                addToQueue(event.url);
                return false;
              }
              return true;
            }}
          />

          <ScrollView>
            {downloadQueue.map((file, index) => (
              <View key={index}>
                <Text>{file.savePath.split('/').pop()}</Text>
                <ProgressBar progress={file.progress / 100} color="blue" />
                <Text>
                  Speed:{' '}
                  {downloadSpeeds[file.url]
                    ? (downloadSpeeds[file.url] / 1024).toFixed(2)
                    : 0}{' '}
                  KB/s
                </Text>
                <TouchableOpacity onPress={() => pauseDownload(file.url)}>
                  <Text>Pause</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => resumeDownload(file.url)}>
                  <Text>Resume</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Slides;
