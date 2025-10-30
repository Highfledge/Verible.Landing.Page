import { BuyerToolsPage } from "@/components/buyer-tools-page"
import { StickyBottomBar } from "@/components/sticky-bottom-bar"

export default function BuyerTools() {
  return (
    <div className="min-h-screen bg-white">
      <BuyerToolsPage />
      <StickyBottomBar />
    </div>
  )
}
