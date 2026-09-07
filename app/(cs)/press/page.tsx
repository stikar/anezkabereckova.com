import type { Metadata } from 'next'
import { Press } from '@/views/Press'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'cs',
  csPath: '/press',
  title: 'Press',
})

export default function Page() {
  return <Press locale="cs" />
}
