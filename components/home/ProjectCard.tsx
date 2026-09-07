import Link from 'next/link'
import { Picture } from '@/components/Picture'
import { getPhoto, type Locale, type Project } from '@/lib/content'
import { routes } from '@/lib/i18n'

export function ProjectCard({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  const a = project.atmosphere
  const main = getPhoto(`${project.slug}/${project.card}`)
  const alt = getPhoto(`${project.slug}/${project.cardHover}`)
  return (
    <Link
      href={routes(locale).project(project.slug)}
      prefetch={false}
      className="pcard reveal group block"
      style={{ background: a.bg, color: a.fg }}
    >
      <div className="pcard__media">
        <Picture photo={main} sizes="(min-width: 768px) 33vw, 100vw" fill />
        <Picture
          photo={alt}
          sizes="(min-width: 768px) 33vw, 100vw"
          fill
          className="pcard__alt"
          alt=""
        />
      </div>
      <div className="flex items-end justify-between gap-4 px-5 pb-6 pt-5">
        <div>
          <p className="font-display-cond text-[2rem] leading-none md:text-[2.4rem]">
            {project.title}
          </p>
          <p className="mt-2 text-[0.9375rem]" style={{ color: a.muted }}>
            {project.context[locale]}
          </p>
        </div>
        {project.context[locale].includes(project.code) ? null : (
          <p className="meta-label" style={{ color: a.muted }}>
            {project.code}
          </p>
        )}
      </div>
    </Link>
  )
}
