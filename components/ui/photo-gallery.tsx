'use client'

import * as React from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { getGalleryImages } from '@/lib/supabase/gallery'
import { getThumbnailUrl, getFullImageUrl } from '@/lib/supabase/storage'
import type { GalleryImage } from '@/lib/supabase/client'

export function PhotoGallery() {
  const [images, setImages] = React.useState<GalleryImage[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadImages() {
      try {
        const data = await getGalleryImages()
        setImages(data)
      } catch (error) {
        console.error('Failed to load gallery images:', error)
      } finally {
        setLoading(false)
      }
    }
    loadImages()
  }, [])
  const [open, setOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()

  // Lock body scroll when lightbox is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Sync carousel with current index
  React.useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap())
    })
  }, [api])

  // Navigate to specific slide when opening lightbox
  React.useEffect(() => {
    if (api && open) {
      api.scrollTo(currentIndex, true)
    }
  }, [api, open, currentIndex])

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        api?.scrollPrev()
      } else if (e.key === 'ArrowRight') {
        api?.scrollNext()
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, api])

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setOpen(true)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No images in gallery yet. Visit <a href="/admin" className="underline hover:text-gray-700">/admin</a> to add images.
      </div>
    )
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer relative group focus:outline-none"
          >
            <Image
              src={getThumbnailUrl(image.storage_path)}
              alt={image.alt_text}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 border-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            <DialogTitle className="sr-only">Photo Gallery</DialogTitle>
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close lightbox"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 text-white text-sm bg-black/30 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Image title */}
            {images[currentIndex]?.alt_text && (
              <div className="absolute bottom-4 left-0 right-0 z-50 text-center pointer-events-none">
                <p className="text-white/90 text-sm font-normal tracking-wide px-12 drop-shadow-md">
                  {images[currentIndex].alt_text}
                </p>
              </div>
            )}

            {/* Carousel */}
            <Carousel
              setApi={setApi}
              className="w-full h-full focus:outline-none"
              opts={{
                loop: true,
                startIndex: currentIndex,
              }}
            >
              <CarouselContent className="h-full">
                {images.map((image, index) => (
                  <CarouselItem key={image.id} className="h-full flex items-center justify-center focus:outline-none">
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto focus:outline-none">
                      <Image
                        src={getFullImageUrl(image.storage_path)}
                        alt={image.alt_text}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority={index === currentIndex}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-0" />
              <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-0" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
