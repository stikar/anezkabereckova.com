import fs from 'node:fs'
import path from 'node:path'
import {
  PUBLIC,
  COLORS,
  SITE_URL,
  site,
  projects,
  getPhoto,
  photoFile,
  h,
  renderLayer,
  composeCard,
  isFresh,
  ensureDir,
  fmtKB,
} from './lib/common.mjs'

const SELF = new URL(import.meta.url).pathname
const OUT = path.join(PUBLIC, 'launch-kit')
const force = process.argv.includes('--force')
ensureDir(OUT)

const milano = projects[0]
const NAME = site.nameUpper
const HEROES = ['look-01', 'look-02', 'look-04'].map((s) =>
  getPhoto(`milano-cortina-2026/${s}`)
)

const mono = (text, size, color = COLORS.paper, extra = {}) =>
  h(
    'div',
    {
      style: {
        fontFamily: 'Mono',
        fontSize: size,
        letterSpacing: size * 0.14,
        textTransform: 'uppercase',
        color,
        display: 'flex',
        ...extra,
      },
    },
    text
  )
const display = (text, size, color = COLORS.paper, extra = {}) =>
  h(
    'div',
    {
      style: {
        fontFamily: 'Display',
        fontSize: size,
        lineHeight: 0.92,
        textTransform: 'uppercase',
        letterSpacing: -size * 0.01,
        color,
        display: 'flex',
        ...extra,
      },
    },
    text
  )

function layer({ w, hh, top, lines = [], nameSize, band, bottomNote }) {
  const pad = Math.round(w * 0.06)
  const bandH = Math.round(hh * 0.01)
  return h(
    'div',
    {
      style: {
        width: w,
        height: hh,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: pad,
        paddingBottom: pad + bandH,
        position: 'relative',
      },
    },
    h(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between' } },
      mono(top, Math.round(w * 0.02)),
      mono(SITE_URL, Math.round(w * 0.02))
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: Math.round(w * 0.015),
        },
      },
      ...lines.map((l) =>
        typeof l === 'string' ? mono(l, Math.round(w * 0.024)) : l
      ),
      display(NAME, nameSize, COLORS.paper, {
        marginTop: Math.round(w * 0.012),
      }),
      bottomNote
        ? mono(bottomNote, Math.round(w * 0.02), COLORS.paper, {
            marginTop: Math.round(w * 0.01),
          })
        : null
    ),
    h('div', {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: bandH,
        background: band,
        display: 'flex',
      },
    })
  )
}

const jobs = []
HEROES.forEach((photo, i) => {
  const n = i + 1
  jobs.push({
    out: path.join(OUT, `launch-square-${n}.jpg`),
    photo,
    w: 1080,
    hh: 1080,
    opts: {
      top: `${milano.title} · ${milano.code}`,
      lines: [site.tagline.cs],
      nameSize: 118,
      band: milano.atmosphere.accent,
    },
  })
  jobs.push({
    out: path.join(OUT, `launch-story-${n}.jpg`),
    photo,
    w: 1080,
    hh: 1920,
    opts: {
      top: `${milano.title} · ${milano.code}`,
      lines: [site.tagline.cs],
      nameSize: 128,
      band: milano.atmosphere.accent,
      bottomNote: `https://${SITE_URL}`,
    },
  })
})

const projectUrl = `https://${SITE_URL}/projekty/milano-cortina-2026`
for (const c of milano.credits) {
  const photo = getPhoto('milano-cortina-2026/look-01')
  const file = `collab-story-${c.handle.replace(/[^a-z0-9]+/gi, '-')}.jpg`
  jobs.push({
    out: path.join(OUT, file),
    photo,
    w: 1080,
    hh: 1920,
    opts: {
      top: `${milano.title} · ${milano.code}`,
      lines: [
        mono(`${c.role.cs}`, 24),
        display(c.name, 84),
        mono(`@${c.handle}`, 28),
      ],
      nameSize: 96,
      band: milano.atmosphere.accent,
      bottomNote: projectUrl,
    },
  })
}

let made = 0
for (const j of jobs) {
  if (!force && isFresh(j.out, [SELF, photoFile(j.photo)])) continue
  const lay = await renderLayer(
    layer({ w: j.w, hh: j.hh, ...j.opts }),
    j.w,
    j.hh
  )
  const buf = await composeCard({
    photo: j.photo,
    width: j.w,
    height: j.hh,
    layer: lay,
    quality: 86,
    darken: 0.4,
    position: j.photo.height > j.photo.width ? 0.1 : 'attention',
  })
  fs.writeFileSync(j.out, buf)
  made++
}

const readme = [
  `Launch kit — ${site.name} — https://${SITE_URL}`,
  '',
  'Grafiky pro Instagram (den spuštění webu). Fotky: Kristína Opálková @opaaalek.',
  '',
  ...jobs.map(
    (j) =>
      `${path.basename(j.out)}  (${j.w}×${j.hh}) ${fmtKB(fs.statSync(j.out).size)}`
  ),
  '',
  'collab-story-*: jedna story pro každého spolupracovníka z kreditů (jméno, handle, odkaz na projekt).',
  `Kredity: ${milano.creditsLine}`,
].join('\n')
fs.writeFileSync(path.join(OUT, 'README.txt'), readme)
console.log(
  `Launch kit: ${made} vygenerováno, ${jobs.length - made} beze změny (${jobs.length} grafik).`
)
