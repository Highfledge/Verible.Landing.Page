import type { Metadata } from "next"
import { LegalArticle } from "@/components/legal-article"
import { SitePageShell } from "@/components/site-page-shell"
import { legalLastUpdated, privacySections } from "@/lib/content/legal"

export const metadata: Metadata = {
  title: "Privacy Policy | Verible",
  description:
    "Learn what information Verible collects, how it is used, and the choices available to users.",
}

export default function PrivacyPolicyPage() {
  return (
    <SitePageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      description="This policy explains what information Verible processes, why we use it, how we protect it, and the choices users may have regarding their data."
    >
      <LegalArticle
        lastUpdated={legalLastUpdated}
        sections={privacySections}
      />
    </SitePageShell>
  )
}
