import { dialog } from 'electron';
import path from 'node:path';

import type { VideoFile } from '@shared/types';

export async function openVideo(): Promise<VideoFile | null> {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Videos',
        extensions: ['mp4', 'mov', 'mkv', 'avi', 'webm'],
      },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];

  return {
    path: filePath,
    name: path.basename(filePath),
  };
}
