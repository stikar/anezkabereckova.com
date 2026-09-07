import Link from 'next/link'
import '@/components/about/about.css'
import { Picture } from '@/components/Picture'
import { getPhoto, type Locale } from '@/lib/content'
import { routes, ui } from '@/lib/i18n'

export function NotFound({ locale }: { locale: Locale }) {
  const r = routes(locale)
  const ghost = getPhoto('milano-cortina-2026/motion-01')
  return (
    <section className="ab-404 relative flex flex-col justify-end overflow-hidden text-paper">
      <Picture photo={ghost} sizes="100vw" priority fill alt="" />
      <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-16 pt-40 md:px-8 md:pb-24">
        <h1 className="font-display-cond text-h1 max-w-[14ch] leading-[0.92]">
          {ui('notFound', locale)}
        </h1>
        <p className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-[1.125rem]">
          <Link href={r.projects} className="link-line">
            {ui('projectsLink', locale)}
          </Link>
          <Link href={r.home} className="link-line">
            {ui('homeLink', locale)}
          </Link>
        </p>
      </div>
    </section>
  )
}
