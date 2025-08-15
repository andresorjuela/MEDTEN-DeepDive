/* eslint-env node */
import http from 'node:http';

const PORT = process.env.PORT || 8787;
const HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com';
const PID = process.env.POSTHOG_PROJECT_ID;
const KEY = process.env.POSTHOG_PERSONAL_API_KEY;

if (!KEY || !PID) {
  console.error('Missing env: POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/api/posthog-query') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', async () => {
    try {
      const { query } = JSON.parse(body || '{}');
      if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing query' }));
        return;
      }
      const r = await fetch(`${HOST}/api/projects/${PID}/query/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
      });
      const data = await r.json();
      res.writeHead(r.ok ? 200 : 500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(data));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: String(e?.message || e) }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`PostHog dev proxy running on http://localhost:${PORT}/api/posthog-query`);
});
