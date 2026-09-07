'use client'
import { useEffect, useRef, useState } from 'react'
import { Picture } from '@/components/Picture'
import type { Locale, Photo } from '@/lib/content'
import {
  useHeroVariant,
  useMediaQuery,
  useOrientation,
  useSaveData,
  type HeroVariant,
  useWindowLoaded,
} from './hooks'
import { hui } from './strings'

interface Props {
  locale: Locale

  frames: Photo[]
  name: string
  tagline: string
  scrollHint: string
}

export function Hero({ locale, frames, name, tagline, scrollHint }: Props) {
  const variant = useHeroVariant()
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const saveData = useSaveData()
  const still = reduced || saveData
  const isScroll = variant === 'scroll' && !still

  return (
    <section
      className={`hero relative text-paper ${isScroll ? 'hero--scroll' : ''}`}
      aria-label={hui('heroVideoLabel', locale)}
    >
      <div className="hero__stage grain relative overflow-hidden bg-[#0B1A3A]">
        <Picture
          photo={frames[0]}
          sizes="100vw"
          priority
          fill
          className="hero__frame is-on"
          alt=""
        />
        {!still && variant === 'film' && <Film />}
        {!still && variant === 'crossfade' && <Crossfade frames={frames} />}
        {isScroll && <ScrollSequence frames={frames} />}

        <div className="hero__shade" aria-hidden="true" />

        <div className="hero__text">
          <h1 className="hero__name font-display-cond text-name">{name}</h1>
          <p className="hero__tagline">{tagline}</p>
        </div>
        <p className="hero__hint meta-label" aria-hidden="true">
          {scrollHint}
        </p>
      </div>
    </section>
  )
}

function Film() {
  const orientation = useOrientation()
  const loaded = useWindowLoaded()

  if (!orientation || !loaded) return null
  return (
    <FilmVideo src={orientation === 'portrait' ? 'hero-9x16' : 'hero-16x9'} />
  )
}

function FilmVideo({ src }: { src: 'hero-9x16' | 'hero-16x9' }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  const lastSrc = useRef(src)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (lastSrc.current !== src) {
      lastSrc.current = src
      v.load()
    }
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [src])

  return (
    <video
      key={src}
      ref={ref}
      className={`hero__video ${ready ? 'is-on' : ''}`}
      muted
      autoPlay
      playsInline
      loop
      preload="metadata"
      poster={`/video/${src}-poster.avif`}
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setReady(true)}
      onCanPlay={() => setReady(true)}
    >
      <source src={`/video/${src}.webm`} type="video/webm" />
      <source src={`/video/${src}.mp4`} type="video/mp4" />
    </video>
  )
}

function Crossfade({ frames }: { frames: Photo[] }) {
  const n = frames.length
  return (
    <div className="hero__xfade" style={{ ['--n' as string]: n }}>
      {frames.map((f, i) => (
        <Picture
          key={f.id}
          photo={f}
          sizes="100vw"
          fill
          priority={i === 0}
          alt=""
          className="hero__xframe"
          style={{ animationDelay: `${i * 7}s` }}
        />
      ))}
    </div>
  )
}

function ScrollSequence({ frames }: { frames: Photo[] }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const RANGE = 600
    const onScroll = () => {
      const y = Math.max(0, Math.min(window.scrollY, RANGE))
      setIdx(
        Math.min(frames.length - 1, Math.floor((y / RANGE) * frames.length))
      )
    }
    const raf = requestAnimationFrame(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [frames.length])
  return (
    <>
      {frames.map((f, i) => (
        <Picture
          key={f.id}
          photo={f}
          sizes="100vw"
          fill
          alt=""
          priority={i === 0}
          className={`hero__frame ${i === idx ? 'is-on' : ''}`}
        />
      ))}
    </>
  )
}

export type { HeroVariant }
