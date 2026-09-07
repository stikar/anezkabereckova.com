import type { Metadata } from 'next'
import { ProjectDetail } from '@/views/ProjectDetail'
import { PROJECTS, getProject, projectLooks, lookSlug } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

type Params = { slug: string; look: string }

export function generateStaticParams(): Params[] {
  return PROJECTS.flatMap((p) =>
    projectLooks(p.slug).map((l) => ({ slug: p.slug, look: lookSlug(l) }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug, look } = await params
  const p = getProject(slug)
  const label = look.toUpperCase().replace('-', ' ')
  return pageMeta({
    locale: 'cs',
    csPath: `/projekty/${p.slug}/${look}`,
    title: `${label} / ${p.code} — ${p.title}`,
    description: p.subtitle['cs'],
    og: `/og/cs/projekty/${p.slug}/${look}.jpg`,
    ogAlt: `${label} / ${p.code}`,
  })
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug, look } = await params
  return <ProjectDetail locale="cs" slug={slug} look={look} />
}
