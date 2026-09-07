import type { Locale } from '@/lib/content'

export const HOME_UI = {
  featuredLabel: { cs: 'Vybraný projekt', en: 'Featured project' },
  moreProjects: { cs: 'Další projekty', en: 'More projects' },
  allProjects: { cs: 'Všechny projekty →', en: 'All projects →' },
  aboutLabel: { cs: 'O mně', en: 'About me' },
  heroVideoLabel: {
    cs: 'Film z fotografií kolekce Milano Cortina 2026',
    en: 'Film made from photographs of the Milano Cortina 2026 collection',
  },
  aktualne: { cs: 'Aktuálně', en: 'Now' },
} satisfies Record<string, Record<Locale, string>>

export function hui(key: keyof typeof HOME_UI, locale: Locale): string {
  return HOME_UI[key][locale]
}
