'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { getGalleryImages, addGalleryImage, deleteGalleryImage, reorderImages } from '@/lib/supabase/gallery'
import { uploadImage, deleteImage, getThumbnailUrl } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { GalleryImage } from '@/lib/supabase/client'

export default function AdminDashboard() {
  const [user, setUser] = React.useState<any>(null)
  const [images, setImages] = React.useState<GalleryImage[]>([])
  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    checkAuth()
    loadImages()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin')
      return
    }
    setUser(session.user)
  }

  async function loadImages() {
    setLoading(true)
    try {
      const data = await getGalleryImages()
      setImages(data)
    } catch (error) {
      console.error('Failed to load images:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Upload to storage
      const storagePath = await uploadImage(file)

      // Add to database
      await addGalleryImage(storagePath, `Portfolio image`)

      // Reload images
      await loadImages()

      // Reset input
      e.target.value = ''
    } catch (error: any) {
      alert('Failed to upload image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(image: GalleryImage) {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      // Delete from database
      await deleteGalleryImage(image.id)

      // Delete from storage
      await deleteImage(image.storage_path)

      // Reload images
      await loadImages()
    } catch (error: any) {
      alert('Failed to delete image: ' + error.message)
    }
  }

  async function moveUp(index: number) {
    if (index === 0) return

    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index - 1]
    newImages[index - 1] = temp

    setImages(newImages)
    await reorderImages(newImages.map(img => img.id))
  }

  async function moveDown(index: number) {
    if (index === images.length - 1) return

    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp

    setImages(newImages)
    await reorderImages(newImages.map(img => img.id))
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl tracking-wide">Gallery Management</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/')}>
              View Site
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Upload New Image</h2>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="max-w-md"
            />
            {uploading && <span className="text-sm text-gray-600">Uploading...</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Supported formats: JPG, PNG, WebP. Images will be automatically optimized.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-4">Gallery Images ({images.length})</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No images yet. Upload your first image above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div key={image.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="aspect-[3/4] relative bg-gray-100 dark:bg-gray-900">
                    <Image
                      src={getThumbnailUrl(image.storage_path)}
                      alt={image.alt_text}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Order: {image.display_order}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        ↑ Move Up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveDown(index)}
                        disabled={index === images.length - 1}
                      >
                        ↓ Move Down
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDelete(image)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
