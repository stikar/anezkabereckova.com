import Link from 'next/link'

export function Header() {
  return (
    <header className="w-full border-b border-current">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        <nav className="flex justify-between items-center py-4 md:py-6">
          <Link
            href="/"
            className="hover:opacity-70 transition-opacity text-sm md:text-base"
          >
            Home
          </Link>
          <Link
            href="/contact"
            className="hover:opacity-70 transition-opacity text-sm md:text-base"
          >
            Contact
          </Link>
        </nav>
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
  )
}
