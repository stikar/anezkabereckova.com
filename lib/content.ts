import site from '@/content/site.json'
import texts from '@/content/texts.json'
import projectsJson from '@/content/projects.json'
import photosJson from '@/content/photos.json'
import showsJson from '@/content/shows.json'
import imagesJson from '@/content/generated/images.json'
import pressResearch from '@/content/press-research.json'

export type Locale = 'cs' | 'en'
export type L<T = string> = Record<Locale, T>

export interface ImageMeta {
  set: string
  slug: string
  width: number
  height: number
  widths: number[]
  blur: string
  dominant: string
}

export interface PhotoDef {
  slug: string
  file: string
  kind: 'look' | 'editorial' | 'transition' | 'portrait' | 'detail'
  n?: number
  side?: 'front' | 'back'
  pair?: string
  alt: string
  hero?: boolean
  card?: boolean
  wide?: boolean
  bw?: boolean
}

export interface Photo extends PhotoDef, ImageMeta {
  id: string
}

export interface GalleryBlock {
  type: 'full' | 'pair' | 'trio' | 'transition' | 'details'
  photos: string[]
}

export interface Credit {
  role: L
  name: string
  handle: string
}

export interface Project {
  slug: string
  enSlug: string
  code: string
  title: string
  subtitle: L
  group: 'selected' | 'author'
  year: string
  context: L
  meta: { label: L; value: L }[]
  atmosphere: {
    bg: string
    fg: string
    muted: string
    accent: string
    accent2: string
    dark: boolean
  }
  text: 'milano' | 'newBreath' | 'princess' | 'poisonedMind'
  hero: string
  card: string
  cardHover: string
  homeFeatured?: string
  frontBack?: boolean
  indexWords?: Record<string, L>
  credits?: Credit[]
  creditsLine?: string
  details?: string[]
  gallery: { blocks: GalleryBlock[] }
  media?: {
    world: string[]
    ceremony: { label: L; links: string[] }
  }
}

export interface PressEntry {
  url: string
  outlet: string
  title: string | null
  date: string | null
  type: 'rozhovor' | 'clanek' | 'video' | 'radio' | 'profil'
  quotes: string[]
  extra_quotes?: string[]
  mentions_vanity_fair_or_bbc?: string[] | string | null
  fetched: boolean
  statement?: string
  qa?: { q: string; a: string }[]
}

export const SITE = site
export const TEXTS = texts
export const SHOWS = showsJson.shows
export const PROJECTS = projectsJson.projects as unknown as Project[]
export const PRESS = (pressResearch as unknown as PressEntry[]).filter(
  (e) => e.fetched && e.title
)
const IMAGES = imagesJson as Record<string, ImageMeta>

const PHOTO_INDEX: Record<string, Photo> = {}
for (const [set, cfg] of Object.entries(photosJson.sets)) {
  for (const p of cfg.photos as PhotoDef[]) {
    const id = `${set}/${p.slug}`
    const meta = IMAGES[id]
    if (!meta) continue
    PHOTO_INDEX[id] = { ...p, ...meta, id }
  }
}

export function getPhoto(id: string): Photo {
  const p = PHOTO_INDEX[id]
  if (!p) throw new Error(`Neznámá fotka: ${id}`)
  return p
}

export function getPhotoOrNull(id: string): Photo | null {
  return PHOTO_INDEX[id] ?? null
}

export function projectPhotos(slug: string): Photo[] {
  return Object.values(PHOTO_INDEX).filter((p) => p.set === slug)
}

export function projectLooks(slug: string): Photo[] {
  return projectPhotos(slug)
    .filter(
      (p) => (p.kind === 'look' || p.kind === 'editorial') && p.side !== 'back'
    )
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'editorial' ? -1 : 1
      return (a.n ?? 0) - (b.n ?? 0)
    })
}

export function kindTotal(looks: Photo[], p: Photo): number {
  return looks.filter((x) => x.kind === p.kind).length
}

export function lookLabel(p: Photo, total: number): string {
  const kind = p.kind === 'editorial' ? 'EDITORIAL' : 'LOOK'
  return `${kind} ${String(p.n ?? 0).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
}

export function lookSlug(p: Photo): string {
  return `${p.kind === 'editorial' ? 'editorial' : 'look'}-${String(p.n ?? 0).padStart(2, '0')}`
}

export function getProject(slug: string): Project {
  const p = PROJECTS.find((x) => x.slug === slug || x.enSlug === slug)
  if (!p) throw new Error(`Neznámý projekt: ${slug}`)
  return p
}

export function nextProject(slug: string): Project {
  const i = PROJECTS.findIndex((x) => x.slug === slug)
  return PROJECTS[(i + 1) % PROJECTS.length]
}

export function pressByUrl(url: string): PressEntry | undefined {
  return PRESS.find((e) => e.url === url)
}

export function t<T>(v: L<T> | undefined, locale: Locale): T {
  if (!v) return '' as unknown as T
  return v[locale] ?? v.cs
}
