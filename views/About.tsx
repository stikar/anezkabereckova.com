import Link from 'next/link'
import '@/components/about/about.css'
import { Picture } from '@/components/Picture'
import { Prose } from '@/components/about/Section'
import { s } from '@/components/about/strings'
import { SITE, TEXTS, getPhoto, type Locale } from '@/lib/content'
import { localizePath, routes, ui } from '@/lib/i18n'

export function About({ locale }: { locale: Locale }) {
  const T = TEXTS
  const r = routes(locale)
  const portrait = getPhoto('about/portrait')
  const [pullQuote, ...restQuotes] = T.inHerWords.items
  const timeline = T.timeline.items

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-40">
        <p className="meta-label">{SITE.tagline[locale]}</p>
        <h1 className="font-display-cond ab-h1 mt-6">
          {T.intro.heading[locale]}
        </h1>

        <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6 lg:col-span-5">
            <div className="ab-portrait ab-portrait--paper max-w-[700px]">
              <Picture
                photo={portrait}
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 92vw"
                priority
                alt={s('portraitAlt', locale)}
              />
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:self-start md:pt-2">
            <dl className="ab-meta mb-10 grid grid-cols-2 gap-x-6 gap-y-4 md:mb-14">
              <div>
                <dt className="meta-label">{ui('role', locale)}</dt>
                <dd className="mt-1">{SITE.role[locale]}</dd>
              </div>
              <div>
                <dt className="meta-label">{s('city', locale)}</dt>
                <dd className="mt-1">{SITE.cityLong[locale]}</dd>
              </div>
            </dl>
            <div className="ab-intro">
              <Prose paragraphs={T.intro.p[locale]} />
            </div>
          </div>
        </div>
      </section>

      <section className="ab-quote reveal mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-40">
        <blockquote className="font-display-cond ab-quote__text">
          „{pullQuote[locale]}“
        </blockquote>
        <p className="meta-label mt-8">
          <a
            href={pullQuote.href}
            rel="noopener"
            target="_blank"
            className="link-line !text-current"
          >
            {pullQuote.source}
          </a>
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
        <h2 className="font-display-cond text-h2 reveal mb-10 md:mb-16">
          {T.about.heading[locale]}
        </h2>
        <div className="reveal ab-columns max-w-[80rem]">
          {T.about.p[locale].map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section
        className="ab-path border-t"
        style={{ borderColor: 'var(--atm-line)' }}
      >
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
          <h2 className="font-display-cond text-h2 reveal mb-10 md:mb-16">
            {ui('timeline', locale)}
          </h2>
          <ol className="ab-path__list">
            {timeline.map((it, i) => {
              const href =
                'href' in it && it.href ? localizePath(it.href, locale) : null
              const label = it[locale]
              return (
                <li key={i} className="ab-path__row reveal">
                  <span className="ab-path__n meta-label">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`ab-path__year font-display-cond ${it.year ? '' : 'ab-path__year--empty'}`}
                    aria-hidden={!it.year}
                  >
                    {it.year || '—'}
                  </span>
                  {href ? (
                    <Link href={href} className="ab-path__label link-line">
                      {label}
                    </Link>
                  ) : (
                    <span className="ab-path__label">{label}</span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="reveal md:col-span-5">
            <h2 className="font-display-cond text-h2 mb-8">
              {T.work.heading[locale]}
            </h2>
            <Prose paragraphs={T.work.p[locale]} />
          </div>
          <div className="reveal md:col-span-6 md:col-start-7">
            <h2 className="font-display-cond text-h2 mb-8">
              {T.howIWork.heading[locale]}
            </h2>
            <p className="font-display-wide mb-8 text-[1.5rem] leading-tight md:text-[2rem]">
              {T.howIWork.intro[locale]}
            </p>
            <Prose paragraphs={T.howIWork.p[locale]} />
          </div>
        </div>
      </section>

      <ol className="ab-steps">
        {T.howIWork.steps.items.map((st) => {
          const ph = getPhoto(st.photo)
          return (
            <li key={st.n} className="ab-steps__item reveal">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Picture
                  photo={ph}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  fill
                />
              </div>
              <p className="meta-label mt-4 px-1">{st.n}</p>
              <p className="mt-1 px-1 text-[1rem] leading-snug md:text-[1.0625rem]">
                {st[locale]}
              </p>
            </li>
          )
        })}
      </ol>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-28">
        <h2 className="font-display-cond text-h2 reveal mb-10 md:mb-16">
          {ui('inHerWords', locale)}
        </h2>
        <ul className="ab-words">
          {restQuotes.map((q, i) => (
            <li key={i} className="ab-words__row reveal">
              <blockquote className="font-display-wide ab-words__q">
                „{q[locale]}“
              </blockquote>
              <p className="meta-label ab-words__src">
                <a
                  href={q.href}
                  rel="noopener"
                  target="_blank"
                  className="link-line !text-current"
                >
                  {q.source}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 pb-24 pt-8 md:px-8 md:pb-36">
        <div className="reveal">
          <Link
            href={r.shows}
            className="font-display-cond text-h2 link-line inline-block"
          >
            {s('fashionShows', locale)}
          </Link>
        </div>
      </section>
    </>
  )
}
