import Link from 'next/link'
import '@/components/about/about.css'
import { Picture } from '@/components/Picture'
import { SITE, TEXTS, type Locale, type Photo } from '@/lib/content'
import { routes, ui } from '@/lib/i18n'

export function AboutTeaser({
  locale,
  portrait,
}: {
  locale: Locale
  portrait: Photo
}) {
  const r = routes(locale)
  return (
    <section
      className="ab-teaser relative overflow-hidden text-paper"
      style={{ background: '#0E0E0E' }}
      aria-labelledby="about-title"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 px-5 pt-16 md:px-8 md:pt-0">
        <div className="ab-teaser__portrait reveal col-span-12 md:col-span-5 md:row-start-1">
          <div className="ab-portrait ab-portrait--dark">
            <Picture
              photo={portrait}
              sizes="(min-width: 768px) 40vw, 92vw"
              alt={SITE.name}
            />
          </div>
        </div>

        <div className="reveal col-span-12 py-14 md:col-span-7 md:row-start-1 md:self-center md:py-32 lg:py-40">
          <p className="meta-label !text-paper/60">{SITE.tagline[locale]}</p>
          <h2
            id="about-title"
            className="font-display-cond ab-teaser__title mt-6 text-paper"
          >
            {TEXTS.intro.heading[locale]}
          </h2>
          <p className="ab-teaser__lead font-display-wide mt-10 max-w-[30ch] text-paper/90">
            {TEXTS.about.p[locale][0]}
          </p>
          <Link
            href={r.about}
            className="meta-label link-line mt-12 inline-block !text-paper"
          >
            {ui('moreAbout', locale)}
          </Link>
        </div>
      </div>
    </section>
  )
}
