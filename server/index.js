import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { sendMatches } from './email-service.js';

const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const DIST_DIR = resolve(process.cwd(), 'dist');
const MAX_BODY_BYTES = 256 * 1024;
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('Corpul solicitării este prea mare.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Corpul solicitării trebuie să conțină JSON valid.');
    error.statusCode = 400;
    throw error;
  }
}

function serveStatic(request, response, url) {
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    sendJson(response, 400, { message: 'Adresa URL nu este validă.' });
    return;
  }

  const requestedPath = resolve(DIST_DIR, `.${pathname}`);
  if (requestedPath !== DIST_DIR && !requestedPath.startsWith(`${DIST_DIR}${sep}`)) {
    sendJson(response, 400, { message: 'Calea solicitată nu este validă.' });
    return;
  }

  const filePath = existsSync(requestedPath) && statSync(requestedPath).isFile()
    ? requestedPath
    : (extname(pathname) ? null : resolve(DIST_DIR, 'index.html'));

  if (!filePath || !existsSync(filePath)) {
    sendJson(response, 404, { message: 'Nu am găsit această pagină.' });
    return;
  }

  const immutable = pathname.startsWith('/assets/');
  response.writeHead(200, {
    'Content-Type': MIME_TYPES[extname(filePath)] || 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

const server = createServer(async (request, response) => {
  let url;
  try {
    url = new URL(request.url, 'http://localhost');
  } catch {
    sendJson(response, 400, { message: 'Adresa URL nu este validă.' });
    return;
  }

  if (url.pathname === '/health' && request.method === 'GET') {
    sendJson(response, 200, { status: 'ok' });
    return;
  }

  if (url.pathname === '/api/send-matches') {
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      sendJson(response, 405, { status: 405, message: 'Folosește metoda POST pentru a trimite extragerea.' });
      return;
    }

    if (!request.headers['content-type']?.toLowerCase().startsWith('application/json')) {
      sendJson(response, 415, { status: 415, message: 'Antetul Content-Type trebuie să fie application/json.' });
      return;
    }

    try {
      const body = await readJson(request);
      await sendMatches(body?.participants, body?.requestId);
      sendJson(response, 200, { status: 200, message: 'Emailurile Secret Santa au fost trimise!' });
    } catch (error) {
      const statusCode = error.statusCode || 502;
      if (statusCode >= 500) {
        console.error('Secret Santa email delivery failed:', error.logDetails || error.message);
      }
      sendJson(response, statusCode, {
        status: statusCode,
        message: error.logDetails ? error.message : (statusCode < 500 ? error.message : 'Trimiterea emailurilor a eșuat. Încearcă din nou mai târziu.'),
      });
    }
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendJson(response, 405, { message: 'Metoda nu este permisă.' });
    return;
  }

  serveStatic(request, response, url);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Secret Santa listening on port ${PORT}`);
});
