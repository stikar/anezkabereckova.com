import type { Metadata } from 'next'
import { About } from '@/views/About'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'en',
  csPath: '/o-mne',
  title: 'About',
})

export default function Page() {
  return <About locale="en" />
}
