'use client'

import { useMemo } from 'react'
import { ArrowRight, CreditCard, Crown } from 'lucide-react'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'
import { calculateSummary, calculateSettlement } from '@/lib/calculations'
import { formatCurrency } from '@/lib/utils'

export function SettlementPanel() {
    const { participants, items, charges, updateCharges } = useStore()
    const summaries = useMemo(
        () => calculateSummary(participants, items, charges),
        [participants, items, charges]
    )
    const settlements = useMemo(
        () => calculateSettlement(summaries, charges.payerId),
        [summaries, charges.payerId]
    )

    if (participants.length === 0) {
        return (
            <div className="p-4 flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">ยังไม่มีข้อมูล</p>
            </div>
        )
    }

    const payer = participants.find(p => p.id === charges.payerId)

    return (
        <div className="p-3 space-y-3">
            {/* Payer selection */}
            <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Crown className="w-3.5 h-3.5" />
                    ผู้จ่ายบิล
                </Label>
                <Select
                    value={charges.payerId ?? '__none__'}
                    onValueChange={v => updateCharges({ payerId: v === '__none__' ? null : v })}
                >
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="เลือกผู้จ่ายบิล" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__none__">ไม่มี (ทุกคนจ่ายเอง)</SelectItem>
                        {participants.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                    {p.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Settlement transactions */}
            {charges.payerId && settlements.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        การชำระเงิน
                    </p>
                    <div className="space-y-1.5">
                        {settlements.map((t, i) => {
                            const fromParticipant = participants.find(p => p.id === t.fromId)
                            const toParticipant = participants.find(p => p.id === t.toId)
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 p-2.5 rounded-lg border bg-card"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span
                                                className="font-semibold text-sm"
                                                style={{ color: fromParticipant?.color }}
                                            >
                                                {t.fromName}
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                            <span
                                                className="font-semibold text-sm"
                                                style={{ color: toParticipant?.color }}
                                            >
                                                {t.toName}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge className="shrink-0 tabular-nums">
                                        ฿{formatCurrency(t.amount)}
                                    </Badge>
                                </div>
                            )
                        })}
                    </div>

                    {payer && (
                        <div className="mt-2 p-2.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                            <span className="font-medium" style={{ color: payer.color }}>{payer.name}</span>
                            {' '}จ่ายบิลทั้งหมดก่อน แล้วทุกคนโอนคืน
                        </div>
                    )}
                </div>
            )}

            {charges.payerId && settlements.length === 0 && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
                    <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                        ✅ ไม่มียอดค้างชำระ
                    </p>
                </div>
            )}

            {/* Summary per person */}
            {summaries.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        ยอดแต่ละคน
                    </p>
                    <div className="space-y-1">
                        {summaries.map(s => (
                            <div key={s.participantId} className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                <span className="flex-1">{s.name}</span>
                                <span className="font-semibold tabular-nums">฿{formatCurrency(s.total)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}