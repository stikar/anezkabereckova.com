import type { Metadata } from 'next'
import { Home } from '@/views/Home'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'cs',
  csPath: '/',
  title: 'Anežka Berecková — Fashion Designer / Apparel Designer',
})

export default function Page() {
  return <Home locale="cs" />
}
