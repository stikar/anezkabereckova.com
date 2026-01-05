import { supabase, type GalleryImage } from './client'

/**
 * Fetch all active (non-deleted) gallery images ordered by display_order
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .is('deleted_at', null)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }

  return data || []
}

/**
 * Fetch deleted gallery images
 */
export async function getDeletedImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })

  if (error) {
    console.error('Error fetching deleted images:', error)
    return []
  }

  return data || []
}

/**
 * Add a new image to the gallery
 */
export async function addGalleryImage(
  storagePath: string,
  altText: string = 'Portfolio image',
  width?: number,
  height?: number
) {
  // Get the highest display_order and add 1
  const { data: maxOrderData } = await supabase
    .from('gallery_images')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const newOrder = (maxOrderData?.display_order || 0) + 1

  const { data, error } = await supabase
    .from('gallery_images')
    .insert({
      storage_path: storagePath,
      alt_text: altText,
      display_order: newOrder,
      width,
      height
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Soft delete an image from the gallery
 */
export async function deleteGalleryImage(id: string) {
  const { error } = await supabase
    .from('gallery_images')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

/**
 * Restore a soft-deleted image
 */
export async function restoreGalleryImage(id: string) {
  const { error } = await supabase
    .from('gallery_images')
    .update({ deleted_at: null })
    .eq('id', id)

  if (error) throw error
}

/**
 * Permanently delete an image from the database
 */
export async function permanentlyDeleteGalleryImage(id: string) {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Update image order
 */
export async function updateImageOrder(id: string, newOrder: number) {
  const { error } = await supabase
    .from('gallery_images')
    .update({ display_order: newOrder })
    .eq('id', id)

  if (error) throw error
}

/**
 * Update image alt text/title
 */
export async function updateImageAltText(id: string, altText: string) {
  const { error } = await supabase
    .from('gallery_images')
    .update({ alt_text: altText })
    .eq('id', id)

  if (error) throw error
}

/**
 * Reorder all images based on new order array
 */
export async function reorderImages(imageIds: string[]) {
  const updates = imageIds.map((id, index) => ({
    id,
    display_order: index + 1
  }))

  const { error } = await supabase
    .from('gallery_images')
    .upsert(updates)

  if (error) throw error
}
