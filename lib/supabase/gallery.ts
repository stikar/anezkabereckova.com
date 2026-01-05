import { supabase, type GalleryImage } from './client'

/**
 * Fetch all gallery images ordered by display_order
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching gallery images:', error)
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
 * Delete an image from the gallery
 */
export async function deleteGalleryImage(id: string) {
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
