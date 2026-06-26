'use client';

import { useState } from 'react';
import FilePicker from './FilePicker';
import VideoPlayer from './VideoPlayer';
import { VideoFile } from '@shared/types';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useEditorStore } from '@/hooks/useEditorStore';
import TimeLine from './TimeLine';
import ExportButton from './ExportButton';
import ClipList from './ClipList';

const VideoEditor = () => {
  const video = useEditorStore((state) => state.video);
  const duration = useEditorStore((state) => state.duration);
  const currentTime = useEditorStore((state) => state.currentTime);
  const playing = useEditorStore((state) => state.playing);

  return (
    <div>
      <h1>VideoEditor</h1>
      <FilePicker />

      <VideoPlayer />

      <TimeLine />

      {video && (
        <div>
          <p>Duration: {duration.toFixed(3)} s</p>
          <p>Current Time: {currentTime.toFixed(3)} s</p>
          <p>Playing: {playing ? 'Yes' : 'No'}</p>
        </div>
      )}

      <ExportButton />
      <ClipList />
    </div>
  );
};

export default VideoEditor;
