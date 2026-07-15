const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = 8000;
const dataFile = path.join(root, 'data.json');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const initialData = {
  tickets: [
    { id: 'REP-1001', macmiil: 'Jaamac Cilmi', tel: '061555123', nooc: 'Laptop', model: 'Dell Latitude', cilaad: 'Shaashadda baa madow', qiimo: '25', taariikh: '2026-07-12', xaalad: 'Gacantaa lagu hayaa' },
    { id: 'REP-1003', macmiil: 'Nimco Ahmed', tel: '061555789', nooc: 'Printer', model: 'Canon MF3010', cilaad: 'Khadka waraaqaha wuu xumaaday', qiimo: '18', taariikh: '2026-07-13', xaalad: 'Baadhitaan' }
  ],
  archive: [
    { id: 'REP-1002', macmiil: 'Xaliimo Cali', tel: '061555456', nooc: 'Printer', model: 'HP LaserJet', cilaad: 'Khadka ayaa ka dsilan', qiimo: '15', taariikh: '2026-07-14', xaalad: 'Waa Diyaar' }
  ]
};

function readStoredData(callback) {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        callback(null, initialData);
        return;
      }
      callback(err, null);
      return;
    }

    try {
      callback(null, JSON.parse(data));
    } catch (parseErr) {
      callback(parseErr, null);
    }
  });
}

function writeStoredData(data, callback) {
  fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8', callback);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      const fallback = path.join(root, 'farsamo.html');
      fs.readFile(fallback, (fallbackErr, fallbackData) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(fallback)] || 'application/octet-stream' });
        res.end(fallbackData);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/api/data') {
    readStoredData((err, data) => {
      if (err) {
        sendJson(res, 500, { error: 'Unable to read data' });
        return;
      }
      sendJson(res, 200, data || initialData);
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/data') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (!parsed || !Array.isArray(parsed.tickets) || !Array.isArray(parsed.archive)) {
          sendJson(res, 400, { error: 'Invalid payload' });
          return;
        }

        writeStoredData(parsed, (err) => {
          if (err) {
            sendJson(res, 500, { error: 'Unable to save data' });
            return;
          }
          sendJson(res, 200, { success: true });
        });
      } catch (error) {
        sendJson(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  let requestPath = url.pathname === '/' ? '/farsamo.html' : url.pathname;
  const decodedPath = decodeURIComponent(requestPath);
  const safePath = path.normalize(decodedPath).replace(/^([/\\])+/, '');
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  serveFile(res, filePath);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
