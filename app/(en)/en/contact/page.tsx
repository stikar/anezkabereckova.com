import type { Metadata } from 'next'
import { Contact } from '@/views/Contact'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  locale: 'en',
  csPath: '/kontakt',
  title: 'Contact',
})

export default function Page() {
  return <Contact locale="en" />
}
