'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { ItemList } from '@/components/items/ItemList'

export function CenterPanel() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden border-r">
      <ScrollArea className="flex-1">
        <ItemList />
      </ScrollArea>
    </main>
  )
}