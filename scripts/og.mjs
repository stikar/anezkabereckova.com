import fs from 'node:fs'
import path from 'node:path'
import {
  PUBLIC,
  COLORS,
  SITE_URL,
  site,
  projects,
  getPhoto,
  projectLooks,
  lookLabel,
  kindTotal,
  lookSlug,
  photoFile,
  h,
  renderLayer,
  composeCard,
  isFresh,
  ensureDir,
  pool,
  fmtKB,
} from './lib/common.mjs'

const SELF = new URL(import.meta.url).pathname
const COMMON = path.join(path.dirname(SELF), 'lib', 'common.mjs')
const OUT = path.join(PUBLIC, 'og')
const NAME = site.nameUpper
const force = process.argv.includes('--force')

const mono = (text, size, color) =>
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
      },
    },
    text
  )

const display = (text, size, color, extra = {}) =>
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

function cardLayer({
  w,
  h: hh,
  top,
  headline,
  sub,
  band,
  fg = COLORS.paper,
  nameSize,
}) {
  const pad = Math.round(w * 0.05)
  const bandH = Math.round(hh * 0.012)
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
      {
        style: { display: 'flex', justifyContent: 'space-between', color: fg },
      },
      mono(top ?? '', Math.round(w * 0.018), fg),
      mono(SITE_URL, Math.round(w * 0.018), fg)
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: Math.round(w * 0.012),
        },
      },
      headline ? display(headline, Math.round(w * 0.075), fg) : null,
      sub ? mono(sub, Math.round(w * 0.02), fg) : null,
      display(NAME, nameSize ?? Math.round(w * 0.11), fg, {
        marginTop: Math.round(w * 0.01),
      })
    ),
    h('div', {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: bandH,
        background: band ?? COLORS.paper,
        display: 'flex',
      },
    })
  )
}

async function makeCard({
  out,
  photo,
  w,
  hh,
  layerOpts,
  inputs = [],
  position,
}) {
  if (!force && isFresh(out, [photoFile(photo), SELF, COMMON, ...inputs]))
    return false
  ensureDir(path.dirname(out))
  const layer = await renderLayer(cardLayer({ w, h: hh, ...layerOpts }), w, hh)

  const pos =
    position ?? (photo.height > photo.width && w > hh ? 0.16 : 'attention')
  const buf = await composeCard({
    photo,
    width: w,
    height: hh,
    layer,
    position: pos,
  })
  fs.writeFileSync(out, buf)
  return true
}

const jobs = []
const L = { cs: 'cs', en: 'en' }
const milano = projects[0]

for (const locale of Object.values(L)) {
  const dir = path.join(OUT, locale)
  const roleLine = site.tagline[locale]
  const pages = [
    {
      file: 'home',
      photo: 'milano-cortina-2026/look-01',
      top: roleLine,
      band: milano.atmosphere.bg,
    },
    {
      file: 'projekty',
      photo: 'milano-cortina-2026/look-02',
      top: locale === 'cs' ? 'Projekty' : 'Projects',
      band: milano.atmosphere.bg,
    },
    {
      file: 'prehlidky',
      photo: 'princess-fw19/look-06',
      top: locale === 'cs' ? 'Přehlídky' : 'Shows',
      band: projects[2].atmosphere.bg,
      position: 'centre',
    },
    {
      file: 'o-mne',
      photo: 'about/portrait',
      top: locale === 'cs' ? 'O mně' : 'About',
      band: COLORS.ink,
      position: 0.12,
    },
    {
      file: 'press',
      photo: 'milano-cortina-2026/look-04',
      top: 'Press',
      band: milano.atmosphere.accent,
    },
    {
      file: 'kontakt',
      photo: 'about/portrait',
      top: locale === 'cs' ? 'Kontakt' : 'Contact',
      band: COLORS.ink,
      position: 0.12,
    },
  ]
  for (const pg of pages) {
    jobs.push({
      out: path.join(dir, `${pg.file}.jpg`),
      photo: getPhoto(pg.photo),
      w: 1200,
      hh: 630,
      position: pg.position,
      layerOpts: {
        top: pg.top,
        sub: pg.file === 'home' ? null : roleLine,
        band: pg.band,
      },
    })
  }

  for (const p of projects) {
    const hero = getPhoto(`${p.slug}/${p.hero}`)
    jobs.push({
      out: path.join(dir, 'projekty', `${p.slug}.jpg`),
      photo: hero,
      w: 1200,
      hh: 630,
      layerOpts: {
        top: p.code,
        headline: p.title,
        sub: p.subtitle[locale],
        band: p.atmosphere.accent,
        nameSize: 60,
      },
    })
    const looks = projectLooks(p.slug)
    for (const lk of looks) {
      const label = `${lookLabel(lk, kindTotal(looks, lk))} · ${p.code}`
      const slug = lookSlug(lk)
      jobs.push({
        out: path.join(dir, 'projekty', p.slug, `${slug}.jpg`),
        photo: lk,
        w: 1200,
        hh: 630,
        layerOpts: {
          top: p.title,
          headline: label,
          band: p.atmosphere.accent,
          nameSize: 60,
        },
      })
      jobs.push({
        out: path.join(dir, 'projekty', p.slug, `${slug}-story.jpg`),
        photo: lk,
        w: 1080,
        hh: 1920,
        layerOpts: {
          top: p.title,
          headline: label,
          band: p.atmosphere.accent,
          nameSize: 118,
        },
      })
    }
  }
}

let made = 0
await pool(jobs, 4, async (j) => {
  if (await makeCard(j)) made++
})
const total = jobs.length
const bytes = jobs.reduce(
  (s, j) => s + (fs.existsSync(j.out) ? fs.statSync(j.out).size : 0),
  0
)
console.log(
  `OG: ${made} vygenerováno, ${total - made} beze změny, ${total} celkem (${fmtKB(bytes)}).`
)
