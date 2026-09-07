import type { Metadata } from 'next'
import { Shows } from '@/views/Shows'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'en',
  csPath: '/prehlidky',
  title: 'Shows',
})

export default function Page() {
  return <Shows locale="en" />
}
