'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ParticipantList } from '@/components/participants/ParticipantList'
import { TimelineView } from '@/components/timeline/TimelineView'
import { Users, Clock } from 'lucide-react'
import { useStore } from '@/store/useStore'

export function LeftSidebar() {
  const { participants } = useStore()

  return (
    <aside className="w-72 xl:w-80 border-r flex flex-col overflow-hidden shrink-0">
      <Tabs defaultValue="participants" className="flex flex-col h-full">
        <TabsList className="w-full rounded-none border-b h-10 shrink-0">
          <TabsTrigger value="participants" className="flex-1 gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5" />
            ผู้เข้าร่วม
            {participants.length > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-px text-[10px] font-semibold min-w-[18px] text-center">
                {participants.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex-1 gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5" />
            ไทม์ไลน์
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1">
            <ParticipantList />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="timeline" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ScrollArea className="flex-1">
            <TimelineView />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  )
}