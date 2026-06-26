import { ipcMain, IpcMainInvokeEvent } from 'electron';

import { IPC } from '@shared/ipc';
import * as dialogService from '../services/dialog.service';
import * as ffmpegService from '../services/ffmpeg.service';
import { mediaRegistry } from '../media/media.registry';

export function registerIpcHandlers() {
  ipcMain.handle(IPC.dialog.openVideo, dialogService.openVideo);
  ipcMain.handle(IPC.dialog.saveVideo, dialogService.saveVideo);

  ipcMain.handle(
    IPC.ffmpeg.trim,
    async (event, videoId: string, inPoint: number, outPoint: number) => {
      const inputPath = mediaRegistry.resolve(videoId);

      if (!inputPath) {
        throw new Error(`No file found with id: ${videoId}`);
      }

      const outputPath = await dialogService.saveVideo();

      if (!outputPath) {
        return null;
      }

      await ffmpegService.trimVideo({
        inputPath,
        outputPath,
        inPoint,
        outPoint,
        onProgress: (percent) => {
          if (!event.sender.isDestroyed()) {
            event.sender.send(IPC.ffmpeg.progress, percent);
          }
        },
      });

      return outputPath;
    },
  );

  ipcMain.handle(
    IPC.ffmpeg.concat,
    async (
      event: IpcMainInvokeEvent,
      clipIds: { videoId: string; inPoint: number; outPoint: number }[],
    ) => {
      const clips = clipIds.map((c) => {
        const inputPath = mediaRegistry.resolve(c.videoId);
        if (!inputPath) throw new Error(`No file found for id ${c.videoId}`);
        return { inputPath, inPoint: c.inPoint, outPoint: c.outPoint };
      });

      const outputPath = await dialogService.saveVideo();
      if (!outputPath) return null;

      await ffmpegService.concatClips({
        clips,
        outputPath,
        onProgress: (percent) => {
          if (!event.sender.isDestroyed()) {
            event.sender.send(IPC.ffmpeg.progress, percent);
          }
        },
      });

      return outputPath;
    },
  );
}
