import {
  lookSlug,
  projectLooks,
  projectPhotos,
  PROJECTS,
  TEXTS,
  type Locale,
} from '@/lib/content'
import { routes } from '@/lib/i18n'
import { ProjectCard } from '@/components/project/ProjectCard'
import { ViewToggle } from '@/components/project/ViewToggle'
import { IndexList, type IndexRow } from '@/components/project/IndexList'
import { labelFor, totals } from '@/components/project/Gallery'
import { s } from '@/components/project/strings'
import '@/components/project/project.css'

export function Projects({ locale }: { locale: Locale }) {
  const r = routes(locale)
  const selected = PROJECTS.filter((p) => p.group === 'selected')
  const author = PROJECTS.filter((p) => p.group === 'author')

  const rows: IndexRow[] = PROJECTS.flatMap((p) => {
    const tot = totals(projectPhotos(p.slug))
    return projectLooks(p.slug).map((l) => ({
      id: l.id,
      href: r.look(p.slug, lookSlug(l)),
      label: labelFor(l, tot),
      code: p.code,
      title: p.title,
      photographer: p.credits?.find((c) => c.role.cs === 'Photo')?.name,
      words: p.indexWords?.[l.slug]?.[locale],
      photo: l,
    }))
  })

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <h1 className="font-display-cond text-h1">
        {s('projectsTitle', locale)}
      </h1>
      <div className="mt-12">
        <ViewToggle
          locale={locale}
          visual={
            <div>
              <h2 className="meta-label mb-4">
                {TEXTS.selectedProjects.heading[locale]}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {selected.map((p, i) => (
                  <ProjectCard
                    key={p.slug}
                    project={p}
                    locale={locale}
                    size="lg"
                    priority={i === 0}
                  />
                ))}
              </div>
              <div className="mt-24 md:mt-32">
                <h2 className="font-display-cond text-h2">
                  {TEXTS.authorCollections.heading[locale]}
                </h2>
                <p className="mt-4 max-w-[40rem] text-[1.15rem] leading-relaxed text-atm-muted">
                  {TEXTS.authorCollections[locale]}
                </p>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {author.map((p) => (
                  <ProjectCard
                    key={p.slug}
                    project={p}
                    locale={locale}
                    size="lg"
                  />
                ))}
              </div>
            </div>
          }
          index={<IndexList rows={rows} />}
        />
      </div>
    </div>
  )
}
