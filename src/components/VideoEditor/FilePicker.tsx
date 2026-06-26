'use client';
import type { VideoFile } from '@shared/types';
import { editorActions } from '@/lib/editor.store';

const FilePicker = () => {
  const handleClick = async () => {
    const file = await window.electron.dialog.openVideo();

    if (!file) {
      return;
    }

    editorActions.setVideo(file);
  };
  return (
    <button
      className='border-white border p-3 rounded-lg hover:bg-gray-500 hover:text-black'
      onClick={handleClick}
    >
      Open video
    </button>
  );
};

export default FilePicker;
