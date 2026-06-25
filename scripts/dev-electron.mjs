import { spawn } from 'node:child_process';
import waitOn from 'wait-on';

console.log('Waiting for Next.Js...');

await waitOn({
  resources: ['http://localhost:3000'],
});

console.log('Starting Electron...');

const electron = spawn('npx', ['electron', '.'], {
  stdio: 'inherit',
  shell: true,
});

electron.on('close', (code) => {
  process.exit(code ?? 0);
});
