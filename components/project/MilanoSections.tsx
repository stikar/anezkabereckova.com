import Link from 'next/link'
import { Picture } from '@/components/Picture'
import {
  getPhoto,
  getPhotoOrNull,
  lookSlug,
  pressByUrl,
  TEXTS,
  type Locale,
  type Project,
} from '@/lib/content'
import { routes, ui } from '@/lib/i18n'
import { Hotspots } from './Hotspots'

const M = TEXTS.milano

export function Anatomy({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  const main = getPhoto(`${project.slug}/${M.anatomy.photo}`)
  const coat = getPhoto(`${project.slug}/${M.anatomy.coatSpot.photo}`)
  return (
    <section className="mx-auto max-w-[1600px] px-0 md:px-8">
      <h2 className="font-display-cond reveal px-5 text-h2 md:px-0">
        {ui('anatomy', locale)}
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-12">
        <Hotspots
          photo={main}
          spots={M.anatomy.spots}
          locale={locale}
          sizes="(min-width:768px) 66vw, 100vw"
          className="self-start md:col-span-8"
          showHint
        />
        <Hotspots
          photo={coat}
          spots={[M.anatomy.coatSpot]}
          locale={locale}
          sizes="(min-width:768px) 33vw, 100vw"
          className="self-start md:col-span-4"
        />
      </div>
    </section>
  )
}

export function Preissig({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-8">
      <h2 className="font-display-cond reveal text-h2">
        {ui('fromPreissig', locale)}
      </h2>
      <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
        {M.preissig.steps.map((st) => {
          const photo =
            'photo' in st && st.photo
              ? getPhotoOrNull(`${project.slug}/${st.photo}`)
              : null
          return (
            <li
              key={st.n}
              className="reveal border-t pt-5"
              style={{ borderColor: 'var(--atm-line)' }}
            >
              <p className="meta-label">{st.n}</p>
              <h3 className="font-display-cond mt-3 text-[2rem] leading-none md:text-[2.6rem]">
                {st.title[locale]}
              </h3>
              {photo ? (
                <Picture
                  photo={photo}
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="mt-5 aspect-square overflow-hidden [contain:paint]"
                  imgClassName="h-full w-full object-cover object-[50%_35%] scale-[1.6] origin-[50%_35%]"
                />
              ) : (
                <p className="mt-5 max-w-[30rem] leading-relaxed">
                  {st[locale]}
                </p>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export function Pieces({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  const r = routes(locale)
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-8">
      <h2 className="font-display-cond reveal text-h2">
        {ui('pieces', locale)}
      </h2>
      <p className="reveal mt-8 max-w-[40rem] text-[1.25rem] leading-relaxed md:text-[1.5rem]">
        „{M.process.processSentence[locale]}“
      </p>
      <ol className="mt-10">
        {M.pieces.items.map((it, i) => {
          const photo = it.photo
            ? getPhotoOrNull(`${project.slug}/${it.photo}`)
            : null
          const inner = (
            <>
              <span className="meta-label !text-current">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="meta-label">
                {photo ? lookSlug(photo).toUpperCase().replace('-', ' ') : ''}
              </span>
              <span className="font-display-cond text-[1.5rem] leading-none md:text-[2rem]">
                {it[locale]}
              </span>
              {photo && (
                <span className="hidden justify-self-end md:block">
                  <Picture
                    photo={photo}
                    sizes="64px"
                    className="aspect-[3/4] w-12 overflow-hidden"
                    imgClassName="h-full w-full object-cover"
                  />
                </span>
              )}
            </>
          )
          const cls =
            'reveal grid grid-cols-[3rem_5rem_1fr] items-center gap-4 border-t py-4 md:grid-cols-[3rem_6rem_1fr_auto]'
          return (
            <li key={i}>
              {photo ? (
                <Link
                  href={r.look(project.slug, lookSlug(photo))}
                  className={`${cls} transition-opacity hover:opacity-70`}
                  style={{ borderColor: 'var(--atm-line)' }}
                >
                  {inner}
                </Link>
              ) : (
                <div className={cls} style={{ borderColor: 'var(--atm-line)' }}>
                  {inner}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export function InMedia({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  const media = project.media
  if (!media) return null
  const rows = (urls: string[]) =>
    urls
      .map((u) => pressByUrl(u))
      .filter((e): e is NonNullable<typeof e> => !!e && !!e.title)
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-8">
      <h2 className="font-display-cond reveal text-h2">
        {ui('inMedia', locale)}
      </h2>
      <div className="mt-10 max-w-[60rem]">
        <div>
          <p className="meta-label">{ui('whatTheWorldSaid', locale)}</p>
          <ul className="mt-4">
            {rows(media.world).map((e) => (
              <li
                key={e.url}
                className="reveal border-t py-4"
                style={{ borderColor: 'var(--atm-line)' }}
              >
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener"
                  className="group block"
                >
                  <span className="block text-[1.15rem] leading-snug group-hover:underline group-hover:underline-offset-4">
                    {e.title}
                  </span>
                  <span className="meta-label mt-2 block">{e.outlet} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className="reveal mt-12 border-t pt-4"
        style={{ borderColor: 'var(--atm-line)' }}
      >
        <p className="font-display-cond text-[1.5rem] leading-none md:text-[2rem]">
          {media.ceremony.label[locale]} →
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {rows(media.ceremony.links).map((e) => (
            <li key={e.url}>
              <a
                href={e.url}
                target="_blank"
                rel="noopener"
                className="meta-label link-line !text-current"
              >
                {e.outlet} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
