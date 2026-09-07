import Link from 'next/link'
import type { Locale } from '@/lib/content'
import { routes, ui } from '@/lib/i18n'
import {
  GROUPS,
  ITEMS,
  HERO_QUOTES,
  DATE_RANGE,
  PROFILES,
  TYPE_LABEL,
  WAVES,
  fmtDate,
  type PressItem,
} from '@/components/press/press-data'
import { s } from '@/components/press/strings'
import '@/components/press/press.css'

function Row({ item, locale }: { item: PressItem; locale: Locale }) {
  return (
    <a
      className="press-row reveal"
      href={item.url}
      target="_blank"
      rel="noopener"
    >
      <span className="meta-label">
        {item.outlet}
        {item.date ? (
          <span className="block opacity-70">{fmtDate(item.date, locale)}</span>
        ) : null}
      </span>
      <span className="press-row-title" lang="cs">
        {item.title}
      </span>
      <span className="meta-label md:text-right">
        {TYPE_LABEL[item.type][locale]}
        {locale === 'en' ? ` ${s('czMark', locale)}` : ''}
      </span>
    </a>
  )
}

function Group({
  title,
  items,
  locale,
}: {
  title: string
  items: PressItem[]
  locale: Locale
}) {
  if (items.length === 0) return null
  return (
    <div className="mt-16">
      <h3 className="meta-label mb-4">{title}</h3>
      {items.map((i) => (
        <Row key={i.url} item={i} locale={locale} />
      ))}
      <div className="border-t" style={{ borderColor: 'var(--atm-line)' }} />
    </div>
  )
}

export function Press({ locale }: { locale: Locale }) {
  const r = routes(locale)
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-32 md:px-8 md:pt-40">
      <h1 className="meta-label">{s('pressTitle', locale)}</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
        {HERO_QUOTES.map((q) => (
          <blockquote key={q.url} className="press-hero-quote reveal" lang="cs">
            <a href={q.url} target="_blank" rel="noopener">
              „{q.title}“
            </a>
            <footer className="meta-label mt-4">— {q.outlet}</footer>
          </blockquote>
        ))}
      </div>
      <p className="meta-label mt-12">
        {ui('pressCount', locale)
          .replace('{n}', String(ITEMS.length))
          .replace('{range}', DATE_RANGE[locale])}
      </p>

      <section className="mt-28" aria-labelledby="wave">
        <h2 id="wave" className="meta-label mb-10">
          {ui('mediaWave', locale)}
        </h2>
        {WAVES.map((w) => (
          <div key={w.key} className="mb-24">
            <p className="press-month reveal">{w.label[locale]}</p>
            {w.sub[locale] ? (
              <p className="mt-3 text-atm-muted">{w.sub[locale]}</p>
            ) : null}
            <div className="mt-8">
              {w.items.map((i) => (
                <Row key={i.url} item={i} locale={locale} />
              ))}
              <div
                className="border-t"
                style={{ borderColor: 'var(--atm-line)' }}
              />
            </div>
          </div>
        ))}
      </section>

      <section
        className="mt-12"
        aria-label={locale === 'cs' ? 'Podle typu' : 'By type'}
      >
        <Group
          title={ui('interviews', locale)}
          items={GROUPS.interviews}
          locale={locale}
        />
        <Group
          title={ui('articles', locale)}
          items={GROUPS.articles}
          locale={locale}
        />
        <Group
          title={ui('videoAudio', locale)}
          items={GROUPS.videoAudio}
          locale={locale}
        />
      </section>

      <section className="mt-28">
        <h2 className="meta-label mb-4">{s('profiles', locale)}</h2>
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {PROFILES.map((p) => (
            <li key={p.url}>
              <a
                className="link-line"
                href={p.url}
                target="_blank"
                rel="noopener"
              >
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
