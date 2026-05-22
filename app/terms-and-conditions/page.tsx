import type { Metadata } from "next"
import { LegalArticle } from "@/components/legal-article"
import { SitePageShell } from "@/components/site-page-shell"
import { legalLastUpdated, termsSections } from "@/lib/content/legal"

export const metadata: Metadata = {
  title: "Terms and Conditions | Verible",
  description:
    "Read the Terms and Conditions that govern your use of Verible's marketplace trust and verification services.",
}

export default function TermsAndConditionsPage() {
  return (
    <SitePageShell
      eyebrow="Legal"
      title="Terms and Conditions"
      description="The rules below explain how Verible can be used, what we expect from account holders, and the limits that apply to trust scores, alerts, and verification tools."
    >
      <LegalArticle
        lastUpdated={legalLastUpdated}
        sections={termsSections}
      />
    </SitePageShell>
  )
}
