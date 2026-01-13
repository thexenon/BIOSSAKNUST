import { useEffect, useRef, useState } from 'react';
import BackgroundDownloader from '@kesha-antonov/react-native-background-downloader';
import RNFS from 'react-native-fs';
import { saveDownloads, loadDownloads } from './useStorage';

const MAX_RETRIES = 3;

export function useDownloader() {
  const [downloads, setDownloads] = useState({});
  const tasksRef = useRef({});

  /* ---------------- Restore persisted ---------------- */
  useEffect(() => {
    (async () => {
      const persisted = await loadDownloads();
      setDownloads(persisted);

      const tasks = await BackgroundDownloader.checkForExistingDownloads();
      tasks.forEach((task) => {
        tasksRef.current[task.id] = task;
        attachListeners(task);
      });
    })();
  }, []);

  /* ---------------- Persist ---------------- */
  useEffect(() => {
    saveDownloads(downloads);
  }, [downloads]);

  /* ---------------- Attach listeners ---------------- */
  const attachListeners = (task) => {
    let lastBytes = 0;
    let lastTime = Date.now();

    task
      .progress((progress, bytes, totalBytes) => {
        const now = Date.now();
        const deltaTime = (now - lastTime) / 1000 || 1;
        const speed = (bytes - lastBytes) / deltaTime;

        const remaining = speed > 0 ? (totalBytes - bytes) / speed : null;

        lastBytes = bytes;
        lastTime = now;

        setDownloads((prev) => ({
          ...prev,
          [task.id]: {
            ...prev[task.id],
            progress,
            speed,
            remainingTime: remaining,
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
            remainingTime: 0,
          },
        }));
      })
      .error(() => handleError(task.id));
  };

  /* ---------------- Error + retry ---------------- */
  const handleError = (id) => {
    setDownloads((prev) => {
      const d = prev[id];
      if (!d) return prev;

      if (d.retries < MAX_RETRIES) {
        retry(id);
        return {
          ...prev,
          [id]: { ...d, retries: d.retries + 1 },
        };
      }

      return {
        ...prev,
        [id]: { ...d, status: 'error' },
      };
    });
  };

  /* ---------------- Start ---------------- */
  const startDownload = (id, url, path) => {
    const task = BackgroundDownloader.download({
      id,
      url,
      destination: path,
      notification: {
        enabled: true,
        autoClear: true,
        onProgressTitle: 'Downloading',
        onCompleteTitle: 'Download complete',
      },
    });

    tasksRef.current[id] = task;

    setDownloads((prev) => ({
      ...prev,
      [id]: {
        id,
        url,
        path,
        progress: 0,
        speed: 0,
        remainingTime: null,
        status: 'downloading',
        retries: 0,
      },
    }));

    attachListeners(task);
  };

  /* ---------------- Controls ---------------- */
  const pause = (id) => {
    tasksRef.current[id]?.pause();
    setDownloads((p) => ({ ...p, [id]: { ...p[id], status: 'paused' } }));
  };

  const resume = (id) => {
    tasksRef.current[id]?.resume();
    setDownloads((p) => ({ ...p, [id]: { ...p[id], status: 'downloading' } }));
  };

  const retry = (id) => {
    const d = downloads[id];
    if (!d) return;
    startDownload(id, d.url, d.path);
  };

  const remove = async (id) => {
    const d = downloads[id];
    if (!d) return;

    tasksRef.current[id]?.pause();
    delete tasksRef.current[id];

    if (await RNFS.exists(d.path)) {
      await RNFS.unlink(d.path);
    }

    setDownloads((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const clearAll = async () => {
    await Promise.all(
      Object.values(downloads).map((d) =>
        RNFS.exists(d.path).then((exists) => exists && RNFS.unlink(d.path))
      )
    );
    setDownloads({});
    tasksRef.current = {};
  };

  return {
    downloads,
    startDownload,
    pause,
    resume,
    retry,
    remove,
    clearAll,
  };
}
