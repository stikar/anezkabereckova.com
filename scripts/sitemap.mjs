import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'out')
const BASE = 'https://anezkabereckova.com'
const SEG = {
  projects: 'projekty',
  shows: 'prehlidky',
  about: 'o-mne',
  contact: 'kontakt',
  press: 'press',
}
const SEG_EN = Object.fromEntries(
  Object.entries(SEG).map(([en, cs]) => [cs, en])
)

function walk(dir) {
  const res = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) res.push(...walk(p))
    else if (e.name === 'index.html') res.push(p)
  }
  return res
}
const urls = walk(OUT)
  .map(
    (f) => '/' + path.relative(OUT, path.dirname(f)).split(path.sep).join('/')
  )
  .map((u) => (u === '/.' || u === '/' ? '/' : u + '/'))
  .filter((u) => !u.startsWith('/_not-found') && !u.startsWith('/404'))

const toEn = (cs) => {
  if (cs === '/') return '/en/'
  const [first, ...rest] = cs.replace(/^\//, '').replace(/\/$/, '').split('/')
  return `/en/${[SEG_EN[first] ?? first, ...rest].join('/')}/`
}
const toCs = (en) => {
  const rest = en.replace(/^\/en\/?/, '').replace(/\/$/, '')
  if (!rest) return '/'
  const [first, ...more] = rest.split('/')
  return `/${[SEG[first] ?? first, ...more].join('/')}/`
}
const set = new Set(urls)
const now = new Date().toISOString().slice(0, 10)
const entries = urls.sort().map((u) => {
  const isEn = u.startsWith('/en/') || u === '/en/'
  const cs = isEn ? toCs(u) : u
  const en = isEn ? u : toEn(u)
  const alts = [
    set.has(cs)
      ? `<xhtml:link rel="alternate" hreflang="cs" href="${BASE}${cs}"/>`
      : '',
    set.has(en)
      ? `<xhtml:link rel="alternate" hreflang="en" href="${BASE}${en}"/>`
      : '',
    set.has(cs)
      ? `<xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${cs}"/>`
      : '',
  ].join('')
  const depth = u.split('/').filter(Boolean).length
  const prio =
    u === '/' ? '1.0' : depth <= 1 ? '0.8' : depth === 2 ? '0.7' : '0.5'
  return `<url><loc>${BASE}${u}</loc><lastmod>${now}</lastmod><priority>${prio}</priority>${alts}</url>`
})
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml)
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`
fs.writeFileSync(path.join(OUT, 'robots.txt'), robots)
fs.writeFileSync(path.join(ROOT, 'public', 'robots.txt'), robots)
console.log(`sitemap.xml: ${entries.length} URL, robots.txt`)
