import { createContext, useContext, useState } from 'react';
import * as FileSystem from 'expo-file-system';

const DownloadsContext = createContext();

export function DownloadsProvider({ children }) {
  const [downloads, setDownloads] = useState([]);

  const startDownload = async (url, path) => {
    const name = path.split('/').pop();

    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      path,
      {},
      (p) => {
        setDownloads((prev) =>
          prev.map((d) =>
            d.path === path
              ? {
                  ...d,
                  progress: p.totalBytesWritten / p.totalBytesExpectedToWrite,
                }
              : d
          )
        );
      }
    );

    setDownloads((prev) => [...prev, { name, path, progress: 0, done: false }]);

    await downloadResumable.downloadAsync();

    setDownloads((prev) =>
      prev.map((d) => (d.path === path ? { ...d, progress: 1, done: true } : d))
    );
  };

  const remove = async (path) => {
    await FileSystem.deleteAsync(path, { idempotent: true });
    setDownloads((prev) => prev.filter((d) => d.path !== path));
  };

  const clearAll = async () => {
    for (const d of downloads) {
      await FileSystem.deleteAsync(d.path, { idempotent: true });
    }
    setDownloads([]);
  };

  return (
    <DownloadsContext.Provider
      value={{ downloads, startDownload, remove, clearAll }}
    >
      {children}
    </DownloadsContext.Provider>
  );
}

export const useDownloads = () => {
  const context = useContext(DownloadsContext);
  if (!context) {
    throw new Error('useDownloads must be used within DownloadsProvider');
  }
  return context;
};
