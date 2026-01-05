import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide mb-8 text-center">
            Contact
          </h1>

          <div className="space-y-6 text-center">
            <p className="text-lg md:text-xl">
              Get in touch with Anežka Berecková
            </p>

            <div className="space-y-2">
              <p>Email: <a href="mailto:contact@anezkabereckova.com" className="hover:opacity-70 transition-opacity underline">contact@anezkabereckova.com</a></p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
