'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function RevealObserver() {
  const pathname = usePathname()
  useEffect(() => {
    const all = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (all.length === 0 || !('IntersectionObserver' in window)) return
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reduced) return

    const els = all.filter((el) => {
      if (el.classList.contains('is-visible')) return false
      const top = el.getBoundingClientRect().top
      if (top < window.innerHeight * 1.05) return false
      el.classList.add('reveal--pending')
      return true
    })
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.remove('reveal--pending')
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
  return null
}
