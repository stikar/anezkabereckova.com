import type { Credit, Locale, Project } from '@/lib/content'
import { ui } from '@/lib/i18n'

export function Credits({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 md:px-8">
      <div
        className="grid gap-8 border-t pt-6 md:grid-cols-12"
        style={{ borderColor: 'var(--atm-line)' }}
      >
        <div className="md:col-span-8">
          {project.credits && project.credits.length > 0 ? (
            <>
              <p className="meta-label">{ui('credits', locale)}</p>
              <ul className="mt-3 flex flex-col gap-1 text-[0.95rem]">
                {groupByRole(project.credits, locale).map((g) => (
                  <li key={g.role}>
                    <span className="text-atm-muted">{g.role} — </span>
                    {g.people.map((c, i) => (
                      <span key={c.handle}>
                        {i > 0 && ', '}
                        <a
                          href={`https://instagram.com/${c.handle}`}
                          target="_blank"
                          rel="noopener"
                          className="link-line"
                        >
                          {c.name} @{c.handle}
                        </a>
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <ul className="flex flex-col gap-1 text-[0.95rem]">
              {project.meta.map((m) => (
                <li key={m.label.cs}>
                  <span className="text-atm-muted">{m.label[locale]} — </span>
                  {m.value[locale]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function groupByRole(credits: Credit[], locale: Locale) {
  const out: { role: string; people: Credit[] }[] = []
  for (const c of credits) {
    const role = c.role[locale]
    const g = out.find((x) => x.role === role)
    if (g) g.people.push(c)
    else out.push({ role, people: [c] })
  }
  return out
}
