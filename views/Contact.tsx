import Link from 'next/link'
import '@/components/about/about.css'
import { Prose } from '@/components/about/Section'
import { s } from '@/components/about/strings'
import { SITE, TEXTS, type Locale } from '@/lib/content'
import { routes, ui } from '@/lib/i18n'

export function Contact({ locale }: { locale: Locale }) {
  const T = TEXTS
  const r = routes(locale)
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pb-10 pt-28 md:px-8 md:pt-40">
        <p className="meta-label mb-4">{T.contact.heading[locale]}</p>
        <h1 className="font-display-cond text-h1 mb-10 md:mb-14">
          {T.contact.cta[locale]}
        </h1>
        <Prose paragraphs={T.contact.p[locale]} />
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-12 md:px-8 md:py-20">
        <p className="meta-label mb-3">{s('email', locale)}</p>
        <a
          href={`mailto:${SITE.email}`}
          className="ab-email font-display-cond block leading-[0.95] transition-opacity hover:opacity-70"
        >
          {SITE.email.split('@')[0]}@<wbr />
          {SITE.email.split('@')[1]}
        </a>
        <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-[1.125rem]">
          <li>
            <a
              className="link-line"
              href={SITE.instagram}
              rel="noopener"
              target="_blank"
            >
              Instagram {SITE.instagramHandle}
            </a>
          </li>
          <li>
            <a
              className="link-line"
              href={SITE.linkedin}
              rel="noopener"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
          <li className="text-atm-muted">{SITE.cityLong[locale]}</li>
        </ul>
      </section>

      <section
        className="reveal mx-auto max-w-[1600px] border-t px-5 py-16 md:px-8 md:py-24"
        style={{ borderColor: 'var(--atm-line)' }}
      >
        <h2 className="font-display-cond text-h2 mb-8 md:mb-12">
          {T.collaboration.heading[locale]}
        </h2>
        <Prose paragraphs={T.collaboration.p[locale]} />
      </section>
    </>
  )
}
