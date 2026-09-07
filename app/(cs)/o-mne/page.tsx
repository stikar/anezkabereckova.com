import type { Metadata } from 'next'
import { About } from '@/views/About'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'cs',
  csPath: '/o-mne',
  title: 'O mně',
})

export default function Page() {
  return <About locale="cs" />
}
