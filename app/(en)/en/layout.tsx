import { Shell } from '@/components/site/Shell'
import '../../globals.css'

export { metadata, viewport } from '@/app/shared-metadata'

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
        <Shell locale="en">{children}</Shell>
      </body>
    </html>
  )
}
