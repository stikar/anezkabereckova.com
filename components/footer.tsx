import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function Footer() {
  return (
    <footer className="w-full border-t border-current mt-auto">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
        <div className="flex justify-between items-center">
          <Link
            href="/contact"
            className="text-sm md:text-base hover:opacity-70 transition-opacity"
          >
            ©2026 Anežka Berecková
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
