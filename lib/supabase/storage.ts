import { supabase } from './client'

export const GALLERY_BUCKET = 'gallery-images'

/**
 * Get public URL for an image with optional transformation
 * Use resize: 'contain' to ensure aspect ratio is preserved within the bounds.
 */
export function getImageUrl(path: string, options?: {
    width?: number
    height?: number
    quality?: number
}) {
    const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path, {
        transform: options ? {
            width: options.width,
            height: options.height,
            quality: options.quality,
            resize: 'contain', // This ensures the aspect ratio is kept
        } : undefined,
    })

    return data.publicUrl
}

/**
 * Get thumbnail URL
 * By providing both but using 'contain', the image will fit within 600x800
 * without being cropped.
 */
export function getThumbnailUrl(path: string) {
    return getImageUrl(path, {
        width: 600,
        height: 800,
        quality: 80,
    })
}

/**
 * Get full-size image URL
 * Providing only 'width' also automatically preserves aspect ratio.
 */
export function getFullImageUrl(path: string) {
    return getImageUrl(path, {
        width: 2000,
        quality: 90,
    })
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = fileName

  const { data, error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error
  return data.path
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(path: string) {
  const { error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .remove([path])

  if (error) throw error
}
