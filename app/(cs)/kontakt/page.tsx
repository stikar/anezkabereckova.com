import type { Metadata } from 'next'
import { Contact } from '@/views/Contact'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'cs',
  csPath: '/kontakt',
  title: 'Kontakt',
})

export default function Page() {
  return <Contact locale="cs" />
}
