import type { Metadata } from 'next'
import { Projects } from '@/views/Projects'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'en',
  csPath: '/projekty',
  title: 'Projects',
})

export default function Page() {
  return <Projects locale="en" />
}
