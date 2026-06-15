'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ParticipantList } from '@/components/participants/ParticipantList'
import { ItemList } from '@/components/items/ItemList'
import { SummaryPanel } from '@/components/summary/SummaryPanel'
import { SettlementPanel } from '@/components/summary/SettlementPanel'
import { ChargesPanel } from '@/components/charges/ChargesPanel'
import { TimelineView } from '@/components/timeline/TimelineView'
import { Users, UtensilsCrossed, Calculator, ArrowLeftRight, Clock } from 'lucide-react'

export function MobileLayout() {
    return (
        <Tabs defaultValue="items" className="flex flex-col h-full">
            <TabsList className="w-full rounded-none border-b h-10 shrink-0 grid grid-cols-5">
                <TabsTrigger value="participants" className="text-[10px] flex-col h-full gap-0.5 p-1">
                    <Users className="w-3.5 h-3.5" />
                    คน
                </TabsTrigger>
                <TabsTrigger value="items" className="text-[10px] flex-col h-full gap-0.5 p-1">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    รายการ
                </TabsTrigger>
                <TabsTrigger value="timeline" className="text-[10px] flex-col h-full gap-0.5 p-1">
                    <Clock className="w-3.5 h-3.5" />
                    ไทม์ไลน์
                </TabsTrigger>
                <TabsTrigger value="summary" className="text-[10px] flex-col h-full gap-0.5 p-1">
                    <Calculator className="w-3.5 h-3.5" />
                    สรุป
                </TabsTrigger>
                <TabsTrigger value="settlement" className="text-[10px] flex-col h-full gap-0.5 p-1">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    ชำระ
                </TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ScrollArea className="flex-1">
                    <ParticipantList />
                </ScrollArea>
            </TabsContent>

            <TabsContent value="items" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ScrollArea className="flex-1">
                    <ItemList />
                </ScrollArea>
            </TabsContent>

            <TabsContent value="timeline" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ScrollArea className="flex-1">
                    <TimelineView />
                </ScrollArea>
            </TabsContent>

            <TabsContent value="summary" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ScrollArea className="flex-1">
                    <SummaryPanel />
                    <ChargesPanel />
                </ScrollArea>
            </TabsContent>

            <TabsContent value="settlement" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ScrollArea className="flex-1">
                    <SettlementPanel />
                </ScrollArea>
            </TabsContent>
        </Tabs>
    )
}