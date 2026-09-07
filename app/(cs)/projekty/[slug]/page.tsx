import type { Metadata } from 'next'
import { ProjectDetail } from '@/views/ProjectDetail'
import { PROJECTS, getProject } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const p = getProject(slug)
  return pageMeta({
    locale: 'cs',
    csPath: `/projekty/${p.slug}`,
    title: `${p.title} ${p.code}`,
    description: p.subtitle['cs'],
    og: `/og/cs/projekty/${p.slug}.jpg`,
  })
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  return <ProjectDetail locale="cs" slug={slug} />
}
