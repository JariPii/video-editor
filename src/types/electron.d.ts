import type { VideoFile } from '@shared/types';

export {};

declare global {
  interface Window {
    electron: {
      dialog: {
        openVideo(): Promise<VideoFile | null>;
      };
      ffmpeg: {
        trim(
          videoId: string,
          inPoint: number,
          outPoint: number,
        ): Promise<string | null>;
        concat(
          clips: { videoId: string; inPoint: number; outPoint: number }[],
        ): Promise<string | null>;
        thumbnail(videoId: string): Promise<string>;
        onProgress(callback: (percent: number) => void): () => void;
      };
    };
  }
}
