import { useEffect, useMemo, useRef } from 'react';
import { editorStore, PlayerController } from '@/lib/editor.store';
import { useEditorStore } from '@/hooks/useEditorStore';

const VideoPlayer = () => {
  const controller = useMemo<PlayerController>(
    () => ({
      play: async () => {
        await videoRef.current?.play();
      },

      pause: () => {
        videoRef.current?.pause();
      },

      seek: (time: number) => {
        if (!videoRef.current) {
          return;
        }

        videoRef.current.currentTime = time;
      },

      getCurrentTime: () => {
        return videoRef.current?.currentTime ?? 0;
      },
    }),
    [],
  );

  useEffect(() => {
    editorStore.registerPlayer(controller);

    return () => {
      editorStore.unregisterPlayer();
    };
  }, [controller]);

  const video = useEditorStore((state) => state.video);

  const videoRef = useRef<HTMLVideoElement>(null);

  if (!video) {
    return <p>No video selected</p>;
  }

  const handleLoadedMetaData = () => {
    if (!videoRef.current) {
      return;
    }

    editorStore.setDuration(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) {
      return;
    }

    editorStore.setCurrentTime(videoRef.current.currentTime);
  };

  const handlePlay = () => {
    editorStore.setPlaying(true);
  };

  const handlePause = () => {
    editorStore.setPlaying(false);
  };

  return (
    <>
      <h3>{video.name}</h3>

      <video
        ref={videoRef}
        controls
        width={900}
        src={video.url}
        onLoadedMetadata={handleLoadedMetaData}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </>
  );
};

export default VideoPlayer;
