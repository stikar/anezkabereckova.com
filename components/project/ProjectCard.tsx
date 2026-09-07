import Link from 'next/link'
import { Picture } from '@/components/Picture'
import { getPhoto, type Locale, type Project } from '@/lib/content'
import { routes } from '@/lib/i18n'

export function ProjectCard({
  project,
  locale,
  size = 'md',
  priority = false,
}: {
  project: Project
  locale: Locale
  size?: 'md' | 'lg'

  priority?: boolean
}) {
  const a = project.atmosphere
  const photo = getPhoto(`${project.slug}/${project.card}`)
  const hover = getPhoto(`${project.slug}/${project.cardHover}`)
  const ctx = project.context[locale]
  const chip = [
    ctx.includes(project.code) ? '' : project.code,
    ctx.includes(project.year) ? '' : project.year,
  ]
    .filter(Boolean)
    .join(' · ')
  return (
    <Link
      href={routes(locale).project(project.slug)}
      className="pcard reveal group block"
      style={{ background: a.bg, color: a.fg }}
    >
      <div
        className={`relative overflow-hidden ${size === 'lg' ? 'aspect-[4/5] md:aspect-[16/10]' : 'aspect-[3/4] md:aspect-[4/5]'}`}
      >
        <div className="pcard-media absolute inset-0">
          <Picture
            photo={photo}
            sizes={
              size === 'lg'
                ? '(min-width:768px) 50vw, 100vw'
                : '(min-width:768px) 33vw, 100vw'
            }
            fill
            priority={priority}
            imgClassName="object-[50%_20%]"
          />
          <Picture
            photo={hover}
            sizes={
              size === 'lg'
                ? '(min-width:768px) 50vw, 100vw'
                : '(min-width:768px) 33vw, 100vw'
            }
            fill
            className="pcard-hover"
            imgClassName="object-[50%_20%]"
          />
        </div>
      </div>
      <div className="flex items-end justify-between gap-4 px-4 pb-5 pt-4">
        <div>
          <h3 className="font-display-cond text-[2rem] leading-none md:text-[2.4rem]">
            {project.title}
          </h3>
          <p className="mt-2 text-[0.95rem] opacity-80">
            {project.context[locale]}
          </p>
        </div>
        {chip && (
          <span className="meta-label !text-current opacity-80">{chip}</span>
        )}
      </div>
    </Link>
  )
}
