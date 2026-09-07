import type { Metadata } from 'next'
import { Projects } from '@/views/Projects'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'cs',
  csPath: '/projekty',
  title: 'Projekty',
})

export default function Page() {
  return <Projects locale="cs" />
}
