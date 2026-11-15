const http = require('node:http');
const os = require('node:os');

const PORT = 3000;
const startedAt = Date.now();

const server = http.createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      'Content-Type': 'application/json',
      'Allow': 'GET'
    });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'healthy' }));
  }

  if (path === '/api/status') {
    const data = {
      application: 'AWS DevOps Portfolio',
      status: 'running',
      version: '1.0.0',
      environment: 'Docker',
      platform: 'Node.js',
      hostname: os.hostname(),
      uptime_seconds: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(data));
  }

  if (path === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    return res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AWS DevOps Portfolio</title>

<style>
* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.container {
  width: 100%;
  max-width: 850px;
  text-align: center;
}

h1 {
  font-size: 42px;
  color: #38bdf8;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  background: #1e293b;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #334155;
}

.card h3 {
  color: #38bdf8;
}

.status {
  margin-top: 35px;
  padding: 18px;
  background: #14532d;
  border-radius: 10px;
  color: #86efac;
}

a { color: #7dd3fc; }
</style>

</head>

<body>

<div class="container">

<h1>AWS DevOps Infrastructure</h1>

<p class="subtitle">
Cloud Deployment | Docker | Nginx | Node.js
</p>

<div class="grid">

  <div class="card">
    <h3>Cloud</h3>
    <p>Amazon Web Services</p>
    <p>EC2 Instance</p>
  </div>

  <div class="card">
    <h3>Containerization</h3>
    <p>Docker</p>
    <p>Docker Compose</p>
  </div>

  <div class="card">
    <h3>Reverse Proxy</h3>
    <p>Nginx</p>
    <p>HTTP Routing</p>
  </div>

  <div class="card">
    <h3>Application</h3>
    <p>Node.js</p>
    <p>REST API</p>
  </div>

</div>

<div class="status" id="status">
  Checking application health...
</div>

<p style="margin-top:30px">
  <a href="/api/status">View API Status</a>
</p>

</div>

<script>
fetch('/health')
  .then(r => {
    if (!r.ok) throw new Error('Health check failed');
    return r.json();
  })
  .then(data => {
    document.getElementById('status').textContent =
      data.status === 'healthy'
        ? '● Application Healthy'
        : '● Application Unhealthy';
  })
  .catch(() => {
    document.getElementById('status').textContent =
      '● Health Check Failed';
  });
</script>

</body>
</html>
`);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Application running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
