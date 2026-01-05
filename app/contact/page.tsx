import Link from 'next/link'
import Image from 'next/image'

export default function Contact() {
  return (
    // Transition classes help make the switch between light/dark smoother
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300">
      <header className="w-full">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 pt-6 md:pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm tracking-widest uppercase hover:opacity-60 transition-opacity text-zinc-500 dark:text-zinc-400"
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
      </header>

      <main className="flex-1 w-full flex items-center justify-center px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div
          className="flex flex-col md:flex-row gap-12 md:gap-16 items-center w-full"
          style={{ maxWidth: '42rem' }}
        >
          {/* Profile Image - Grayscale removed */}
          <div className="w-64 h-80 md:w-72 md:h-96 relative flex-shrink-0">
            <Image
              src="/contact-selfie.jpeg"
              alt="Anežka Berecková"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-8 flex-1">
            {/* Name and Title */}
            <div className="space-y-1">
              <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-zinc-900 dark:text-zinc-50">
                Anežka Berecková
              </h1>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                Fashion Designer
              </p>
            </div>

            {/* Email Section */}
            <div className="space-y-2">
              <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                Email
              </h2>
              <a
                href="mailto:contact@anezkabereckova.com"
                className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity text-zinc-900 dark:text-zinc-50"
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
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                contact@anezkabereckova.com
              </a>
            </div>

            {/* LinkedIn Section */}
            <div className="space-y-2">
              <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                LinkedIn
              </h2>
              <a
                href="https://www.linkedin.com/in/anežka-berecková-b8370828a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity text-zinc-900 dark:text-zinc-50"
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                Connect on LinkedIn
              </a>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                For collaboration inquiries, press features, or collection
                viewings, please reach out via email.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full mt-auto">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <p className="text-xs tracking-wider text-zinc-500 dark:text-zinc-400">
              © 2026 Anežka Berecková
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
