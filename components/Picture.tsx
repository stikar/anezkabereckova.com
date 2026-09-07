import type { CSSProperties } from 'react'
import { preload } from 'react-dom'
import type { Photo } from '@/lib/content'

interface Props {
  photo: Photo

  sizes: string
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties

  alt?: string

  fill?: boolean
  draggable?: boolean
}

function candidates(photo: Photo, priority: boolean) {
  const cap = priority ? 1600 : 1080
  const ws = photo.widths.filter((w) => w <= cap)
  return ws.length ? ws : photo.widths.slice(0, 1)
}

function srcset(photo: Photo, ext: 'avif' | 'webp', priority = false) {
  return candidates(photo, priority)
    .map((w) => `/images/${photo.set}/${photo.slug}-${w}.${ext} ${w}w`)
    .join(', ')
}

export function Picture({
  photo,
  sizes,
  priority = false,
  className = '',
  imgClassName = '',
  style,
  alt,
  fill = false,
  draggable = false,
}: Props) {
  const largest = photo.widths[photo.widths.length - 1]
  const fallback = `/images/${photo.set}/${photo.slug}-${Math.min(1080, largest)}.webp`
  if (priority) {
    preload(fallback, {
      as: 'image',
      imageSrcSet: srcset(photo, 'avif', true),
      imageSizes: sizes,
      fetchPriority: 'high',
    })
  }
  return (
    <picture
      className={`${fill ? 'absolute inset-0' : 'block'} ${className}`}
      style={{
        backgroundImage: `url(${photo.blur})`,
        backgroundSize: 'cover',
        backgroundColor: photo.dominant,
        ...style,
      }}
    >
      <source
        type="image/avif"
        srcSet={srcset(photo, 'avif', priority)}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={srcset(photo, 'webp', priority)}
        sizes={sizes}
      />
      <img
        src={fallback}
        width={photo.width}
        height={photo.height}
        alt={alt ?? photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={draggable}
        className={`${fill ? 'h-full w-full object-cover' : 'h-auto w-full'} ${imgClassName}`}
      />
    </picture>
  )
}

export function heroPreloadProps(photo: Photo, sizes: string) {
  return {
    rel: 'preload',
    as: 'image',
    type: 'image/avif',
    imageSrcSet: srcset(photo, 'avif', true),
    imageSizes: sizes,
  } as const
}
