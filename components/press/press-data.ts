import { PRESS, pressByUrl, type PressEntry, type Locale } from '@/lib/content'

export interface PressItem {
  url: string
  outlet: string
  title: string
  date: string | null
  type: PressEntry['type']
}

const BLESK_KEEP =
  'https://tv.blesk.cz/video/9737634/jak-spravne-vynest-olympijskou-kolekci-sportovci-maji-od-navrharky-manual.html'
const BLESK_DROP =
  'https://tv.blesk.cz/video/9737634/epicentrum-anezka-bereckova.html'

function dateFromUrl(url: string): string | null {
  const m =
    url.match(/_(\d{2})(\d{2})(\d{2})\d{4}_/) ??
    url.match(/\.A(\d{2})(\d{2})(\d{2})_/)
  if (!m) return null
  return `20${m[1]}-${m[2]}-${m[3]}`
}

export const ITEMS: PressItem[] = PRESS.filter(
  (e) => e.type !== 'profil' && e.url !== BLESK_DROP && e.title
).map((e) => ({
  url: e.url,
  outlet: e.outlet,
  title: e.title as string,
  date: e.date ?? dateFromUrl(e.url),
  type: e.type,
}))

const MONTHS: Record<Locale, string[]> = {
  cs: [
    'leden',
    'únor',
    'březen',
    'duben',
    'květen',
    'červen',
    'červenec',
    'srpen',
    'září',
    'říjen',
    'listopad',
    'prosinec',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
}
const monthYear = (d: string, l: Locale) =>
  `${MONTHS[l][Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}`
const DATED = ITEMS.map((i) => i.date)
  .filter((d): d is string => !!d)
  .sort()

export const DATE_RANGE: Record<Locale, string> = {
  cs: `${monthYear(DATED[0], 'cs')} – ${monthYear(DATED[DATED.length - 1], 'cs')}`,
  en: `${monthYear(DATED[0], 'en')} – ${monthYear(DATED[DATED.length - 1], 'en')}`,
}

export type WaveKey = 'nov2025' | 'feb2026' | 'undated'

export interface Wave {
  key: WaveKey
  label: Record<Locale, string>
  sub: Record<Locale, string>
  items: PressItem[]
}

const UNDATED_WAVE: Record<string, WaveKey> = {
  'https://www.dvtv.cz/videos/s-nemci-si-nas-nespletou-nemame-cernou-barvu-ale-tmave-modrou-na-kazdem-kolekce-lichotive-nevypada-rika-jeji-autorka':
    'nov2025',
}

function waveOf(d: string | null, url?: string): WaveKey {
  if (!d) return (url && UNDATED_WAVE[url]) || 'undated'
  if (d >= '2025-10-01' && d <= '2025-12-31') return 'nov2025'
  if (d >= '2026-01-01') return 'feb2026'
  return 'undated'
}

const byDate = (a: PressItem, b: PressItem) =>
  (a.date ?? '').localeCompare(b.date ?? '')

export const WAVES: Wave[] = (
  [
    {
      key: 'nov2025' as const,
      label: { cs: 'Říjen – prosinec 2025', en: 'October – December 2025' },
      sub: {
        cs: 'představení kolekce',
        en: 'the collection unveiled',
      },
      items: ITEMS.filter((i) => waveOf(i.date, i.url) === 'nov2025').sort(
        byDate
      ),
    },
    {
      key: 'feb2026' as const,
      label: { cs: 'Únor 2026', en: 'February 2026' },
      sub: { cs: 'hry', en: 'the Games' },
      items: ITEMS.filter((i) => waveOf(i.date, i.url) === 'feb2026').sort(
        byDate
      ),
    },
    {
      key: 'undated' as const,
      label: { cs: 'Rozhovory a profily', en: 'Interviews and profiles' },
      sub: { cs: '', en: '' },
      items: ITEMS.filter((i) => waveOf(i.date, i.url) === 'undated'),
    },
  ] satisfies Wave[]
).filter((w) => w.items.length > 0)

export const GROUPS = {
  interviews: ITEMS.filter((i) => i.type === 'rozhovor').sort(byDate),
  articles: ITEMS.filter((i) => i.type === 'clanek').sort(byDate),
  videoAudio: ITEMS.filter(
    (i) => i.type === 'video' || i.type === 'radio'
  ).sort(byDate),
}

export const HERO_QUOTES: PressItem[] = [
  'https://www.seznamzpravy.cz/clanek/sport-olympiada-nastupova-kolekce-ceskych-olympioniku-patrila-podle-vanity-fair-k-nejlepsim-298382',
  'https://www.olympijskytym.cz/article/ceska-nastupova-kolekce-opet-dobyla-svet-barvy-a-odvahu-chvali-vanity-fair-i-bbc',
].flatMap((u) => {
  const e = pressByUrl(u)
  return e && e.title
    ? [{ url: u, outlet: e.outlet, title: e.title, date: e.date, type: e.type }]
    : []
})

export const PROFILES = [
  { label: 'Instagram', url: 'https://www.instagram.com/anezkabereckova/' },
  {
    label: 'LinkedIn',
    url: 'https://cz.linkedin.com/in/ane%C5%BEka-bereckov%C3%A1-b8370828a',
  },
  {
    label: 'CzechDesign',
    url: 'https://www.czechdesign.cz/tags/anezka-bereckova',
  },
]

export const TYPE_LABEL: Record<PressEntry['type'], Record<Locale, string>> = {
  rozhovor: { cs: 'rozhovor', en: 'interview' },
  clanek: { cs: 'článek', en: 'article' },
  video: { cs: 'video', en: 'video' },
  radio: { cs: 'rádio', en: 'radio' },
  profil: { cs: 'profil', en: 'profile' },
}

export function fmtDate(d: string | null, locale: Locale): string {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return locale === 'cs' ? `${+day}. ${+m}. ${y}` : `${y}-${m}-${day}`
}
