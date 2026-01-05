import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://anezkabereckova.com'),
  title: 'Anežka Berecková - Fashion Designer',
  description: 'Portfolio of fashion designer Anežka Berecková',
  openGraph: {
    title: 'Anežka Berecková - Fashion Designer',
    description: 'Portfolio of fashion designer Anežka Berecková',
    images: [
      {
        url: '/contact-selfie.jpeg',
        width: 400,
        height: 400,
        alt: 'Anežka Berecková – Fashion Designer',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
