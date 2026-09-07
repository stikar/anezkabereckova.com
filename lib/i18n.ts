import type { Locale } from './content'
import site from '@/content/site.json'

export const LOCALES: Locale[] = ['cs', 'en']

const SEGMENTS: Record<string, string> = {
  projekty: 'projects',
  prehlidky: 'shows',
  'o-mne': 'about',
  press: 'press',
  kontakt: 'contact',
}

export function localizePath(csPath: string, locale: Locale): string {
  if (locale === 'cs') return csPath
  if (csPath === '/') return '/en'
  const [first, ...rest] = csPath.replace(/^\//, '').split('/')
  const seg = SEGMENTS[first] ?? first
  return `/en/${[seg, ...rest].join('/')}`
}

export function withSlash(p: string): string {
  return p.endsWith('/') ? p : `${p}/`
}

export function switchLocalePath(path: string, to: Locale): string {
  const clean = path.replace(/\/$/, '') || '/'
  if (to === 'en') {
    if (clean.startsWith('/en')) return withSlash(clean)
    return withSlash(localizePath(clean, 'en'))
  }
  if (!clean.startsWith('/en')) return withSlash(clean)
  const rest = clean.replace(/^\/en\/?/, '')
  if (!rest) return '/'
  const [first, ...more] = rest.split('/')
  const cs =
    Object.entries(SEGMENTS).find(([, en]) => en === first)?.[0] ?? first
  return withSlash(`/${[cs, ...more].join('/')}`)
}

export function routes(locale: Locale) {
  const r = site.routes
  return {
    home: r.home[locale],
    projects: r.projects[locale],
    shows: r.shows[locale],
    about: r.about[locale],
    press: r.press[locale],
    contact: r.contact[locale],
    project: (slug: string) => `${r.projects[locale]}/${slug}`,
    look: (slug: string, look: string) =>
      `${r.projects[locale]}/${slug}/${look}`,
  }
}

export const UI = {
  scrollHint: { cs: '↓ Milano Cortina 2026', en: '↓ Milano Cortina 2026' },
  viewCollection: { cs: 'Prohlédnout kolekci →', en: 'View the collection →' },
  moreAbout: { cs: 'Více o mně →', en: 'More about me →' },
  nextProject: { cs: 'Další projekt', en: 'Next project' },
  visual: { cs: 'Visual', en: 'Visual' },
  index: { cs: 'Index', en: 'Index' },
  credits: { cs: 'Kredity', en: 'Credits' },
  shareLook: { cs: 'Sdílet look', en: 'Share look' },
  close: { cs: 'Zavřít', en: 'Close' },
  menu: { cs: 'Menu', en: 'Menu' },
  front: { cs: 'Zepředu', en: 'Front' },
  back: { cs: 'Zezadu', en: 'Back' },
  inMedia: { cs: 'V médiích', en: 'In the media' },
  whatTheWorldSaid: { cs: 'Co řekl svět', en: 'What the world said' },
  anatomy: { cs: 'Anatomie kolekce', en: 'Anatomy of the collection' },
  pieces: { cs: 'Kusy kolekce', en: 'Pieces of the collection' },
  fromPreissig: {
    cs: 'Od Preissiga k oděvu',
    en: 'From Preissig to the garment',
  },
  detail: { cs: 'Detail', en: 'Detail' },
  inHerWords: { cs: 'Jejími slovy', en: 'In her words' },
  timeline: { cs: 'Cesta', en: 'Path' },
  copy: { cs: 'Kopírovat', en: 'Copy' },
  copied: { cs: 'Zkopírováno', en: 'Copied' },
  interviews: { cs: 'Rozhovory', en: 'Interviews' },
  articles: { cs: 'Články', en: 'Articles' },
  videoAudio: { cs: 'Video & audio', en: 'Video & audio' },
  profiles: { cs: 'Rozhovory a profily', en: 'Interviews and profiles' },
  mediaWave: { cs: 'Mediální vlna', en: 'Media wave' },
  pressCount: {
    cs: '{n} mediálních výstupů · {range}',
    en: '{n} media appearances · {range}',
  },
  notFound: {
    cs: 'TENHLE LOOK JEŠTĚ NEEXISTUJE.',
    en: 'THIS LOOK DOES NOT EXIST YET.',
  },
  projectsLink: { cs: 'Projekty →', en: 'Projects →' },
  homeLink: { cs: 'Domů →', en: 'Home →' },
  role: { cs: 'Role', en: 'Role' },
  photographer: { cs: 'Foto', en: 'Photo' },
  language: { cs: 'Jazyk', en: 'Language' },
  writeMe: { cs: 'Napište mi', en: 'Write to me' },
  playPause: { cs: 'Přehrát / pozastavit', en: 'Play / pause' },
} satisfies Record<string, Record<Locale, string>>

export function ui(key: keyof typeof UI, locale: Locale): string {
  return UI[key][locale]
}
