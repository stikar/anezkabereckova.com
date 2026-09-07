import type { Metadata } from 'next'
import { Shows } from '@/views/Shows'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'cs',
  csPath: '/prehlidky',
  title: 'Přehlídky',
})

export default function Page() {
  return <Shows locale="cs" />
}
