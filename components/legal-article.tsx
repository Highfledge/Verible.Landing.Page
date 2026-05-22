export interface LegalSection {
  title: string
  paragraphs: string[]
  items?: string[]
}

interface LegalArticleProps {
  lastUpdated: string
  sections: LegalSection[]
}

export function LegalArticle({ lastUpdated, sections }: LegalArticleProps) {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Last updated {lastUpdated}
        </p>
        <p className="mt-3 text-base leading-7 text-slate-600">
          This page explains the rules, expectations, and privacy practices that
          apply when you use Verible&apos;s marketplace trust and verification
          services.
        </p>
      </section>

      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {section.title}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-7 text-slate-600">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {section.items?.length ? (
            <ul className="mt-5 space-y-3 text-base leading-7 text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#D59B0D]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </>
  )
}
