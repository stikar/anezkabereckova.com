'use client'
import { useState } from 'react'
import type { Locale } from '@/lib/content'
import { ui } from '@/lib/i18n'

export function ViewToggle({
  locale,
  visual,
  index,
}: {
  locale: Locale
  visual: React.ReactNode
  index: React.ReactNode
}) {
  const [mode, setMode] = useState<'visual' | 'index'>('visual')
  return (
    <div>
      <div
        className="mb-8 flex gap-6"
        role="tablist"
        aria-label="Visual / Index"
      >
        {(['visual', 'index'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`meta-label !text-current transition-opacity ${mode === m ? 'underline underline-offset-[6px]' : 'opacity-70 hover:opacity-100'}`}
          >
            {ui(m, locale)}
          </button>
        ))}
      </div>
      <div hidden={mode !== 'visual'}>{visual}</div>
      <div hidden={mode !== 'index'}>{index}</div>
    </div>
  )
}
