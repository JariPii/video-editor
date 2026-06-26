'use client';

import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { VideoFile } from '@shared/types';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useEditorStore } from '@/hooks/useEditorStore';
import TimeLine from './TimeLine';
import ExportButton from './ExportButton';
import ClipList from './ClipList';
import VideoPanel from './VideoPanel';

const VideoEditor = () => {
  const activeVideoId = useEditorStore((s) => s.activeVideoId);
  const duration = useEditorStore((s) => s.duration);
  const currentTime = useEditorStore((s) => s.currentTime);
  const playing = useEditorStore((s) => s.playing);

  return (
    <div className='flex flex-col gap-6 p-6'>
      <VideoPanel />
      <div className='flex flex-col flex-1'>
        <VideoPlayer />

        <TimeLine />
      </div>

      {activeVideoId && (
        <div className='mt-2 text-xs font-mono text-gray-500 flex gap-4'>
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
