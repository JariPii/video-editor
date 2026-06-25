import { ipcMain } from 'electron';

import { IPC } from '@shared/ipc';
import * as dialogService from '../services/dialog.service';

export function registerIpcHandlers() {
  ipcMain.handle(IPC.dialog.openVideo, dialogService.openVideo);
}
