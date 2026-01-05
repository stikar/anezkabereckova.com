import { PhotoGallery } from '@/components/ui/photo-gallery'

export function Portfolio() {
  return (
    <section className="py-4 md:py-8">
      <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-center mb-8 md:mb-12">
        Portfolio
      </h2>

      <PhotoGallery />
    </section>
  )
}
