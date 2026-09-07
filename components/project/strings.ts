import type { Locale } from '@/lib/content'

const S = {
  projectsTitle: { cs: 'Projekty', en: 'Projects' },
  lookbook: { cs: 'Lookbook', en: 'Lookbook' },
  gallery: { cs: 'Galerie', en: 'Gallery' },
  source: { cs: 'Zdroj', en: 'Source' },
  openStory: { cs: 'Otevřít', en: 'Open' },
  prev: { cs: 'Předchozí', en: 'Previous' },
  next: { cs: 'Další', en: 'Next' },
  storyLabel: { cs: 'Prohlížení kolekce', en: 'Collection viewer' },
  toggleSide: { cs: 'Přepnout zepředu / zezadu', en: 'Toggle front / back' },
  linkCopied: { cs: 'Odkaz zkopírován', en: 'Link copied' },
  showLabel: { cs: 'Zobrazit popisek', en: 'Show label' },
  photoBy: { cs: 'Foto', en: 'Photo' },
  hotspotHint: { cs: 'Klepněte na kroužek', en: 'Tap a ring' },
  process: { cs: 'Proces', en: 'Process' },
} as const

export function s(key: keyof typeof S, locale: Locale): string {
  return S[key][locale]
}
