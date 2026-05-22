import type { Metadata } from "next"
import Link from "next/link"
import {
  CircleCheck,
  FileText,
  LifeBuoy,
  LockKeyhole,
  Mail,
  ShieldAlert,
  Store,
  UserRoundSearch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SitePageShell } from "@/components/site-page-shell"

export const metadata: Metadata = {
  title: "Support | Verible",
  description:
    "Get help with your Verible account, seller verification, onboarding, and trust or safety issues.",
}

const supportCards = [
  {
    title: "Buyer support",
    description:
      "Questions about seller lookups, trust scores, alerts, or account access.",
    href: "mailto:help@verible.com?subject=Buyer%20Support%20Request",
    cta: "Email buyer support",
    icon: UserRoundSearch,
  },
  {
    title: "Seller support",
    description:
      "Help with onboarding, profile claims, verification steps, or business details.",
    href: "mailto:help@verible.com?subject=Seller%20Support%20Request",
    cta: "Email seller support",
    icon: Store,
  },
  {
    title: "Trust and safety",
    description:
      "Report suspicious activity, blocked access, or marketplace safety concerns.",
    href: "mailto:help@verible.com?subject=Trust%20and%20Safety%20Report",
    cta: "Report an issue",
    icon: ShieldAlert,
  },
]

const supportChecklist = [
  "The email address or phone number connected to your account",
  "The marketplace name and seller profile URL involved",
  "A short description of what happened and when it happened",
  "Screenshots or error messages if you have them",
]

const faqs = [
  {
    question: "How do I report a suspicious seller?",
    answer:
      "Use the seller lookup flow when possible, then email help@verible.com with the seller profile URL, screenshots, and a brief summary of the concern.",
  },
  {
    question: "Why is my seller verification still pending?",
    answer:
      "Verification reviews can depend on profile completeness, document quality, and whether platform links are accessible. If your status has not changed, contact support with the email attached to your seller account.",
  },
  {
    question: "I cannot log in or reset my password. What should I do?",
    answer:
      "Start with the password reset flow. If that does not work, contact support and include the email or phone number you used during registration so the team can help you recover access safely.",
  },
  {
    question: "Where can I review Verible's legal pages?",
    answer:
      "You can review our Privacy Policy and Terms and Conditions from the footer of the site or directly from the links below.",
  },
]

export default function SupportPage() {
  return (
    <SitePageShell
      eyebrow="Support"
      title="Help for buyers, sellers, and trust teams"
      description="Find the fastest path for account help, seller verification issues, suspicious activity reports, and general questions about how Verible works."
      actions={
        <>
          <Button variant="primary" size="lg" asChild>
            <a href="mailto:help@verible.com?subject=Verible%20Support%20Request">
              <Mail className="w-4 h-4" />
              <span>Email support</span>
            </a>
          </Button>
          <Button variant="tertiary" size="lg" asChild>
            <Link href="/buyer-tools">Open buyer tools</Link>
          </Button>
        </>
      }
    >
      <section className="grid gap-5 md:grid-cols-3">
        {supportCards.map(({ title, description, href, cta, icon: Icon }) => (
          <Card
            key={title}
            className="rounded-3xl border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#1D2973]/10 text-[#1D2973] flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-950">
              {title}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {description}
            </p>
            <a
              href={href}
              className="mt-6 inline-flex items-center text-sm font-semibold text-[#1D2973] transition-colors hover:text-[#10184a]"
            >
              {cta}
            </a>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-3xl border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <LifeBuoy className="w-6 h-6 text-[#1D2973]" />
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              How to get faster help
            </h2>
          </div>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Sending the details below helps the support team review issues
            faster and reduce back-and-forth.
          </p>
          <ul className="mt-6 space-y-4">
            {supportChecklist.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7 text-slate-600">
                <CircleCheck className="mt-1 w-5 h-5 shrink-0 text-[#D59B0D]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f6f8ff_100%)] p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <LockKeyhole className="w-6 h-6 text-[#1D2973]" />
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Priority issues
            </h2>
          </div>
          <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
            <p>
              Account access problems and suspicious activity reports should be
              sent to <a className="font-semibold text-[#1D2973]" href="mailto:help@verible.com">help@verible.com</a>.
            </p>
            <p>
              Include the email on your account and any seller or marketplace
              link involved so the team can trace the issue accurately.
            </p>
          </div>
        </Card>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#1D2973]" />
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-950">
                {faq.question}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Card className="rounded-3xl border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">
            Account recovery
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Need to reset your password or access your account again?
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-flex text-sm font-semibold text-[#1D2973] hover:text-[#10184a]"
          >
            Open password reset
          </Link>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">
            Privacy questions
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Review what information Verible processes and how it is used.
          </p>
          <Link
            href="/privacy-policy"
            className="mt-6 inline-flex text-sm font-semibold text-[#1D2973] hover:text-[#10184a]"
          >
            Read privacy policy
          </Link>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">
            Terms and usage
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Review the product rules and responsibilities tied to using Verible.
          </p>
          <Link
            href="/terms-and-conditions"
            className="mt-6 inline-flex text-sm font-semibold text-[#1D2973] hover:text-[#10184a]"
          >
            Read terms and conditions
          </Link>
        </Card>
      </section>
    </SitePageShell>
  )
}
