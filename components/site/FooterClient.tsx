'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import site from '@/content/site.json'
import { routes, switchLocalePath } from '@/lib/i18n'
import { useLocale } from './LocaleContext'

export function FooterClient({ year }: { year: number }) {
  const locale = useLocale()
  const pathname = usePathname() || '/'
  const other = locale === 'cs' ? 'en' : 'cs'
  const r = routes(locale)
  return (
    <footer
      className="border-t px-5 pb-12 pt-16 md:px-8"
      style={{ borderColor: 'var(--atm-line)' }}
    >
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-display-cond text-[2.6rem] leading-none md:text-[3.5rem]">
            {site.nameUpper}
          </p>
          <p className="mt-3 text-atm-muted">
            {site.role[locale]}, {site.city[locale]}
          </p>
        </div>
        <ul className="flex flex-col gap-2 md:col-span-3">
          <li>
            <a className="link-line" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </li>
          <li>
            <a
              className="link-line"
              href={site.instagram}
              rel="noopener"
              target="_blank"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              className="link-line"
              href={site.linkedin}
              rel="noopener"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
        </ul>
        <ul className="flex flex-col gap-2 md:col-span-3">
          <li>
            <Link className="link-line" href={r.contact} prefetch={false}>
              {locale === 'cs' ? 'Kontakt' : 'Contact'}
            </Link>
          </li>
          <li className="mt-4">
            <a
              href={switchLocalePath(pathname, other)}
              hrefLang={other}
              lang={other}
              className="meta-label link-line"
            >
              {site.footer.langs[other]}
            </a>
          </li>
        </ul>
      </div>
      <p className="meta-label mx-auto mt-14 max-w-[1600px]">
        © {year} {site.name}
      </p>
    </footer>
  )
}
