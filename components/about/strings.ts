import type { Locale } from '@/lib/content'

export const S = {
  fashionShows: { cs: 'Fashion Shows →', en: 'Fashion Shows →' },
  source: { cs: 'Zdroj', en: 'Source' },
  season: { cs: 'Sezóna', en: 'Season' },
  city: { cs: 'Město', en: 'City' },
  year: { cs: 'Rok', en: 'Year' },
  email: { cs: 'E-mail', en: 'E-mail' },
  portraitAlt: {
    cs: 'Anežka Berecková, černobílý portrét',
    en: 'Anežka Berecková, black and white portrait',
  },
} satisfies Record<string, Record<Locale, string>>

export const s = (k: keyof typeof S, l: Locale) => S[k][l]
