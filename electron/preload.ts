import { contextBridge, ipcRenderer } from 'electron';

import { IPC } from '@shared/ipc';
import type { VideoFile } from '@shared/types';

contextBridge.exposeInMainWorld('electron', {
  dialog: {
    openVideo: () =>
      ipcRenderer.invoke(IPC.dialog.openVideo) as Promise<VideoFile | null>,
  },

  ffmpeg: {
    trim: (videoId: string, inPoint: number, outPoint: number) =>
      ipcRenderer.invoke(
        IPC.ffmpeg.trim,
        videoId,
        inPoint,
        outPoint,
      ) as Promise<string | null>,

    concat: (clips: { videoOd: string; inPoint: number; outPoint: number }[]) =>
      ipcRenderer.invoke(IPC.ffmpeg.concat, clips) as Promise<string | null>,

    thumbnail: (videoId: string) =>
      ipcRenderer.invoke(IPC.ffmpeg.thumbnail, videoId) as Promise<string>,

    onProgress: (callback: (percent: number) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, percent: number) => {
        callback(percent);
      };

      ipcRenderer.on(IPC.ffmpeg.progress, handler);

      return () => {
        ipcRenderer.removeListener(IPC.ffmpeg.progress, handler);
      };
    },
  },
});
