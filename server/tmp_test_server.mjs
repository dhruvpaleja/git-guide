import { spawn } from 'child_process';

console.log('Starting backend server...');
const server = spawn('node', ['dist/index.js'], {
    cwd: 'd:\\Kimi_Agent_Pixel-Perfect Website Build\\server',
    stdio: 'pipe',
    env: { ...process.env, PORT: '3001' }
});

let serverReady = false;

server.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('server_started') || output.includes('port') || output.includes('listening')) {
        if (!serverReady) {
            serverReady = true;
            runTest();
        }
    }
});

server.stderr.on('data', (data) => {
    console.error(`[SERVER ERR] ${data}`);
});

server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
});

setTimeout(() => {
    if (!serverReady) {
        serverReady = true;
        runTest();
    }
}, 3000);

async function runTest() {
    console.log('Sending requests to verify endpoints...');

    try {
        let res = await fetch('http://localhost:3001/api/v1/health');
        let data = await res.json();
        console.log('GET /api/v1/health -> ', data);

        res = await fetch('http://localhost:3001/api/v1/health/ready');
        data = await res.json();
        console.log('GET /api/v1/health/ready -> ', data);
    } catch (err) {
        console.error('Fetch error:', err.message);
    } finally {
        server.kill();
        process.exit(0);
    }
}
