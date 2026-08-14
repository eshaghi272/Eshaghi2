const { exec } = require('child_process');
exec('npx ts-node src/server.ts', { stdio: 'inherit' });