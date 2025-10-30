import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SellersSection } from "@/components/sellers-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { StickyBottomBar } from "@/components/sticky-bottom-bar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <SellersSection />
      <CTASection />
      <Footer />
      <StickyBottomBar />
    </div>
  );
}
