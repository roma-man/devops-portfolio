const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const BASE_URL = 'http://127.0.0.1:3000';

test('Application health and API', async () => {
  const app = spawn(process.execPath, ['app/server.js'], {
    stdio: 'ignore'
  });

  try {
    let ready = false;

    for (let i = 0; i < 30; i++) {
      try {
        const response = await fetch(`${BASE_URL}/health`);
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {}

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    assert.ok(ready, 'Application failed to start');

    const health = await fetch(`${BASE_URL}/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), {
      status: 'healthy'
    });

    const status = await fetch(`${BASE_URL}/api/status`);
    assert.equal(status.status, 200);

    const data = await status.json();

    assert.equal(data.status, 'running');
    assert.equal(data.version, '1.0.0');

  } finally {
    app.kill('SIGTERM');
  }
});
