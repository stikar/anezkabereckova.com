'use client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Picture } from '@/components/Picture'
import type { Locale } from '@/lib/content'
import { ui } from '@/lib/i18n'
import { s } from './strings'
import type { Slide } from './story'

interface StoryCtx {
  open: (slideId: string) => void
}
const Ctx = createContext<StoryCtx>({ open: () => {} })
export const useStory = () => useContext(Ctx)

interface Props {
  locale: Locale
  slides: Slide[]

  initialId?: string

  baseUrl: string
  atmosphere: { bg: string; fg: string }
  children: React.ReactNode
}

export function StoryProvider({
  locale,
  slides,
  initialId,
  baseUrl,
  atmosphere,
  children,
}: Props) {
  const initialIndex = useMemo(
    () => (initialId ? slides.findIndex((x) => x.id === initialId) : -1),
    [initialId, slides]
  )
  const [index, setIndex] = useState<number>(initialIndex)
  const [active, setActive] = useState<number>(Math.max(initialIndex, 0))
  const [sides, setSides] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const activeRef = useRef(active)
  activeRef.current = active
  const rafRef = useRef(0)
  const lookUrl = useCallback((ls: string) => `${baseUrl}/${ls}`, [baseUrl])
  const touch = useRef<{ x: number; y: number; t: number } | null>(null)
  const isOpen = index >= 0

  const open = useCallback(
    (slideId: string) => {
      const i = slides.findIndex((x) => x.id === slideId)
      if (i >= 0) {
        openerRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null
        setIndex(i)
        setActive(i)
      }
    },
    [slides]
  )

  const close = useCallback(() => setIndex(-1), [])

  const go = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current
      if (!track) return
      const cur = Math.round(track.scrollLeft / track.clientWidth)
      const next = Math.min(slides.length - 1, Math.max(0, cur + dir))
      track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' })
    },
    [slides.length]
  )

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const track = trackRef.current
    if (track) {
      track.scrollTo({ left: index * track.clientWidth, behavior: 'instant' })
    }
    const dialog = dialogRef.current
    dialog?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close()
      if (e.key === 'ArrowRight') return go(1)
      if (e.key === 'ArrowLeft') return go(-1)
      if (e.key === 'Tab' && dialog) {
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>('button:not([disabled])')
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const el = document.activeElement
        if (e.shiftKey && (el === first || el === dialog)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && el === last) {
          e.preventDefault()
          first.focus()
        } else if (!dialog.contains(el)) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const opener = openerRef.current
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      opener?.focus({ preventScroll: true })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, close, go])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isOpen) {
      if (
        window.location.pathname.replace(/\/$/, '') !==
        baseUrl.replace(/\/$/, '')
      ) {
        if (window.location.pathname.startsWith(baseUrl)) {
          window.history.replaceState(null, '', baseUrl + '/')
        }
      }
      return
    }
    const sl = slides[active]
    if (sl && sl.kind === 'photo') {
      window.history.replaceState(null, '', lookUrl(sl.lookSlug) + '/')
    }
  }, [isOpen, active, slides, baseUrl, lookUrl])

  const onScroll = () => {
    const track = trackRef.current
    if (!track || rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      const i = Math.round(track.scrollLeft / track.clientWidth)
      setActive((cur) => (cur === i ? cur : i))
    })
  }

  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const w = rect.width
    const x = e.clientX - rect.left
    if (x < w * 0.25) return go(-1)
    if (x > w * 0.75) return go(1)
    const sl = slides[activeRef.current]
    if (sl?.kind === 'photo' && sl.back) {
      setSides((m) => ({ ...m, [sl.id]: !m[sl.id] }))
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY, t: Date.now() }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const st = touch.current
    if (!st) return
    const t = e.changedTouches[0]
    const dy = t.clientY - st.y
    const dx = Math.abs(t.clientX - st.x)
    if (dy > 90 && dx < 60 && Date.now() - st.t < 700) close()
    touch.current = null
  }

  const share = async () => {
    const sl = slides[active]
    if (!sl || sl.kind !== 'photo') return
    const url = window.location.origin + lookUrl(sl.lookSlug) + '/'
    const title = `${sl.label} — Anežka Berecková`
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url)
      setToast(s('linkCopied', locale))
      setTimeout(() => setToast(null), 1800)
    } catch {}
  }

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="story outline-none"
          role="dialog"
          aria-modal="true"
          aria-label={s('storyLabel', locale)}
          style={{ background: atmosphere.bg, color: atmosphere.fg }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="story-progress absolute inset-x-3 top-3 z-10 flex gap-1">
            {slides.map((sl, i) => (
              <span
                key={sl.id}
                data-state={
                  i < active ? 'done' : i === active ? 'active' : 'todo'
                }
              >
                <i />
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={close}
            className="meta-label absolute right-4 top-6 z-20 !text-current"
            aria-label={ui('close', locale)}
          >
            {ui('close', locale)} ×
          </button>

          <div
            ref={trackRef}
            className="story-track"
            onScroll={onScroll}
            onClick={onTap}
          >
            {slides.map((sl, i) => (
              <div
                className="story-slide"
                key={sl.id}
                aria-hidden={i !== active}
              >
                {Math.abs(i - active) > 1
                  ? null
                  : sl.kind === 'text' && (
                      <div className="flex h-full flex-col justify-center px-8">
                        {sl.caption && (
                          <p className="meta-label mb-6 !text-current opacity-70">
                            {sl.caption}
                          </p>
                        )}
                        <p className="font-display-wide text-[clamp(1.6rem,6vw,3.2rem)]">
                          {sl.text}
                        </p>
                      </div>
                    )}
                {Math.abs(i - active) <= 1 && sl.kind === 'piece' && (
                  <div className="relative h-full">
                    {sl.photo && (
                      <Picture
                        photo={sl.photo}
                        sizes="100vw"
                        fill
                        priority={Math.abs(i - active) <= 1}
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-14 pt-24">
                      <p className="meta-label !text-paper opacity-80">
                        {sl.n}
                      </p>
                      <p className="font-display-cond mt-2 text-[clamp(2rem,9vw,4rem)] !text-paper">
                        {sl.text}
                      </p>
                    </div>
                  </div>
                )}
                {Math.abs(i - active) <= 1 && sl.kind === 'photo' && (
                  <div className="relative h-full">
                    <Picture
                      photo={sl.photo}
                      sizes="100vw"
                      fill
                      priority={Math.abs(i - active) <= 1}
                      style={{
                        opacity: sides[sl.id] && sl.back ? 0 : 1,
                        transition: 'opacity 300ms',
                      }}
                    />
                    {sl.back && (
                      <Picture
                        photo={sl.back}
                        sizes="100vw"
                        fill
                        priority={Math.abs(i - active) <= 1}
                        style={{
                          opacity: sides[sl.id] ? 1 : 0,
                          transition: 'opacity 300ms',
                        }}
                      />
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent px-5 pb-6 pt-20 pr-36">
                      <p className="meta-label !text-paper">
                        {sl.label}
                        {sl.back && (
                          <span className="ml-3 opacity-70">
                            {sides[sl.id]
                              ? ui('back', locale)
                              : ui('front', locale)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="story-arrow left-4"
            onClick={() => go(-1)}
            aria-label={s('prev', locale)}
            disabled={active === 0}
          >
            ←
          </button>
          <button
            type="button"
            className="story-arrow right-4"
            onClick={() => go(1)}
            aria-label={s('next', locale)}
            disabled={active === slides.length - 1}
          >
            →
          </button>

          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-4">
            {toast && <span className="meta-label !text-current">{toast}</span>}
            {slides[active]?.kind === 'photo' && (
              <button
                type="button"
                onClick={share}
                className="meta-label rounded-full border border-current/40 px-3 py-2 !text-current"
              >
                {ui('shareLook', locale)}
              </button>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}
