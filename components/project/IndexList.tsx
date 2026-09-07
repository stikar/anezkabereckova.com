'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Picture } from '@/components/Picture'
import type { Photo } from '@/lib/content'

export interface IndexRow {
  id: string
  href: string
  label: string
  code: string
  title: string
  photographer?: string
  words?: string
  photo: Photo
}

export function IndexList({ rows }: { rows: IndexRow[] }) {
  const [hover, setHover] = useState<IndexRow | null>(null)
  return (
    <div className="index-list">
      {rows.map((r) => (
        <Link
          key={r.id}
          href={r.href}
          className="index-row"
          onMouseEnter={() => setHover(r)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(r)}
          onBlur={() => setHover(null)}
        >
          <span className="meta-label !text-current">{r.label}</span>
          <span className="meta-label">{r.code}</span>
          <span className="font-display-cond text-[1.4rem] leading-none md:text-[1.7rem]">
            {r.title}
          </span>
          <span className="hidden text-atm-muted md:block">
            {r.photographer ?? ''}
          </span>
          <span className="hidden text-atm-muted md:block">
            {r.words ?? ''}
          </span>
        </Link>
      ))}
      <div className="index-row !border-b" aria-hidden="true" />
      <div
        className={`index-preview hidden md:block ${hover ? 'is-on' : ''}`}
        aria-hidden="true"
      >
        {hover && (
          <Picture
            photo={hover.photo}
            sizes="300px"
            className="aspect-[3/4] overflow-hidden"
            imgClassName="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  )
}
