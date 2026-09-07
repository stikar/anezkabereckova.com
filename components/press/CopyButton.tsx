'use client'
import { useRef, useState } from 'react'
import type { Locale } from '@/lib/content'
import { ui } from '@/lib/i18n'

export function CopyButton({ text, locale }: { text: string; locale: Locale }) {
  const [done, setDone] = useState(false)
  const timer = useRef<number | null>(null)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setDone(false), 1800)
    } catch {}
  }
  return (
    <button type="button" className="kit-btn" onClick={copy} aria-live="polite">
      {done ? ui('copied', locale) : ui('copy', locale)}
    </button>
  )
}
