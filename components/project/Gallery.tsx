import {
  getPhoto,
  getPhotoOrNull,
  lookLabel,
  type GalleryBlock,
  type Locale,
  type Photo,
  type Project,
} from '@/lib/content'
import { Picture } from '@/components/Picture'
import { GalleryPhoto } from './GalleryPhoto'
import { Parallax } from './Parallax'

export function totals(photos: Photo[]) {
  const looks = photos.filter(
    (p) => p.kind === 'look' && p.side !== 'back'
  ).length
  const editorials = photos.filter((p) => p.kind === 'editorial').length
  return { look: looks, editorial: editorials }
}

export function labelFor(p: Photo, tot: { look: number; editorial: number }) {
  return lookLabel(p, p.kind === 'editorial' ? tot.editorial : tot.look)
}

function backOf(project: Project, p: Photo): Photo | null {
  if (!p.pair) return null
  return getPhotoOrNull(`${project.slug}/${p.pair}`)
}

export function Gallery({
  project,
  locale,
  tot,
}: {
  project: Project
  locale: Locale
  tot: { look: number; editorial: number }
}) {
  return (
    <div className="flex flex-col gap-16 md:gap-28">
      {project.gallery.blocks.map((b, i) => (
        <Block key={i} block={b} project={project} locale={locale} tot={tot} />
      ))}
    </div>
  )
}

function Block({
  block,
  project,
  locale,
  tot,
}: {
  block: GalleryBlock
  project: Project
  locale: Locale
  tot: { look: number; editorial: number }
}) {
  const photos = block.photos.map((s) => getPhoto(`${project.slug}/${s}`))
  if (block.type === 'transition') {
    return <Parallax photo={photos[0]} />
  }
  if (block.type === 'full') {
    const p = photos[0]
    return (
      <div className="mx-auto w-full max-w-[1600px]">
        <GalleryPhoto
          photo={p}
          back={backOf(project, p)}
          label={labelFor(p, tot)}
          locale={locale}
          sizes="(min-width:1600px) 1536px, 100vw"
          ratio={p.wide ? 'auto' : 'hero'}
        />
      </div>
    )
  }
  if (block.type === 'details') {
    return (
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-3 px-5 md:grid-cols-3 md:px-8">
        {photos.map((p) => (
          <figure key={p.id} className="reveal">
            <Picture
              photo={p}
              sizes="(min-width:768px) 33vw, 100vw"
              className="aspect-square overflow-hidden"
              imgClassName="h-full w-full object-cover"
            />
            <figcaption className="meta-label mt-2">
              {p.alt.split('—')[1]?.trim() ?? ''}
            </figcaption>
          </figure>
        ))}
      </div>
    )
  }
  const cols = block.type === 'trio' ? 'md:grid-cols-3' : 'md:grid-cols-2'
  const sizes =
    block.type === 'trio'
      ? '(min-width:768px) 33vw, 100vw'
      : '(min-width:768px) 50vw, 100vw'
  return (
    <div
      className={`mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-10 px-5 md:gap-4 md:px-8 ${cols}`}
    >
      {photos.map((p) => (
        <GalleryPhoto
          key={p.id}
          photo={p}
          back={backOf(project, p)}
          label={labelFor(p, tot)}
          locale={locale}
          sizes={sizes}
          ratio="2/3"
        />
      ))}
    </div>
  )
}
