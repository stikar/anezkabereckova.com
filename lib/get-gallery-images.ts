// This function returns the list of gallery images
// Images should be placed in public/gallery/ folder with names like: 1.jpg, 2.jpg, etc.

export interface GalleryImage {
  src: string
  alt: string
  width: number
  height: number
}

export function getGalleryImages(): GalleryImage[] {
  // List of images - update this array when adding new images
  // Images are stored in public/gallery/
  const imageCount = 10 // Change this number based on how many images you have

  const images: GalleryImage[] = []

  for (let i = 1; i <= imageCount; i++) {
    images.push({
      src: `/gallery/${i}.jpg`,
      alt: `Portfolio image ${i}`,
      width: 800,
      height: 1200, // 3:4 aspect ratio
    })
  }

  return images
}
