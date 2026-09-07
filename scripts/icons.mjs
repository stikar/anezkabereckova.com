import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import {
  PUBLIC,
  COLORS,
  site,
  h,
  renderLayer,
  ensureDir,
} from './lib/common.mjs'

const ICONS = path.join(PUBLIC, 'icons')
ensureDir(ICONS)

async function monogram(
  size,
  { pad = 0.14, bg = COLORS.paper, fg = COLORS.ink } = {}
) {
  const font = Math.round(size * (1 - 2 * pad) * 0.86)
  const el = h(
    'div',
    {
      style: {
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
      },
    },
    h(
      'div',
      {
        style: {
          fontFamily: 'Display',
          fontSize: font,
          lineHeight: 1,
          letterSpacing: -font * 0.02,
          color: fg,
          display: 'flex',
          paddingBottom: Math.round(font * 0.06),
        },
      },
      site.monogram
    )
  )
  return renderLayer(el, size, size)
}

import satori from 'satori'
import { satoriFonts } from './lib/common.mjs'
const svg = await satori(
  h(
    'div',
    {
      style: {
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.paper,
      },
    },
    h(
      'div',
      {
        style: {
          fontFamily: 'Display',
          fontSize: 44,
          lineHeight: 1,
          color: COLORS.ink,
          display: 'flex',
          paddingBottom: 3,
        },
      },
      site.monogram
    )
  ),
  { width: 64, height: 64, fonts: satoriFonts() }
)
fs.writeFileSync(path.join(PUBLIC, 'favicon.svg'), svg)

const png32 = await sharp(await monogram(64))
  .resize(32)
  .png()
  .toBuffer()

function ico(png, size) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size === 256 ? 0 : size, 0)
  entry.writeUInt8(size === 256 ? 0 : size, 1)
  entry.writeUInt8(0, 2)
  entry.writeUInt8(0, 3)
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(22, 12)
  return Buffer.concat([header, entry, png])
}
fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), ico(png32, 32))
fs.writeFileSync(
  path.join(PUBLIC, 'apple-touch-icon.png'),
  await sharp(await monogram(180, { pad: 0.16 }))
    .png()
    .toBuffer()
)
fs.writeFileSync(
  path.join(ICONS, 'icon-192.png'),
  await sharp(await monogram(192))
    .png()
    .toBuffer()
)
fs.writeFileSync(
  path.join(ICONS, 'icon-512.png'),
  await sharp(await monogram(512))
    .png()
    .toBuffer()
)
fs.writeFileSync(
  path.join(ICONS, 'maskable-512.png'),
  await sharp(await monogram(512, { pad: 0.24 }))
    .png()
    .toBuffer()
)

const manifest = {
  name: site.name,
  short_name: site.monogram,
  description: site.metaDescription.cs,
  lang: 'cs',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: COLORS.paper,
  theme_color: COLORS.paper,
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    {
      src: '/icons/maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
}
fs.writeFileSync(
  path.join(PUBLIC, 'manifest.webmanifest'),
  JSON.stringify(manifest, null, 2)
)
console.log(
  'Ikony: favicon.svg, favicon.ico, apple-touch-icon.png, icons/*, manifest.webmanifest'
)
