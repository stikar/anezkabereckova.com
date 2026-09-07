import Link from 'next/link'
import { Picture } from '@/components/Picture'
import { Hero } from '@/components/home/Hero'
import { ProjectCard } from '@/components/home/ProjectCard'
import { AboutTeaser } from '@/components/home/AboutTeaser'
import { hui } from '@/components/home/strings'
import '@/components/home/home.css'
import {
  PROJECTS,
  SITE,
  TEXTS,
  getPhoto,
  getProject,
  pressByUrl,
  type Locale,
} from '@/lib/content'
import { routes, ui } from '@/lib/i18n'
import { personJsonLd } from '@/lib/seo'

const HERO_FRAMES = [
  'milano-cortina-2026/look-01',
  'milano-cortina-2026/motion-01',
  'milano-cortina-2026/look-04',
  'milano-cortina-2026/look-02',
]

export function Home({ locale }: { locale: Locale }) {
  const r = routes(locale)
  const milano = getProject('milano-cortina-2026')
  const atm = milano.atmosphere
  const featured = getPhoto(
    `${milano.slug}/${milano.homeFeatured ?? milano.hero}`
  )
  const portrait = getPhoto('about/portrait')
  const others = PROJECTS.filter((p) => p.slug !== milano.slug)
  const aktualne = SITE.aktualne[locale]
  const headlines = (milano.media?.world ?? [])
    .slice(0, 2)
    .map((u) => pressByUrl(u))
    .filter((e): e is NonNullable<typeof e> => Boolean(e?.title))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd(locale)),
        }}
      />

      <Hero
        locale={locale}
        frames={HERO_FRAMES.map(getPhoto)}
        name={SITE.nameUpper}
        tagline={SITE.tagline[locale]}
        scrollHint={ui('scrollHint', locale)}
      />

      {aktualne.text && (
        <p className="mx-auto flex max-w-[1600px] gap-3 px-5 pt-8 md:px-8">
          <span className="meta-label pt-[3px]">{hui('aktualne', locale)}</span>
          {aktualne.href ? (
            <a className="link-line" href={aktualne.href}>
              {aktualne.text}
            </a>
          ) : (
            <span>{aktualne.text}</span>
          )}
        </p>
      )}

      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-8 md:py-44 lg:py-56">
        <p className="reveal font-display-wide text-manifest max-w-[22ch] text-balance">
          {TEXTS.manifest[locale]}
        </p>
      </section>

      <section
        className="px-5 py-20 md:px-8 md:py-28"
        style={{ background: atm.bg, color: atm.fg }}
        aria-labelledby="featured-title"
      >
        <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12 md:gap-8">
          <div className="reveal md:col-span-5 md:pr-8">
            <p className="meta-label" style={{ color: atm.muted }}>
              {hui('featuredLabel', locale)} · {milano.code}
            </p>
            <h2 id="featured-title" className="font-display-cond text-h1 mt-6">
              {milano.title}
            </h2>
            <p className="mt-3 text-[1.0625rem]" style={{ color: atm.muted }}>
              {milano.subtitle[locale]}
            </p>
            <div className="mt-10 max-w-[46ch] space-y-5 text-[1.0625rem] leading-[1.6] md:text-[1.125rem]">
              {TEXTS.milano.p[locale].slice(0, 3).map((s) => (
                <p key={s}>{s}</p>
              ))}
            </div>

            {headlines.length > 0 && (
              <ul
                className="mt-12 space-y-4 border-t pt-6"
                style={{ borderColor: 'rgba(244,242,238,0.18)' }}
              >
                {headlines.map((h) => (
                  <li key={h.url}>
                    <a
                      href={h.url}
                      target="_blank"
                      rel="noopener"
                      className="link-line block text-[1.0625rem] leading-snug"
                    >
                      {locale === 'cs' ? `„${h.title}“` : `“${h.title}”`}
                    </a>
                    <span
                      className="meta-label mt-1 block"
                      style={{ color: atm.muted }}
                    >
                      {h.outlet}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={r.project(milano.slug)}
              className="link-line mt-12 inline-block text-[1.0625rem]"
            >
              {ui('viewCollection', locale)}
            </Link>
          </div>
          <div className="reveal md:col-span-7">
            <Link href={r.project(milano.slug)} className="block">
              <Picture
                photo={featured}
                sizes="(min-width: 768px) 58vw, 100vw"
                className="w-full"
              />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 md:py-28"
        aria-label={hui('moreProjects', locale)}
      >
        <div className="mb-8 flex justify-end">
          <Link href={r.projects} className="link-line text-[0.9375rem]">
            {hui('allProjects', locale)}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {others.map((p) => (
            <ProjectCard key={p.slug} project={p} locale={locale} />
          ))}
        </div>
      </section>

      <AboutTeaser locale={locale} portrait={portrait} />

      <section
        className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 md:py-28"
        aria-labelledby="how-title"
      >
        <h2 id="how-title" className="meta-label">
          {TEXTS.howIWork.heading[locale]}
        </h2>
        <p className="reveal font-display-wide text-h2 mt-6 max-w-[24ch] text-balance">
          {TEXTS.howIWork.intro[locale]}
        </p>
        <ol className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-6 lg:grid-cols-4">
          {TEXTS.howIWork.steps.items.map((s) => (
            <li key={s.n} className="reveal">
              <Picture
                photo={getPhoto(s.photo)}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="aspect-[4/5]"
                fill={false}
                imgClassName="aspect-[4/5] object-cover"
              />
              <p className="meta-label mt-4">{s.n}</p>
              <p className="mt-1 text-[0.9375rem] leading-snug md:text-[1.0625rem]">
                {s[locale]}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="mx-auto max-w-[1600px] px-5 pb-28 pt-20 md:px-8 md:pt-28 md:pb-36"
        aria-labelledby="contact-title"
      >
        <h2
          id="contact-title"
          className="reveal font-display-wide text-h2 max-w-[20ch] text-balance"
        >
          {TEXTS.contact.cta[locale]}
        </h2>
        <div className="reveal mt-8 max-w-[56ch] space-y-4 leading-[1.6] text-atm-muted">
          {TEXTS.collaboration.p[locale].map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
        <a
          href={`mailto:${SITE.email}`}
          className="email-line font-display-cond reveal mt-14 inline-block"
        >
          {SITE.email}
        </a>
        <ul className="reveal mt-8 flex gap-8">
          <li>
            <a
              className="link-line"
              href={SITE.instagram}
              target="_blank"
              rel="noopener"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              className="link-line"
              href={SITE.linkedin}
              target="_blank"
              rel="noopener"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </section>
    </>
  )
}
