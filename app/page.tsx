import Link from 'next/link'
import { Footer } from '@/components/footer'
import { Portfolio } from '@/components/portfolio'
import { Divider } from '@/components/divider'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full">
        <div className="text-center pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-wide mb-3 md:mb-4">
            ANEŽKA BERECKOVÁ
          </h1>
          <p className="font-sans font-light text-xs md:text-sm tracking-widest uppercase mb-4 md:mb-6">
            Fashion Designer
          </p>
          <Link
            href="/contact"
            className="inline-block text-xs md:text-sm tracking-widest uppercase border-b border-current hover:opacity-60 transition-opacity"
          >
            Contact
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1130px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <Portfolio />
        <Divider />
      </main>

      <Footer />
    </div>
  )
}
