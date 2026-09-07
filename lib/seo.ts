import type { Metadata } from 'next'
import site from '@/content/site.json'
import type { Locale } from './content'
import { localizePath } from './i18n'

export function pageMeta(opts: {
  locale: Locale
  csPath: string
  title: string
  description?: string
  og?: string
  ogAlt?: string
  type?: 'website' | 'article'
}): Metadata {
  const { locale, csPath, title, description, og, ogAlt } = opts
  const path = localizePath(csPath, locale)
  const full = title.includes(site.name) ? title : `${title} — ${site.name}`
  const desc = description ?? site.metaDescription[locale]
  const ogImage = og ?? `/og/${locale}${csPath === '/' ? '/home' : csPath}.jpg`
  return {
    title: full,
    description: desc,
    alternates: {
      canonical: path,
      languages: {
        cs: localizePath(csPath, 'cs'),
        en: localizePath(csPath, 'en'),
        'x-default': localizePath(csPath, 'cs'),
      },
    },
    openGraph: {
      title: full,
      description: desc,
      url: path,
      siteName: site.name,
      locale: locale === 'cs' ? 'cs_CZ' : 'en_US',
      type: opts.type ?? 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt ?? full }],
    },
    twitter: {
      card: 'summary_large_image',
      title: full,
      description: desc,
      images: [ogImage],
    },
  }
}

export function personJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role[locale],
    url: site.domain,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Praha',
      addressCountry: 'CZ',
    },
    sameAs: [site.instagram, site.linkedin],
    worksFor: { '@type': 'Organization', name: 'Alpine Pro' },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Univerzita Tomáše Bati ve Zlíně',
    },
  }
}
