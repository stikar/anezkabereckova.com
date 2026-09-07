'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import site from '@/content/site.json'
import { useLocale } from './LocaleContext'
import { switchLocalePath, ui } from '@/lib/i18n'
import { LAST_PROJECT_KEY } from './Atmosphere'

export function Nav() {
  const locale = useLocale()
  const pathname = usePathname() || '/'
  const items = site.nav[locale]
  const isHomePath =
    pathname === '/' || pathname === '/en' || pathname === '/en/'

  const known = [...site.nav.cs, ...site.nav.en].map((i) => i.href)
  const isKnown =
    isHomePath ||
    known.some((h) => pathname === h || pathname.startsWith(h + '/'))
  const isHome = isHomePath || !isKnown
  const [open, setOpen] = useState(false)
  const [scrolledPast, setScrolledPast] = useState(false)
  const scrolled = !isHome || scrolledPast
  const [tint, setTint] = useState<{ bg: string; fg: string } | null>(null)

  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!isHome) return
    const onScroll = () =>
      setScrolledPast(window.scrollY > window.innerHeight * 0.6)
    const raf = requestAnimationFrame(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [isHome])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const hoverProjects = useCallback((on: boolean) => {
    if (!on) return setTint(null)
    try {
      const raw = localStorage.getItem(LAST_PROJECT_KEY)
      if (raw) setTint(JSON.parse(raw))
    } catch {}
  }, [])

  const other = locale === 'cs' ? 'en' : 'cs'
  const switchHref = switchLocalePath(pathname, other)
  const home = locale === 'cs' ? '/' : '/en'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ${
          scrolled && !open
            ? 'bg-[color-mix(in_srgb,var(--atm-bg)_88%,transparent)] backdrop-blur-md'
            : 'bg-transparent'
        } ${isHome && !scrolled && !open ? 'text-paper' : 'text-atm'}`}
      >
        <nav
          aria-label={locale === 'cs' ? 'Hlavní navigace' : 'Main navigation'}
          className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-8 md:py-5"
        >
          <Link
            href={home}
            className="font-display-cond text-[1.35rem] leading-none tracking-[0.02em] md:text-[1.5rem]"
            aria-label={site.name}
          >
            {site.nameUpper}
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {items.map((it) => {
              const active =
                pathname === it.href || pathname.startsWith(it.href + '/')
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  prefetch={false}
                  className={`meta-label !text-current transition-opacity hover:opacity-100 ${active ? 'opacity-100 underline underline-offset-[6px]' : 'opacity-70'}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {it.label}
                </Link>
              )
            })}
            <a
              href={switchHref}
              hrefLang={other}
              lang={other}
              className="meta-label !text-current opacity-70 hover:opacity-100"
              aria-label={other === 'en' ? 'English version' : 'Česká verze'}
            >
              {other.toUpperCase()}
            </a>
          </div>

          <button
            type="button"
            className="meta-label !text-current md:hidden"
            aria-expanded={open}
            aria-controls="overlay-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? ui('close', locale) : ui('menu', locale)}
          </button>
        </nav>
      </header>

      <div
        id="overlay-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-end px-5 pb-10 pt-24 transition-[opacity,visibility,background-color,color] duration-500 ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        style={{
          backgroundColor: tint?.bg ?? 'var(--atm-bg)',
          color: tint?.fg ?? 'var(--atm-fg)',
        }}
      >
        <ul className="flex flex-col gap-1">
          {items.map((it, i) => (
            <li key={it.href}>
              <Link
                href={it.href}
                prefetch={false}
                tabIndex={open ? 0 : -1}
                onMouseEnter={() => hoverProjects(i === 0)}
                onMouseLeave={() => hoverProjects(false)}
                onFocus={() => hoverProjects(i === 0)}
                onBlur={() => hoverProjects(false)}
                className="font-display-cond block text-[15vw] leading-[0.95] transition-opacity hover:opacity-60"
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex items-center justify-between">
          <a
            href={switchHref}
            hrefLang={other}
            lang={other}
            tabIndex={open ? 0 : -1}
            className="meta-label !text-current"
          >
            {other === 'en' ? 'English' : 'Čeština'}
          </a>
          <a
            href={`mailto:${site.email}`}
            tabIndex={open ? 0 : -1}
            className="meta-label !text-current"
          >
            {site.email}
          </a>
        </div>
      </div>
    </>
  )
}
