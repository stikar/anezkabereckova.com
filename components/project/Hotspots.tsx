'use client'
import { useEffect, useRef, useState } from 'react'
import { Picture } from '@/components/Picture'
import type { Locale, Photo } from '@/lib/content'
import { s } from './strings'

export interface Spot {
  x: number
  y: number
  cs: string
  en: string
}

export function Hotspots({
  photo,
  spots,
  locale,
  sizes = '100vw',
  className = '',
  showHint = false,
}: {
  photo: Photo
  spots: Spot[]
  locale: Locale
  sizes?: string
  className?: string

  showHint?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`hotspots relative overflow-clip [contain:paint] ${className}`}
    >
      <Picture photo={photo} sizes={sizes} />
      {showHint && (
        <p className="hotspot-hint meta-label absolute left-4 top-4 !text-paper opacity-70 mix-blend-difference">
          {s('hotspotHint', locale)}
        </p>
      )}
      {spots.map((sp, i) => (
        <button
          key={i}
          type="button"
          className="hotspot absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
          aria-expanded={openIdx === i}
          aria-label={sp[locale]}
          onClick={() => setOpenIdx((v) => (v === i ? null : i))}
        >
          <span className="hotspot-ring block" />
          <span
            className={`hotspot-label meta-label absolute top-1/2 w-max max-w-[11rem] -translate-y-1/2 whitespace-normal bg-paper px-2 py-1 text-left !text-ink md:max-w-[14rem] ${
              sp.x > 50
                ? 'right-[calc(100%+10px)] text-right'
                : 'left-[calc(100%+10px)]'
            }`}
          >
            {sp[locale]}
          </span>
        </button>
      ))}
    </div>
  )
}
