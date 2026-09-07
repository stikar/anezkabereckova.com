import Link from 'next/link'
import '@/components/about/about.css'
import { Picture } from '@/components/Picture'
import { Prose } from '@/components/about/Section'
import { s } from '@/components/about/strings'
import { SHOWS, TEXTS, getPhoto, type Locale } from '@/lib/content'
import { routes } from '@/lib/i18n'

function showParagraphs(
  show: (typeof SHOWS)[number],
  locale: Locale
): string[] {
  if (show.textKey === 'shows.mbpfw') {
    const all = TEXTS.shows.mbpfw[locale]
    const idx =
      'textParagraphs' in show ? (show.textParagraphs as number[]) : []
    return idx.map((i) => all[i])
  }
  if (show.textKey === 'shows.fashionLive')
    return [TEXTS.shows.fashionLive[locale]]
  if (show.textKey === 'shows.wereNext') return [TEXTS.shows.wereNext[locale]]
  return []
}

export function Shows({ locale }: { locale: Locale }) {
  const T = TEXTS.shows
  const r = routes(locale)
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pb-10 pt-32 md:px-8 md:pb-16 md:pt-44">
        <p className="meta-label mb-4">{T.subheading[locale]}</p>
        <h1 className="font-display-cond text-h1 mb-10 md:mb-14">
          {T.heading[locale]}
        </h1>
        <Prose paragraphs={T.intro[locale]} />
      </section>

      <ol>
        {SHOWS.map((show, i) => {
          const paragraphs = showParagraphs(show, locale)
          const metaBits = [
            show.season ? { k: s('season', locale), v: show.season } : null,
            show.city[locale]
              ? { k: s('city', locale), v: show.city[locale] }
              : null,
            show.year ? { k: s('year', locale), v: show.year } : null,
            show.note[locale] ? { k: '', v: show.note[locale] } : null,
          ].filter(Boolean) as { k: string; v: string }[]
          return (
            <li
              key={show.slug}
              className="reveal border-t"
              style={{ borderColor: 'var(--atm-line)' }}
            >
              <article className="mx-auto grid max-w-[1600px] gap-8 px-5 py-14 md:grid-cols-12 md:px-8 md:py-24">
                <div className="md:col-span-8">
                  <p className="meta-label mb-5">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-display-cond text-h2 max-w-[14ch] leading-[0.95]">
                    {show.name}
                    {show.season ? <> {show.season}</> : null}
                  </h2>
                  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-1">
                    {metaBits.map((m, j) => (
                      <div key={j} className="flex gap-2">
                        {m.k ? <dt className="meta-label">{m.k}</dt> : null}
                        <dd className="meta-label !text-atm">{m.v}</dd>
                      </div>
                    ))}
                  </dl>
                  <Prose paragraphs={paragraphs} className="mt-10" />
                  {show.project ? (
                    <Link
                      href={r.project(show.project)}
                      className="link-line mt-8 inline-block text-[1.125rem]"
                    >
                      {show.projectLabel?.[locale]}
                    </Link>
                  ) : null}
                </div>
                <div className="md:col-span-4 md:col-start-9">
                  <div className="grid grid-cols-2 gap-4">
                    {show.photos.map((id) => {
                      const ph = getPhoto(id)
                      return (
                        <div
                          key={id}
                          className="relative aspect-[3/4] overflow-hidden"
                        >
                          <Picture
                            photo={ph}
                            sizes="(min-width: 768px) 16vw, 45vw"
                            fill
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </>
  )
}
