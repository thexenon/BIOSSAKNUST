import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import FileViewer from 'react-native-file-viewer';
import { useDownloader } from '../../../utils/useDownloader';

export default function DownloadsScreen() {
  const { downloads, pause, resume, retry, remove, clearAll } = useDownloader();

  return (
    <ScrollView style={{ padding: 16 }}>
      <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
        <Text style={{ color: '#fff' }}>Clear All</Text>
      </TouchableOpacity>

      {Object.values(downloads).map((d) => (
        <View key={d.id} style={styles.card}>
          <Text style={styles.fileName}>{d.path.split('/').pop()}</Text>

          <ProgressBar progress={d.progress} />

          <Text style={styles.meta}>
            {(d.speed / 1024).toFixed(1)} KB/s — {d.status}
          </Text>

          {d.remainingTime !== null && d.status === 'downloading' && (
            <Text style={styles.meta}>
              {Math.ceil(d.remainingTime)} sec remaining
            </Text>
          )}

          <View style={styles.actions}>
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

            {d.status === 'error' && (
              <TouchableOpacity onPress={() => retry(d.id)}>
                <Text>Retry</Text>
              </TouchableOpacity>
            )}

            {d.status === 'done' && (
              <TouchableOpacity onPress={() => FileViewer.open(d.path)}>
                <Text>Open</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => remove(d.id)}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  fileName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
});
