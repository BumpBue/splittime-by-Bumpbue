'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SummaryPanel } from '@/components/summary/SummaryPanel'
import { SettlementPanel } from '@/components/summary/SettlementPanel'
import { ChargesPanel } from '@/components/charges/ChargesPanel'
import { Calculator, ArrowLeftRight, Tag } from 'lucide-react'

export function RightSidebar() {
  return (
    <aside className="w-80 xl:w-96 flex flex-col overflow-hidden shrink-0">
      <Tabs defaultValue="summary" className="flex flex-col h-full">
        <TabsList className="w-full rounded-none border-b h-10 shrink-0">
          <TabsTrigger value="summary" className="flex-1 gap-1 text-xs">
            <Calculator className="w-3.5 h-3.5" />
            สรุป
          </TabsTrigger>
          <TabsTrigger value="settlement" className="flex-1 gap-1 text-xs">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            ชำระ
          </TabsTrigger>
          <TabsTrigger value="charges" className="flex-1 gap-1 text-xs">
            <Tag className="w-3.5 h-3.5" />
            ค่าธรรมเนียม
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1">
            <SummaryPanel />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settlement" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1">
            <SettlementPanel />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="charges" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1">
            <ChargesPanel />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  )
}