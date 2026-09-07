import type { Metadata } from 'next'
import { Shell } from '@/components/site/Shell'
import { NotFound } from '@/views/NotFound'
import './globals.css'

export { viewport } from '@/app/shared-metadata'

export const metadata: Metadata = {
  title: 'Tenhle look ještě neexistuje — Anežka Berecková',
  description: 'Stránka nenalezena.',
  robots: { index: false },
}

export default function GlobalNotFound() {
  return (
    <html lang="cs">
      <head>
        <link
          rel="preload"
          href="/fonts/archivo-cond-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/archivo-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Shell locale="cs">
          <NotFound locale="cs" />
        </Shell>
      </body>
    </html>
  )
}
