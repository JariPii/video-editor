import { dialog } from 'electron';
import path from 'node:path';

import type { VideoFile } from '@shared/types';
import { mediaRegistry } from '../media/media.registry';
import { mediaServer } from '../media/media.server';

export async function openVideo(): Promise<VideoFile | null> {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Video',
        extensions: ['mp4', 'mov', 'mkv', 'avi', 'webm'],
      },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const id = mediaRegistry.register(filePath);

  return {
    id,
    name: path.basename(filePath),
    url: mediaServer.mediaUrl(id),
  };
}

export async function saveVideo(): Promise<string | null> {
  const result = await dialog.showSaveDialog({
    filters: [{ name: 'Video', extensions: ['mp4'] }],
    defaultPath: 'clip.mp4',
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  return result.filePath;
}
