// 'use client';
// import type { VideoFile } from '@shared/types';
// import { editorActions } from '@/lib/editor.store';
// import { useEditorStore } from '@/hooks/useEditorStore';

// const FilePicker = () => {
//   const activeVideo = useEditorStore((s) => s.activeVideoId);
//   const handleOpen = async () => {
//     const file = await window.electron.dialog.openVideo();

//     if (!file) {
//       return;
//     }

//     editorActions.addVideo(file);
//   };

//   if (activeVideo) {
//     return (
//       <div className='flex items-center gap-2'>
//         <span className='text-sm text-gray-300'>{activeVideo.name}</span>
//         <button
//           className='text-xs text-gray-500 hover:text-red-400'
//           onClick={editorActions.removeVideo}
//         >
//           X
//         </button>
//       </div>
//     );
//   }

//   return (
//     <button
//       className='border-white border p-3 rounded-lg hover:bg-gray-500 hover:text-black'
//       onClick={handleOpen}
//     >
//       Open video
//     </button>
//   );
// };

// export default FilePicker;
