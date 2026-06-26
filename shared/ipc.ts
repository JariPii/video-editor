export const IPC = {
  dialog: {
    openVideo: 'dialog:openVideo',
    saveVideo: 'dialog:saveVideo',
  },

  ffmpeg: {
    probe: 'ffmpeg:probe',
    trim: 'ffmpeg:trim',
    export: 'ffmpeg:export',
    progress: 'ffmpeg:progress',
    concat: 'ffmpeg:concat',
  },

  project: {
    save: 'project:save',
    open: 'project:open',
  },
} as const;
