'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Picture } from '@/components/Picture'
import type { Locale, Photo, Project } from '@/lib/content'
import { routes, ui } from '@/lib/i18n'
import { applyAtmosphere } from '@/components/site/Atmosphere'

export function NextProject({
  current,
  next,
  hero,
  locale,
}: {
  current: Project
  next: Project
  hero: Photo
  locale: Locale
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([e]) => applyAtmosphere(e.isIntersecting ? next : current),
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [current, next])
  const a = next.atmosphere
  return (
    <section
      ref={ref}
      className="relative mt-24 min-h-[50svh] overflow-hidden md:min-h-[60svh]"
      style={{ background: a.bg, color: a.fg }}
    >
      <Link
        href={routes(locale).project(next.slug)}
        className="group grid h-full min-h-[50svh] items-end md:min-h-[60svh] md:grid-cols-12"
      >
        <div className="order-2 px-5 pb-10 pt-8 md:order-1 md:col-span-6 md:px-8 md:pb-14">
          <p className="meta-label !text-current opacity-70">
            {ui('nextProject', locale)} · {next.code}
          </p>
          <h2 className="font-display-cond mt-3 text-[clamp(2.6rem,9vw,7rem)] transition-transform duration-700 group-hover:translate-x-2">
            {next.title} →
          </h2>
          <p className="mt-3 max-w-[32rem] opacity-80">
            {next.subtitle[locale]}
          </p>
        </div>
        <div className="relative order-1 aspect-[4/3] md:order-2 md:col-span-6 md:aspect-auto md:h-[60svh]">
          <Picture
            photo={hero}
            sizes="(min-width:768px) 50vw, 100vw"
            fill
            imgClassName="object-[50%_20%]"
          />
        </div>
      </Link>
    </section>
  )
}
