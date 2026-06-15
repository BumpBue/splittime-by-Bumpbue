'use client'

import { useMemo } from 'react'
import { TrendingUp, ChevronDown } from 'lucide-react'
import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/useStore'
import { calculateSummary } from '@/lib/calculations'
import { formatCurrency } from '@/lib/utils'

export function SummaryPanel() {
    const { participants, items, charges } = useStore()
    const summaries = useMemo(
        () => calculateSummary(participants, items, charges),
        [participants, items, charges]
    )
    const grandTotal = summaries.reduce((s, p) => s + p.total, 0)
    const foodTotal = items.reduce((s, i) => s + i.price, 0)

    if (participants.length === 0) {
        return (
            <div className="p-4 flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">ยังไม่มีข้อมูล</p>
                <p className="text-xs text-muted-foreground mt-1">เพิ่มผู้เข้าร่วมและรายการอาหาร</p>
            </div>
        )
    }

    return (
        <div className="p-3 space-y-3">
            {/* Grand total */}
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                <p className="text-xs text-muted-foreground">ยอดรวมทั้งหมด</p>
                <p className="text-2xl font-bold text-primary mt-0.5">฿{formatCurrency(grandTotal)}</p>
                <div className="flex gap-3 mt-1.5 text-[10px] text-muted-foreground">
                    <span>อาหาร ฿{formatCurrency(foodTotal)}</span>
                    {charges.vat > 0 && <span>VAT {charges.vat}%</span>}
                    {charges.serviceCharge > 0 && <span>Service {charges.serviceCharge}%</span>}
                    {charges.tip > 0 && <span>ทิป ฿{formatCurrency(charges.tip)}</span>}
                </div>
            </div>

            {/* Per-person breakdown */}
            <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    แยกตามผู้เข้าร่วม
                </p>
                <Accordion type="multiple" className="space-y-1.5">
                    {summaries.map(s => (
                        <AccordionItem
                            key={s.participantId}
                            value={s.participantId}
                            className="border rounded-lg overflow-hidden"
                        >
                            <AccordionTrigger className="px-3 py-2.5 hover:no-underline hover:bg-muted/50">
                                <div className="flex items-center gap-2 flex-1 min-w-0 text-left">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: s.color }}
                                    />
                                    <span className="font-medium text-sm truncate">{s.name}</span>
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-auto mr-2 shrink-0">
                                        {s.percentage.toFixed(1)}%
                                    </Badge>
                                </div>
                                <span className="font-bold text-sm shrink-0">฿{formatCurrency(s.total)}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-3 pb-3 pt-0">
                                <div className="space-y-1 mt-2">
                                    {s.sharedItems.map(item => (
                                        <div key={item.itemId} className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                {item.itemName}
                                                {item.sharedWith > 1 && (
                                                    <span className="ml-1 text-muted-foreground/60">÷{item.sharedWith}</span>
                                                )}
                                            </span>
                                            <span className="tabular-nums">฿{formatCurrency(item.sharePrice)}</span>
                                        </div>
                                    ))}
                                    <Separator className="my-1.5" />
                                    {s.vatAmount > 0 && (
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>VAT ({charges.vat}%)</span>
                                            <span>+฿{formatCurrency(s.vatAmount)}</span>
                                        </div>
                                    )}
                                    {s.serviceChargeAmount > 0 && (
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Service Charge ({charges.serviceCharge}%)</span>
                                            <span>+฿{formatCurrency(s.serviceChargeAmount)}</span>
                                        </div>
                                    )}
                                    {s.tipAmount > 0 && (
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>ทิป</span>
                                            <span>+฿{formatCurrency(s.tipAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-semibold text-sm pt-1">
                                        <span>รวม</span>
                                        <span style={{ color: s.color }}>฿{formatCurrency(s.total)}</span>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}