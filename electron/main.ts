import { app, BrowserWindow, protocol } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerIpcHandlers } from './ipc/register';
import { registerVideoProtocol } from './protocol/video.protocol';
import { mediaServer } from './media/media.server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const url = app.isPackaged ? '...' : 'http://localhost:3000';

// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: 'video',
//     privileges: {
//       standard: true,
//       secure: true,
//       supportFetchAPI: true,
//       stream: true,
//     },
//   },
// ]);

async function createWindow() {
  const window = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  await window.loadURL(url);

  if (!app.isPackaged) {
    window.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  // registerVideoProtocol();
  mediaServer.start();

  registerIpcHandlers();

  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
