import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'DOWNLOADS_V1';

export const saveDownloads = async (downloads) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(downloads));
  } catch {}
};

export const loadDownloads = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};
