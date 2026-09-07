import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public', 'video')
const TMP = path.join(ROOT, '.cache', 'hero')
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(TMP, { recursive: true })

const SEQ = ['look-01', 'motion-01', 'look-04', 'look-02', 'look-01']
const SET = 'milano-cortina-2026'
const CLIP = 4
const FADE = 1.5
const FPS = 24
const ZOOM = 0.06

const variants = [
  { name: 'hero-16x9', w: 1920, h: 1080 },
  { name: 'hero-9x16', w: 1080, h: 1920 },
]

for (const v of variants) {
  const frames = CLIP * FPS
  const inputs = []
  const filters = []
  SEQ.forEach((slug, i) => {
    const src = path.join(ROOT, 'public', 'images', SET, `${slug}-2400.webp`)
    const srcFallback = path.join(
      ROOT,
      'public',
      'images',
      SET,
      `${slug}-1600.webp`
    )
    const use = fs.existsSync(src) ? src : srcFallback
    const png = path.join(TMP, `${v.name}-${i}.png`)
    if (!fs.existsSync(png)) {
      execSharp(
        use,
        png,
        v.w * 1.5,
        v.h * 1.5,
        v.w > v.h ? 'north' : 'attention'
      )
    }
    inputs.push(
      '-loop',
      '1',
      '-framerate',
      String(FPS),
      '-t',
      String(CLIP),
      '-i',
      png
    )
    const zoomExpr =
      i % 2 === 0
        ? `1+${ZOOM}*on/${frames}`
        : `${1 + ZOOM}-${ZOOM}*on/${frames}`
    filters.push(
      `[${i}:v]zoompan=z='${zoomExpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${v.w}x${v.h}:fps=${FPS},format=yuv420p,setsar=1[c${i}]`
    )
  })

  let prev = 'c0'
  let offset = CLIP - FADE
  for (let i = 1; i < SEQ.length; i++) {
    const out = i === SEQ.length - 1 ? 'x' : `x${i}`
    filters.push(
      `[${prev}][c${i}]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(3)}[${out}]`
    )
    prev = out
    offset += CLIP - FADE
  }
  const total = offset + FADE

  filters.push(
    `[x]trim=duration=${(total - (CLIP - FADE) + 0.001).toFixed(3)},noise=alls=6:allf=t+u,vignette=PI/5,format=yuv420p[v]`
  )
  const graph = filters.join(';')
  const webm = path.join(OUT, `${v.name}.webm`)
  const mp4 = path.join(OUT, `${v.name}.mp4`)
  console.log(`▶ ${v.name}`)
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel',
      'error',
      ...inputs,
      '-filter_complex',
      graph,
      '-map',
      '[v]',
      '-an',
      '-c:v',
      'libvpx-vp9',
      '-b:v',
      '0',
      '-crf',
      '38',
      '-row-mt',
      '1',
      '-deadline',
      'good',
      '-cpu-used',
      '2',
      '-pix_fmt',
      'yuv420p',
      webm,
    ],
    { stdio: 'inherit' }
  )
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel',
      'error',
      ...inputs,
      '-filter_complex',
      graph,
      '-map',
      '[v]',
      '-an',
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '26',
      '-profile:v',
      'high',
      '-movflags',
      '+faststart',
      '-pix_fmt',
      'yuv420p',
      mp4,
    ],
    { stdio: 'inherit' }
  )

  const poster = path.join(OUT, `${v.name}-poster.avif`)
  await sharp(path.join(TMP, `${v.name}-0.png`))
    .resize({ width: v.w, height: v.h, fit: 'cover' })
    .avif({ quality: 50 })
    .toFile(poster)
  for (const f of [webm, mp4, poster]) {
    console.log(
      `  ${path.basename(f)} ${(fs.statSync(f).size / 1024 / 1024).toFixed(2)} MB`
    )
  }
}

function execSharp(src, dst, w, h, position) {
  execFileSync(process.execPath, [
    '-e',
    `require('sharp')(process.argv[1]).resize({width:${Math.round(w)},height:${Math.round(h)},fit:'cover',position:'${position}'}).png().toFile(process.argv[2]).then(()=>{})`,
    src,
    dst,
  ])
}
