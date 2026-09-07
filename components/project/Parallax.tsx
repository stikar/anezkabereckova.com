'use client'
import { useEffect, useRef } from 'react'
import { Picture } from '@/components/Picture'
import type { Photo } from '@/lib/content'

export function Parallax({ photo }: { photo: Photo }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (r.top + r.height / 2 - vh / 2) / (vh + r.height)
      const y = Math.max(-5, Math.min(5, -progress * 10))
      el.style.transform = `translate3d(0, ${y}%, 0) scale(1.1)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/9]"
      style={{ contain: 'paint' }}
    >
      <div ref={ref} className="parallax-media absolute inset-0">
        <Picture photo={photo} sizes="100vw" fill />
      </div>
    </div>
  )
}
