import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'out')
if (!fs.existsSync(OUT)) {
  console.error('sw.mjs: out/ neexistuje (spusť next build).')
  process.exit(1)
}

function walk(dir, filter) {
  const res = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) res.push(...walk(p, filter))
    else if (filter(p)) res.push(p)
  }
  return res
}
const rel = (p) => '/' + path.relative(OUT, p).split(path.sep).join('/')

const precache = new Set([
  '/',
  '/projekty/',
  '/manifest.webmanifest',
  '/favicon.svg',
])

for (const d of fs.readdirSync(path.join(OUT, 'projekty'), {
  withFileTypes: true,
})) {
  if (
    d.isDirectory() &&
    fs.existsSync(path.join(OUT, 'projekty', d.name, 'index.html'))
  )
    precache.add(`/projekty/${d.name}/`)
}

const thumbs = []
for (const f of walk(path.join(OUT, 'fonts'), (p) => p.endsWith('.woff2')))
  precache.add(rel(f))
for (const f of walk(path.join(OUT, 'icons'), (p) => p.endsWith('.png')))
  precache.add(rel(f))
for (const f of walk(path.join(OUT, '_next', 'static'), (p) =>
  /\.(js|css)$/.test(p)
))
  precache.add(rel(f))
for (const f of walk(path.join(OUT, 'images'), (p) => p.endsWith('-640.avif')))
  thumbs.push(rel(f))
thumbs.sort()

const list = [...precache].sort()
const hash = createHash('sha1')
for (const u of [...list, ...thumbs]) {
  const f = path.join(OUT, u.endsWith('/') ? u + 'index.html' : u)
  if (fs.existsSync(f)) hash.update(fs.readFileSync(f))
}
const VERSION = hash.digest('hex').slice(0, 10)

const sw = `
const VERSION = '${VERSION}';
const CACHE = 'ab-' + VERSION;
const PRECACHE = ${JSON.stringify(list)};
const THUMBS = ${JSON.stringify(thumbs)};
const OFFLINE_HTML = '<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline — Anežka Berecková</title><style>html{background:#F4F2EE;color:#0E0E0E;font-family:system-ui,sans-serif}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:2rem}h1{font-size:clamp(2rem,9vw,5rem);font-weight:700;letter-spacing:-.01em;line-height:.95;text-transform:uppercase;margin:0}p{color:#7A7A7A;margin-top:1rem}a{color:inherit}</style></head><body><div><h1>Anežka Berecková</h1><p>Offline · <a href="/">Domů</a> · <a href="/projekty/">Projekty</a></p></div></body></html>';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      for (let i = 0; i < PRECACHE.length; i += 20) {
        await Promise.all(PRECACHE.slice(i, i + 20).map((u) => c.add(u).catch(() => {})));
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('ab-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (!e.data || e.data.type !== 'precache-thumbs') return;
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      for (let i = 0; i < THUMBS.length; i += 10) {
        const batch = THUMBS.slice(i, i + 10);
        await Promise.all(batch.map(async (u) => {
          if (await c.match(u)) return;
          await c.add(u).catch(() => {});
        }));
      }
    })
  );
});

const thumbFallback = async (c, pathname) => {
  const m = pathname.match(/^(\/images\/[^/]+\/.+)-(1080|1600|2400)\.(avif|webp)$/);
  if (!m) return null;
  return (await c.match(m[1] + '-640.avif')) || null;
};

const cacheFirst = async (req) => {
  const c = await caches.open(CACHE);
  const hit = await c.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && res.ok) c.put(req, res.clone());
    return res;
  } catch (err) {
    const fb = await thumbFallback(c, new URL(req.url).pathname);
    if (fb) return fb;
    throw err;
  }
};

const networkFirst = async (req) => {
  const c = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) c.put(req, res.clone());
    return res;
  } catch (_) {
    const hit = await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    return new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/fonts/') || url.pathname.startsWith('/icons/')) {
    e.respondWith(cacheFirst(req));
    return;
  }
  if (url.pathname.startsWith('/video/')) return;
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(networkFirst(req));
  }
});
`
fs.writeFileSync(path.join(OUT, 'sw.js'), sw)
console.log(`sw.js: ${list.length} položek v precache, verze ${VERSION}`)
