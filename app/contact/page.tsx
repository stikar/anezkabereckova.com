import Link from 'next/link'
import { Footer } from '@/components/footer'

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 pt-6 md:pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm tracking-widest uppercase hover:opacity-60 transition-opacity"
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

        <div className="text-center pt-8 md:pt-12 pb-8 md:pb-12">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-wide mb-3 md:mb-4">
            ANEŽKA BERECKOVÁ
          </h1>
          <p className="font-sans font-light text-xs md:text-sm tracking-widest uppercase">
            Fashion Designer
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-8 text-center">
            Contact
          </h2>

          <div className="space-y-6 text-center">
            <p className="text-base md:text-lg">
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
