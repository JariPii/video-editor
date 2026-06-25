export const IPC = {
  dialog: {
    openVideo: 'dialog:openVideo',
    saveVideo: 'dialog:saveVideo',
  },

  ffmpeg: {
    probe: 'ffmpeg:probe',
    trim: 'ffmpeg:trim',
    export: 'ffmpeg:export',
  },

  project: {
    save: 'project:save',
    open: 'project:open',
  },
} as const;
