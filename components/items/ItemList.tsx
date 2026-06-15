'use client'

import { useState } from 'react'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ItemCard } from './ItemCard'
import { ItemDialog } from './ItemDialog'
import { useStore } from '@/store/useStore'
import { formatCurrency } from '@/lib/utils'

export function ItemList() {
    const { items } = useStore()
    const [addOpen, setAddOpen] = useState(false)
    const total = items.reduce((s, i) => s + i.price, 0)

    return (
        <div className="p-3 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        รายการอาหาร {items.length > 0 && `(${items.length})`}
                    </p>
                    {items.length > 0 && (
                        <p className="text-xs text-muted-foreground">รวม ฿{formatCurrency(total)}</p>
                    )}
                </div>
                <Button size="sm" className="h-7 gap-1 text-xs" onClick={() => setAddOpen(true)}>
                    <Plus className="w-3.5 h-3.5" />
                    เพิ่มรายการ
                </Button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                        <UtensilsCrossed className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">ยังไม่มีรายการอาหาร</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                        กดปุ่ม &quot;เพิ่มรายการ&quot; เพื่อเพิ่มอาหารหรือเครื่องดื่ม
                    </p>
                    <Button className="mt-4 gap-1" size="sm" onClick={() => setAddOpen(true)}>
                        <Plus className="w-3.5 h-3.5" />
                        เพิ่มรายการแรก
                    </Button>
                </div>
            ) : (
                <div className="space-y-2">
                    {[...items]
                        .sort((a, b) => a.orderedTime - b.orderedTime)
                        .map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))
                    }
                </div>
            )}

            <ItemDialog open={addOpen} onOpenChange={setAddOpen} />
        </div>
    )
}