import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StickyBottomBar } from "@/components/sticky-bottom-bar"

interface SitePageShellProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
}

export function SitePageShell({
  eyebrow,
  title,
  description,
  children,
  actions,
}: SitePageShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(213,155,13,0.18),_transparent_38%),linear-gradient(135deg,_#ffffff_0%,_#eef4ff_55%,_#f8fafc_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(29,41,115,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(29,41,115,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative max-w-5xl mx-auto px-6 py-14 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span>{title}</span>
          </Link>

          <div className="mt-6 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1D2973]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
              {title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {description}
            </p>
            {actions ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <main className="px-6 py-10 pb-32">
        <div className="max-w-5xl mx-auto space-y-8">{children}</div>
      </main>

      <Footer />
      <StickyBottomBar />
    </div>
  )
}
