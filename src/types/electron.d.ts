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
          settings: {
            mode: 'copy' | 'recode';
            speed: number;
            quality: number;
            noAudio: boolean;
          },
        ): Promise<string | null>;
        concat(
          clips: { videoId: string; inPoint: number; outPoint: number }[],
          noAudio,
        ): Promise<string | null>;
        thumbnail(videoId: string): Promise<string>;
        onProgress(callback: (percent: number) => void): () => void;
      };
    };
  }
}
