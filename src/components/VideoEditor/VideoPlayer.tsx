import type { VideoFile } from '@shared/types';
import { toVideoUrl } from '@/lib/video';

type VideoPlayerProps = {
  video: VideoFile | null;
};

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  if (!video) {
    return <p>No video selected</p>;
  }

  return (
    <>
      <h3>{video.name}</h3>
      <video controls width={900} src={video.url} />
    </>
  );
};

export default VideoPlayer;
