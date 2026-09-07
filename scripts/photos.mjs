import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'sources')
const OUT = path.join(ROOT, 'public', 'images')
const GEN = path.join(ROOT, 'content', 'generated')
const CACHE_FILE = path.join(GEN, '.photo-cache.json')
const WIDTHS = [640, 1080, 1600, 2400]

const avifQ = (w) => (w >= 2400 ? 50 : w >= 1600 ? 52 : w >= 1080 ? 54 : 60)
const WEBP_Q = 80

const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'content', 'photos.json'), 'utf8')
)
const nfc = (s) => s.normalize('NFC').replace(/\u00a0/g, ' ')

function resolveSource(dir, file) {
  const parts = nfc(path.join(dir, file)).split('/')
  let cur = SRC
  for (const p of parts) {
    const entries = fs.readdirSync(cur)
    const hit = entries.find((e) => nfc(e) === p)
    if (!hit) throw new Error(`Zdroj nenalezen: ${path.join(dir, file)}`)
    cur = path.join(cur, hit)
  }
  return cur
}

fs.mkdirSync(GEN, { recursive: true })
const cache = fs.existsSync(CACHE_FILE)
  ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
  : {}
const images = fs.existsSync(path.join(GEN, 'images.json'))
  ? JSON.parse(fs.readFileSync(path.join(GEN, 'images.json'), 'utf8'))
  : {}
const photoMap = {}
const force = process.argv.includes('--force')
const only = process.argv.find((a) => a.startsWith('--set='))?.slice(6)

let done = 0
let skipped = 0
for (const [set, cfg] of Object.entries(manifest.sets)) {
  if (only && set !== only) continue
  fs.mkdirSync(path.join(OUT, set), { recursive: true })
  for (const p of cfg.photos) {
    const key = `${set}/${p.slug}`
    const src = resolveSource(cfg.dir, p.file)
    photoMap[key] = path.relative(SRC, src)
    const st = fs.statSync(src)
    const sig = createHash('md5')
      .update(
        JSON.stringify({
          m: st.mtimeMs,
          s: st.size,
          crop: p.crop ?? null,
          maxWidth: p.maxWidth ?? null,
          v: 3,
        })
      )
      .digest('hex')
    const allExist = WIDTHS.every(
      (w) =>
        fs.existsSync(path.join(OUT, set, `${p.slug}-${w}.avif`)) ||
        (images[key] && !images[key].widths.includes(w))
    )
    if (!force && cache[key] === sig && images[key] && allExist) {
      skipped++
      continue
    }

    let img = sharp(src, { failOn: 'none' }).rotate()
    const meta = await img.metadata()
    let width = meta.width
    let height = meta.height
    if (meta.orientation && meta.orientation >= 5) {
      ;[width, height] = [height, width]
    }
    if (p.crop) {
      const cw = Math.round(width * p.crop.width)
      const left = Math.round(width * p.crop.left)
      const top = Math.round(height * p.crop.top)
      img = img.extract({ left, top, width: cw, height: cw })
      width = cw
      height = cw
    }
    img = img.withMetadata({ orientation: undefined }).toColorspace('srgb')
    const base = img.clone().toBuffer()
    const buf = await base
    const maxW = Math.min(width, p.maxWidth ?? Infinity)
    const widths = WIDTHS.filter((w) => w <= maxW)
    if (widths.length === 0 || widths[widths.length - 1] < maxW) {
      if (maxW < 2400) widths.push(Math.round(maxW))
    }
    for (const w of widths) {
      const resized = sharp(buf).resize({ width: w, withoutEnlargement: true })
      await resized
        .clone()
        .avif({ quality: avifQ(w), effort: 6 })
        .toFile(path.join(OUT, set, `${p.slug}-${w}.avif`))
      await resized
        .clone()
        .webp({ quality: WEBP_Q })
        .toFile(path.join(OUT, set, `${p.slug}-${w}.webp`))
    }
    const blur = await sharp(buf)
      .resize({ width: 16 })
      .webp({ quality: 40 })
      .toBuffer()
    images[key] = {
      set,
      slug: p.slug,
      width,
      height,
      widths,
      blur: `data:image/webp;base64,${blur.toString('base64')}`,
      dominant: await dominant(buf),
    }
    cache[key] = sig
    done++
    console.log(`✓ ${key} ${width}×${height} [${widths.join(',')}]`)
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
    fs.writeFileSync(
      path.join(GEN, 'images.json'),
      JSON.stringify(images, null, 2)
    )
  }
}

async function dominant(buf) {
  const { dominant: d } = await sharp(buf).stats()
  return `#${[d.r, d.g, d.b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

fs.writeFileSync(
  path.join(SRC, 'photo-map.json'),
  JSON.stringify(photoMap, null, 2)
)
fs.writeFileSync(path.join(GEN, 'images.json'), JSON.stringify(images, null, 2))
console.log(`Hotovo: ${done} zpracováno, ${skipped} přeskočeno.`)
