import Link from 'next/link'
import { Footer } from '@/components/footer'
import { Portfolio } from '@/components/portfolio'
import { Divider } from '@/components/divider'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-current">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex justify-end py-4 md:py-6">
            <Link
              href="/contact"
              className="inline-block text-sm tracking-wider uppercase border-b border-current hover:opacity-60 transition-opacity pb-0.5"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="text-center py-8 md:py-12 lg:py-16">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-wide mb-2 md:mb-4">
            ANEŽKA BERECKOVÁ
          </h1>
          <p className="text-base md:text-lg lg:text-xl tracking-wider">
            Fashion Designer
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <Portfolio />
        <Divider />
      </main>

      <Footer />
    </div>
  )
}
