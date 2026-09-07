'use client'
import { useState } from 'react'
import { Picture } from '@/components/Picture'
import type { Locale, Photo } from '@/lib/content'
import { ui } from '@/lib/i18n'
import { s } from './strings'
import { useStory } from './StoryMode'

interface Props {
  photo: Photo
  back?: Photo | null
  label?: string
  locale: Locale
  sizes: string

  ratio?: '2/3' | 'auto' | 'hero'
  priority?: boolean
}

export function GalleryPhoto({
  photo,
  back,
  label,
  locale,
  sizes,
  ratio = 'auto',
  priority,
}: Props) {
  const { open } = useStory()
  const [side, setSide] = useState<'front' | 'back'>('front')
  const fixed = ratio !== 'auto'

  const isHero = ratio === 'hero'
  const boxCls = isHero ? 'md:h-[92svh]' : fixed ? 'aspect-[2/3]' : ''
  const heroBox = isHero
    ? { aspectRatio: `${photo.width} / ${photo.height}` }
    : undefined
  return (
    <figure className={`reveal ${isHero ? 'md:px-8' : ''}`}>
      <div
        className={`fb relative overflow-hidden ${boxCls} ${isHero ? 'md:!aspect-auto' : ''}`}
        style={heroBox}
        data-side={side}
      >
        <button
          type="button"
          className={`cursor-zoom-in ${fixed ? 'absolute inset-0 block h-full w-full' : 'block w-full'}`}
          onClick={() => open(photo.id)}
          aria-label={`${s('openStory', locale)}: ${label ?? photo.alt}`}
        >
          <Picture
            photo={photo}
            sizes={sizes}
            fill={fixed}
            priority={priority}
            imgClassName={isHero ? 'md:object-contain' : 'object-[50%_15%]'}
            style={
              isHero
                ? { backgroundImage: 'none', backgroundColor: 'transparent' }
                : undefined
            }
          />
          {back && (
            <Picture
              photo={back}
              sizes={sizes}
              fill
              className="fb-back"
              imgClassName={isHero ? 'md:object-contain' : 'object-[50%_15%]'}
              style={{
                position: 'absolute',
                inset: 0,
                ...(isHero
                  ? { backgroundImage: 'none', backgroundColor: 'transparent' }
                  : {}),
              }}
            />
          )}
        </button>
      </div>
      {(label || back) && (
        <figcaption
          className={`mt-2 flex items-center justify-between gap-3 ${isHero ? 'px-5 md:px-8' : ''}`}
        >
          {label && <span className="meta-label">{label}</span>}
          {back && (
            <button
              type="button"
              className="meta-label link-line"
              aria-label={s('toggleSide', locale)}
              aria-pressed={side === 'back'}
              onClick={() => setSide((v) => (v === 'front' ? 'back' : 'front'))}
            >
              {side === 'front' ? ui('front', locale) : ui('back', locale)} ⇄
            </button>
          )}
        </figcaption>
      )}
    </figure>
  )
}
