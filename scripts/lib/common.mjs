import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
)
export const PUBLIC = path.join(ROOT, 'public')
export const FONTS_DIR = path.join(ROOT, 'assets', 'fonts')

export const COLORS = {
  paper: '#F4F2EE',
  ink: '#0E0E0E',
  meta: '#7A7A7A',
}

export const SITE_URL = 'anezkabereckova.com'

const readJson = (rel) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'))

export const site = readJson('content/site.json')
export const texts = readJson('content/texts.json')
export const projects = readJson('content/projects.json').projects
export const photosManifest = readJson('content/photos.json')
export const images = readJson('content/generated/images.json')
export const shows = readJson('content/shows.json').shows

export const PHOTOS = {}
for (const [set, cfg] of Object.entries(photosManifest.sets)) {
  for (const p of cfg.photos) {
    const id = `${set}/${p.slug}`
    if (images[id]) PHOTOS[id] = { ...p, ...images[id], id }
  }
}

export function getPhoto(id) {
  const p = PHOTOS[id]
  if (!p) throw new Error(`Neznámá fotka: ${id}`)
  return p
}

export function projectLooks(slug) {
  return Object.values(PHOTOS)
    .filter(
      (p) =>
        p.set === slug &&
        (p.kind === 'look' || p.kind === 'editorial') &&
        p.side !== 'back'
    )
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'editorial' ? -1 : 1
      return (a.n ?? 0) - (b.n ?? 0)
    })
}

export const pad2 = (n) => String(n ?? 0).padStart(2, '0')

export function lookLabel(p, total) {
  const kind = p.kind === 'editorial' ? 'EDITORIAL' : 'LOOK'
  return `${kind} ${pad2(p.n)} / ${pad2(total)}`
}

export function kindTotal(looks, p) {
  return looks.filter((x) => x.kind === p.kind).length
}

export function lookSlug(p) {
  return `${p.kind === 'editorial' ? 'editorial' : 'look'}-${pad2(p.n)}`
}

export function photoFile(p, maxW = 2400, ext = 'webp') {
  const w =
    [...p.widths].filter((x) => x <= maxW).sort((a, b) => b - a)[0] ??
    p.widths[0]
  return path.join(PUBLIC, 'images', p.set, `${p.slug}-${w}.${ext}`)
}

const fontCache = new Map()
export function fontBuffer(name) {
  if (!fontCache.has(name)) {
    fontCache.set(name, fs.readFileSync(path.join(FONTS_DIR, `${name}.ttf`)))
  }
  return fontCache.get(name)
}

export const FONT_FILES = {
  display: path.join(FONTS_DIR, 'Archivo-DisplayCondBold.ttf'),
  displaySemi: path.join(FONTS_DIR, 'Archivo-DisplayCondSemi.ttf'),
  regular: path.join(FONTS_DIR, 'Archivo-Regular.ttf'),
  medium: path.join(FONTS_DIR, 'Archivo-Medium.ttf'),
  mono: path.join(FONTS_DIR, 'JetBrainsMono-Static.ttf'),
}

export function satoriFonts() {
  return [
    {
      name: 'Display',
      data: fontBuffer('Archivo-DisplayCondBold'),
      weight: 700,
      style: 'normal',
    },
    {
      name: 'DisplaySemi',
      data: fontBuffer('Archivo-DisplayCondSemi'),
      weight: 600,
      style: 'normal',
    },
    {
      name: 'Text',
      data: fontBuffer('Archivo-Regular'),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'TextMedium',
      data: fontBuffer('Archivo-Medium'),
      weight: 500,
      style: 'normal',
    },
    {
      name: 'Mono',
      data: fontBuffer('JetBrainsMono-Static'),
      weight: 400,
      style: 'normal',
    },
  ]
}

export const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children },
})

export async function renderLayer(element, width, height) {
  const svg = await satori(element, { width, height, fonts: satoriFonts() })
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: width } })
  return r.render().asPng()
}

export async function composeCard({
  photo,
  width,
  height,
  layer,
  darken = 0.35,
  gradient = true,
  format = 'jpeg',
  quality = 82,
  position = 'attention',
}) {
  let base
  if (typeof position === 'number') {
    const src = sharp(photoFile(photo, Math.max(width, height) * 1.2))
    const meta = await src.metadata()
    const scale = Math.max(width / meta.width, height / meta.height)
    const sw = Math.ceil(meta.width * scale)
    const sh = Math.ceil(meta.height * scale)
    const top = Math.max(
      0,
      Math.min(sh - height, Math.round((sh - height) * position))
    )
    const left = Math.max(0, Math.round((sw - width) / 2))
    base = sharp(
      await src.resize({ width: sw, height: sh }).toBuffer()
    ).extract({
      left,
      top,
      width,
      height,
    })
  } else {
    base = sharp(photoFile(photo, Math.max(width, height) * 1.2)).resize({
      width,
      height,
      fit: 'cover',
      position,
    })
  }
  base = base.toColorspace('srgb')
  const layers = []
  if (gradient) {
    const g = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#000" stop-opacity="${(darken * 0.5).toFixed(2)}"/>
          <stop offset="0.45" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity="${darken.toFixed(2)}"/>
        </linearGradient></defs>
        <rect width="100%" height="100%" fill="url(#g)"/></svg>`
    )
    layers.push({ input: g, top: 0, left: 0 })
  }
  if (layer) layers.push({ input: layer, top: 0, left: 0 })
  base = base.composite(layers)
  return format === 'png'
    ? base.png().toBuffer()
    : base.jpeg({ quality, mozjpeg: true }).toBuffer()
}

export function isFresh(out, inputs) {
  if (!fs.existsSync(out)) return false
  const o = fs.statSync(out).mtimeMs
  return inputs.every((f) => fs.existsSync(f) && fs.statSync(f).mtimeMs < o)
}

export function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

export async function pool(items, limit, fn) {
  const queue = [...items]
  let active = 0
  let done = 0
  return new Promise((resolve, reject) => {
    const next = () => {
      if (queue.length === 0 && active === 0) return resolve(done)
      while (active < limit && queue.length) {
        const it = queue.shift()
        active++
        fn(it)
          .then(() => {
            active--
            done++
            next()
          })
          .catch(reject)
      }
    }
    next()
  })
}

export const fmtMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`
export const fmtKB = (bytes) => `${Math.round(bytes / 1024)} kB`
