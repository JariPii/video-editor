import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { app } from 'electron';
import fs from 'node:fs';
import os from 'node:os';

const require = createRequire(import.meta.url);

function getFfmpegPath(): string {
  const staticPath = require('ffmpeg-static') as string;

  if (app.isPackaged) {
    return staticPath.replace('app.asar', 'app.asar.unpacked');
  }

  return staticPath;
}

export type TrimOptions = {
  inputPath: string;
  outputPath: string;
  inPoint: number;
  outPoint: number;
  onProgress?: (percent: number) => void;
};

export type ConcatClip = {
  inputPath: string;
  inPoint: number;
  outPoint: number;
};

export type ConcatOptions = {
  clips: ConcatClip[];
  outputPath: string;
  onProgress?: (percent: number) => void;
};

function parseProgress(stderr: string, durationSeconds: number): number | null {
  const match = stderr.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
  if (!match) return null;

  const h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const s = parseInt(match[3]);
  const cs = parseInt(match[4]);

  const currentSeconds = h * 3600 + m * 60 + s + cs / 100;
  const percent = Math.min(
    100,
    Math.round((currentSeconds / durationSeconds) * 100),
  );

  return percent;
}

export async function trimVideo(options: TrimOptions): Promise<void> {
  const { inputPath, outputPath, inPoint, outPoint, onProgress } = options;
  const duration = outPoint - inPoint;
  const ffmpegPath = getFfmpegPath();

  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-ss',
      String(inPoint),
      '-t',
      String(duration),
      '-i',
      inputPath,
      '-c',
      'copy',
      outputPath,
    ];

    console.log('[ffmpeg] Running:', ffmpegPath, args.join(' '));

    const proc = spawn(ffmpegPath, args);

    proc.stderr.on('data', (data: Buffer) => {
      const text = data.toString();
      console.log('[ffmpeg]', data.toString());

      if (onProgress) {
        const percent = parseProgress(text, duration);
        if (percent !== null) {
          onProgress(percent);
        }
      }
    });

    proc.on('close', (code: number | null) => {
      if (code === 0) {
        onProgress?.(100);
        resolve();
      } else {
        reject(new Error(`FFmpeg closed with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

export async function concatClips(options: ConcatOptions): Promise<void> {
  const { clips, outputPath, onProgress } = options;
  const ffmpegPath = getFfmpegPath();

  const totalDuration = clips.reduce(
    (sum, c) => sum + (c.outPoint - c.inPoint),
    0,
  );

  const listContent = clips
    .map((c) =>
      [
        `file '${c.inputPath.replace(/'/g, "'\\''")}'`,
        `inpoint ${c.inPoint}`,
        `outpoint ${c.outPoint}`,
      ].join('\n'),
    )
    .join('\n');

  const listPath = path.join(os.tmpdir(), `ffmepg-concat-${Date.now()}.txt`);
  fs.writeFileSync(listPath, listContent, 'utf-8');

  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      listPath,
      '-c',
      'copy',
      outputPath,
    ];

    const proc = spawn(ffmpegPath, args);

    proc.stderr.on('data', (data: Buffer) => {
      const text = data.toString();
      if (onProgress) {
        const percent = parseProgress(text, totalDuration);
        if (percent !== null) onProgress(percent);
      }
    });

    proc.on('close', (code: number | null) => {
      fs.unlink(listPath, () => {});

      if (code === 0) {
        onProgress?.(100);
        resolve();
      } else reject(new Error(`FFmpeg concat ended with code ${code}`));
    });

    proc.on('error', (err) => {
      fs.unlink(listPath, () => {});
      reject(err);
    });
  });
}
