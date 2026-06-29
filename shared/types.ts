export type VideoFile = {
  id: string;
  name: string;
  url: string;
  mimeType?: string;
};

export type Clip = {
  id: string;
  videoId: string;
  inPoint: number;
  outPoint: number;
};

export type Track = {
  id: string;
  clips: Clip[];
};

export type ExportMode = 'copy' | 'recode';

export type ExportSettings = {
  mode: ExportMode;
  speed: number;
  quality: number;
  noAudio: boolean;
  interpolate?: boolean;
  fps?: number;
};

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  mode: 'copy',
  speed: 1.0,
  quality: 18,
  noAudio: false,
  interpolate: false,
  fps: 60,
};
