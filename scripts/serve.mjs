import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', 'out')
const PORT = Number(process.argv[2] || 4173)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
}

async function resolve(url) {
  const p = decodeURIComponent(url.split('?')[0])
  const file = path.join(ROOT, p)
  if (!file.startsWith(ROOT)) return null
  try {
    if ((await stat(file)).isDirectory()) {
      if (!p.endsWith('/')) return { redirect: p + '/' }
      return { file: path.join(file, 'index.html') }
    }
    return { file }
  } catch {
    try {
      await stat(file + '.html')
      return { file: file + '.html' }
    } catch {
      return null
    }
  }
}

createServer(async (req, res) => {
  const r = await resolve(req.url || '/')
  if (r?.redirect) {
    res.writeHead(301, { Location: r.redirect })
    return res.end()
  }
  let file = r?.file
  let status = 200
  if (!file) {
    file = path.join(ROOT, '404.html')
    status = 404
  }
  try {
    const body = await readFile(file)
    res.writeHead(status, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
    })
    res.end(body)
  } catch {
    res.writeHead(404)
    res.end()
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`))
