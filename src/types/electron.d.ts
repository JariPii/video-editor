import type { VideoFile } from '@shared/types';

export {};

declare global {
  interface Window {
    electron: {
      dialog: {
        openVideo(): Promise<VideoFile | null>;
      };
    };
  }
}
