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
