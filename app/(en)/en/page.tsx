import type { Metadata } from 'next'
import { Home } from '@/views/Home'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'en',
  csPath: '/',
  title: 'Anežka Berecková — Fashion Designer / Apparel Designer',
})

export default function Page() {
  return <Home locale="en" />
}
