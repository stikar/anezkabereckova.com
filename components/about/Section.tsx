export function Section({
  heading,
  children,
  className = '',
  id,
}: {
  heading?: string
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={`reveal mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24 ${className}`}
    >
      {heading && (
        <h2 className="font-display-cond text-h2 mb-8 md:mb-12">{heading}</h2>
      )}
      {children}
    </section>
  )
}

export function Prose({
  paragraphs,
  className = '',
}: {
  paragraphs: string[]
  className?: string
}) {
  return (
    <div
      className={`max-w-[40rem] space-y-5 text-[1.125rem] leading-[1.6] md:text-[1.25rem] ${className}`}
    >
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}
