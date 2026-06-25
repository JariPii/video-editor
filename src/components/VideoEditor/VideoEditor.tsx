'use client';

import { useState } from 'react';
import FilePicker from './FilePicker';
import VideoPlayer from './VideoPlayer';
import { VideoFile } from '@shared/types';

const VideoEditor = () => {
  const [video, setVideo] = useState<VideoFile | null>(null);

  return (
    <div>
      <h1>VideoEditor</h1>
      <FilePicker onSelect={setVideo} />
      <VideoPlayer video={video} />
    </div>
  );
};

export default VideoEditor;
