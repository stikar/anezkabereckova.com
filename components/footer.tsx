import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function Footer() {
  return (
    <footer className="w-full mt-auto">
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="text-xs tracking-wider hover:opacity-70 transition-opacity"
            >
              © 2026 Anežka Berecková
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
