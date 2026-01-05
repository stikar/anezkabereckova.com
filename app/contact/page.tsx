import Link from 'next/link'
import { Footer } from '@/components/footer'

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-current">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex justify-start py-4 md:py-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-opacity-60 hover:text-opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Gallery
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
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide mb-8 text-center">
            Contact
          </h2>

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
