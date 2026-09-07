import type { Locale } from '@/lib/content'

export const S = {
  pressTitle: { cs: 'Zmínky & rozhovory', en: 'Mentions & interviews' },
  source: { cs: 'Zdroj', en: 'Source' },
  czMark: { cs: '', en: '(CZ)' },
  profiles: { cs: 'Profily', en: 'Profiles' },
} satisfies Record<string, Record<Locale, string>>

export const s = (k: keyof typeof S, l: Locale) => S[k][l]
