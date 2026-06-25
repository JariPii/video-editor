import { contextBridge, ipcRenderer } from 'electron';

import { IPC } from '@shared/ipc';
import type { VideoFile } from '@shared/types';

contextBridge.exposeInMainWorld('electron', {
  dialog: {
    openVideo: () =>
      ipcRenderer.invoke(IPC.dialog.openVideo) as Promise<VideoFile | null>,
  },
});
