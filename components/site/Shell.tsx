import type { Locale } from '@/lib/content'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { LocaleProvider } from './LocaleContext'
import { RevealObserver } from './RevealObserver'
import { RegisterSW } from '@/components/pwa/RegisterSW'

export function Shell({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return (
    <LocaleProvider locale={locale}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        {locale === 'cs' ? 'Přeskočit na obsah' : 'Skip to content'}
      </a>
      <Nav />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
      <RevealObserver />
      <RegisterSW />
    </LocaleProvider>
  )
}
