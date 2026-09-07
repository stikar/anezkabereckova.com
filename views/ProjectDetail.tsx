import {
  getPhoto,
  getPhotoOrNull,
  getProject,
  lookSlug,
  nextProject,
  projectLooks,
  projectPhotos,
  TEXTS,
  type Locale,
  type Photo,
} from '@/lib/content'
import { routes } from '@/lib/i18n'
import { Atmosphere } from '@/components/site/Atmosphere'
import { Gallery, labelFor, totals } from '@/components/project/Gallery'
import { GalleryPhoto } from '@/components/project/GalleryPhoto'
import { StoryProvider } from '@/components/project/StoryMode'
import { ViewToggle } from '@/components/project/ViewToggle'
import { IndexList, type IndexRow } from '@/components/project/IndexList'
import { Credits } from '@/components/project/Credits'
import { NextProject } from '@/components/project/NextProject'
import {
  Anatomy,
  InMedia,
  Pieces,
  Preissig,
} from '@/components/project/MilanoSections'
import { s } from '@/components/project/strings'
import type { Slide } from '@/components/project/story'
import '@/components/project/project.css'

export function ProjectDetail({
  locale,
  slug,
  look,
}: {
  locale: Locale
  slug?: string
  look?: string
}) {
  const project = getProject(slug ?? 'milano-cortina-2026')
  const r = routes(locale)
  const photos = projectPhotos(project.slug)
  const tot = totals(photos)
  const looks = projectLooks(project.slug)
  const hero = getPhoto(`${project.slug}/${project.hero}`)
  const next = nextProject(project.slug)
  const nextHero = getPhoto(`${next.slug}/${next.hero}`)
  const back = (p: Photo) =>
    p.pair ? getPhotoOrNull(`${project.slug}/${p.pair}`) : null

  const slides: Slide[] = []
  if (project.text === 'milano') {
    slides.push({
      kind: 'text',
      id: 'process',
      caption: s('process', locale),
      text: TEXTS.milano.process.processSentence[locale],
    })
    TEXTS.milano.pieces.items.forEach((it, i) => {
      slides.push({
        kind: 'piece',
        id: `piece-${i}`,
        n: String(i + 1).padStart(2, '0'),
        text: it[locale],
        photo: it.photo ? getPhotoOrNull(`${project.slug}/${it.photo}`) : null,
      })
    })
  }
  for (const p of looks) {
    slides.push({
      kind: 'photo',
      id: p.id,
      photo: p,
      back: back(p),
      label: `${labelFor(p, tot)} / ${project.code}`,
      lookSlug: lookSlug(p),
    })
  }

  const indexRows: IndexRow[] = looks.map((p) => ({
    id: p.id,
    href: r.look(project.slug, lookSlug(p)),
    label: labelFor(p, tot),
    code: project.code,
    title: project.title,
    photographer: project.credits?.find((c) => c.role.cs === 'Photo')?.name,
    words: project.indexWords?.[p.slug]?.[locale],
    photo: p,
  }))

  const text = TEXTS[project.text]

  return (
    <StoryProvider
      locale={locale}
      slides={slides}
      initialId={look ? `${project.slug}/${look}` : undefined}
      baseUrl={r.project(project.slug)}
      atmosphere={{ bg: project.atmosphere.bg, fg: project.atmosphere.fg }}
    >
      <Atmosphere project={project} />
      <article className="pt-28 md:pt-36">
        <header className="mx-auto max-w-[1600px] px-5 md:px-8">
          <p className="meta-label">{project.code}</p>
          <h1 className="font-display-cond text-h1 mt-2 break-words">
            {project.title}
          </h1>
          <p className="mt-4 max-w-[40rem] text-[1.15rem] leading-relaxed text-atm-muted md:text-[1.35rem]">
            {project.subtitle[locale]}
          </p>
          <dl className="mt-10 grid gap-x-8 gap-y-4 md:grid-cols-3">
            {project.meta.map((m) => (
              <div
                key={m.label.cs}
                className="border-t pt-3"
                style={{ borderColor: 'var(--atm-line)' }}
              >
                <dt className="meta-label">{m.label[locale]}</dt>
                <dd className="mt-1 text-[0.95rem]">{m.value[locale]}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="mt-12 md:mt-16">
          <GalleryPhoto
            photo={hero}
            back={back(hero)}
            label={
              hero.kind === 'transition'
                ? undefined
                : `${labelFor(hero, tot)} / ${project.code}`
            }
            locale={locale}
            sizes="100vw"
            priority
            ratio="hero"
          />
        </div>

        <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 md:py-32">
          <div className="max-w-[40rem] md:ml-[25%]">
            {project.text === 'milano' && (
              <>
                {TEXTS.milano.p[locale].map((p, i) => (
                  <p
                    key={i}
                    className="reveal mb-6 text-[1.15rem] leading-[1.7] md:text-[1.25rem]"
                  >
                    {p}
                  </p>
                ))}
                <p className="meta-label mb-4 mt-14">{s('process', locale)}</p>
                {TEXTS.milano.process[locale].map((p, i) => (
                  <p
                    key={i}
                    className="reveal mb-6 text-[1.15rem] leading-[1.7] md:text-[1.25rem]"
                  >
                    {p}
                  </p>
                ))}
              </>
            )}
            {project.text === 'newBreath' && (
              <>
                {TEXTS.newBreath[locale].map((p, i) => (
                  <p
                    key={i}
                    className="reveal mb-6 text-[1.15rem] leading-[1.7] md:text-[1.25rem]"
                  >
                    {p}
                  </p>
                ))}
                <blockquote
                  className="reveal mt-14 border-l pl-6"
                  style={{ borderColor: 'var(--atm-line)' }}
                >
                  <p className="text-[1.15rem] leading-[1.7] md:text-[1.25rem]">
                    „{TEXTS.newBreath.statement[locale]}“
                  </p>
                  <footer className="meta-label mt-4">
                    {s('source', locale)}:{' '}
                    <a
                      href={TEXTS.newBreath.statement.source}
                      target="_blank"
                      rel="noopener"
                      className="link-line"
                    >
                      {TEXTS.newBreath.statement.sourceLabel} ↗
                    </a>
                  </footer>
                </blockquote>
              </>
            )}
            {project.text === 'princess' &&
              TEXTS.princess[locale].map((p, i) => (
                <p
                  key={i}
                  className="reveal mb-6 text-[1.15rem] leading-[1.7] md:text-[1.25rem]"
                >
                  {p}
                </p>
              ))}
            {project.text === 'poisonedMind' && (
              <p className="reveal text-[1.15rem] leading-[1.7] md:text-[1.25rem]">
                {(text as { cs: string; en: string })[locale]}
              </p>
            )}
          </div>
        </section>

        {project.text === 'milano' && (
          <div className="space-y-24 pb-24 md:space-y-40 md:pb-40">
            <Anatomy project={project} locale={locale} />
            <Preissig project={project} locale={locale} />
            <Pieces project={project} locale={locale} />
            <InMedia project={project} locale={locale} />
          </div>
        )}

        <section className="mx-auto max-w-[1600px] px-5 md:px-8">
          <ViewToggle
            locale={locale}
            visual={
              <div className="-mx-5 md:-mx-8">
                <Gallery project={project} locale={locale} tot={tot} />
              </div>
            }
            index={<IndexList rows={indexRows} />}
          />
        </section>

        <div className="mt-20 md:mt-32">
          <Credits project={project} locale={locale} />
        </div>

        <NextProject
          current={project}
          next={next}
          hero={nextHero}
          locale={locale}
        />
      </article>
    </StoryProvider>
  )
}
