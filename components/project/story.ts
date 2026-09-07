import type { Photo } from '@/lib/content'

export type Slide =
  | { kind: 'text'; id: string; text: string; caption?: string }
  | { kind: 'piece'; id: string; text: string; photo: Photo | null; n: string }
  | {
      kind: 'photo'
      id: string
      photo: Photo
      back: Photo | null
      label: string
      lookSlug: string
    }
