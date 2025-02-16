import { spawn } from 'child_process';


const servers = [
  { name: 'country', file: 'country.js' },
  { name: 'journal', file: 'index.js' },
  { name: 'user', file: 'server.js' },
  { name: 'proxy', file: 'Proxy.js' },
];

servers.forEach((server) => {
  const process = spawn('node', [server.file]);

  process.stdout.on('data', (data) => {
    console.log(`${server.name} stdout: ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`${server.name} stderr: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`${server.name} process exited with code ${code}`);
  });
});
