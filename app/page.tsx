'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { CenterPanel } from '@/components/layout/CenterPanel'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { useStore } from '@/store/useStore'
import { loadFromUrl } from '@/lib/sharing'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { toast } from 'sonner'

export default function Home() {
  const { loadState } = useStore()
  useKeyboardShortcuts()

  useEffect(() => {
    const state = loadFromUrl()
    if (state) {
      loadState(state)
      window.history.replaceState({}, '', window.location.pathname)
      toast.success('โหลดเซสชันจากลิงก์แล้ว!')
    }
  }, [loadState])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />

      {/* Desktop: 3 columns */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <LeftSidebar />
        <CenterPanel />
        <RightSidebar />
      </div>

      {/* Mobile: tabs */}
      <div className="lg:hidden flex-1 overflow-hidden">
        <MobileLayout />
      </div>

      <Footer />
    </div>
  )
}