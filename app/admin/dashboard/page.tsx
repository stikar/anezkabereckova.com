'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  reorderImages,
  updateImageAltText,
} from '@/lib/supabase/gallery'
import {
  uploadImage,
  deleteImage,
  getThumbnailUrl,
} from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { GalleryImage } from '@/lib/supabase/client'

import {
  getPendingAdmins,
  approveAdmin,
  isAdminApproved,
  type AdminUser,
} from '@/lib/supabase/admin'

export default function AdminDashboard() {
  const [user, setUser] = React.useState<any>(null)
  const [activeTab, setActiveTab] = React.useState<'gallery' | 'users'>(
    'gallery'
  )

  // Gallery state
  const [images, setImages] = React.useState<GalleryImage[]>([])
  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingText, setEditingText] = React.useState('')

  // Users state
  const [pendingUsers, setPendingUsers] = React.useState<AdminUser[]>([])
  const [loadingUsers, setLoadingUsers] = React.useState(false)

  const router = useRouter()

  React.useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin')
        return
      }

      try {
        const approved = await isAdminApproved(session.user.id)
        if (!approved) {
          await supabase.auth.signOut()
          router.push('/admin')
          return
        }
        setUser(session.user)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin')
      }
    }
    checkAuth()
  }, [router])

  React.useEffect(() => {
    if (user) {
      if (activeTab === 'gallery') {
        loadImages()
      } else {
        loadPendingUsers()
      }
    }
  }, [user, activeTab])

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

  async function loadPendingUsers() {
    setLoadingUsers(true)
    try {
      const data = await getPendingAdmins()
      setPendingUsers(data)
    } catch (error) {
      console.error('Failed to load pending users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  async function handleApproveUser(id: string) {
    try {
      await approveAdmin(id)
      await loadPendingUsers()
    } catch (error: any) {
      alert('Failed to approve user: ' + error.message)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  // ... (keep handleUpload, handleDelete, moveUp, moveDown, startEditing, saveAltText, cancelEditing as is)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Upload to storage
      const storagePath = await uploadImage(file)

      // Add to database
      await addGalleryImage(storagePath)

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
    if (
      !confirm(
        'Are you sure you want to delete this image? (It will be soft-deleted and can be restored later)'
      )
    )
      return

    try {
      // Soft delete from database
      await deleteGalleryImage(image.id)

      // Note: We don't delete from storage to allow restoration

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
    await reorderImages(newImages.map((img) => img.id))
  }

  async function moveDown(index: number) {
    if (index === images.length - 1) return

    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp

    setImages(newImages)
    await reorderImages(newImages.map((img) => img.id))
  }

  function startEditing(image: GalleryImage) {
    setEditingId(image.id)
    setEditingText(image.alt_text)
  }

  async function saveAltText(id: string) {
    try {
      await updateImageAltText(id, editingText)
      setEditingId(null)
      await loadImages()
    } catch (error: any) {
      alert('Failed to update title: ' + error.message)
    }
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingText('')
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
            <h1 className="font-serif text-2xl tracking-wide">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
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

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 mt-4 flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'gallery'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Gallery Management
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            User Approval
            {pendingUsers.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                {pendingUsers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'gallery' ? (
          <>
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-xs">
              <h2 className="text-xl font-medium mb-4">Upload New Image</h2>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="max-w-md"
                />
                {uploading && (
                  <span className="text-sm text-gray-600">Uploading...</span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Supported formats: JPG, PNG, WebP. Images will be automatically
                optimized.
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
              <h2 className="text-xl font-medium mb-4">
                Gallery Images ({images.length})
              </h2>

              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading...
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No images yet. Upload your first image above.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <div className="aspect-3/4 relative bg-gray-100 dark:bg-gray-900">
                        <Image
                          src={getThumbnailUrl(image.storage_path)}
                          alt={image.alt_text}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Order: {image.display_order}
                        </div>

                        {/* Image Title/Name Editor */}
                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Image Name/Title
                          </label>
                          {editingId === image.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                placeholder="Enter image name"
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => saveAltText(image.id)}
                                  className="flex-1"
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEditing}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="text-sm flex-1 truncate">
                                {image.alt_text || 'No name'}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(image)}
                                className="text-xs"
                              >
                                Edit
                              </Button>
                            </div>
                          )}
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
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
            <h2 className="text-xl font-medium mb-4">Pending User Approvals</h2>

            {loadingUsers ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No pending user approvals.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((pUser) => (
                  <div
                    key={pUser.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{pUser.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined:{' '}
                        {new Date(pUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button onClick={() => handleApproveUser(pUser.id)}>
                      Approve
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
