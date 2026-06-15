'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/useStore'

type SplitMode = 'proportional' | 'payer'

export function ChargesPanel() {
    const { charges, updateCharges } = useStore()

    const splitOptions: { value: SplitMode; label: string }[] = [
        { value: 'proportional', label: 'หารตามสัดส่วน' },
        { value: 'payer', label: 'ผู้จ่ายบิลรับผิดชอบ' },
    ]

    return (
        <div className="p-3 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                ค่าธรรมเนียมเพิ่มเติม
            </p>

            {/* VAT */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm">VAT (%)</Label>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-24 h-8 text-right text-sm"
                        value={charges.vat}
                        onChange={e => updateCharges({ vat: parseFloat(e.target.value) || 0 })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-16">แบ่งแบบ</Label>
                    <Select
                        value={charges.vatSplit}
                        onValueChange={(v: SplitMode) => updateCharges({ vatSplit: v })}
                    >
                        <SelectTrigger className="h-8 text-xs flex-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {splitOptions.map(o => (
                                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />

            {/* Service Charge */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm">Service Charge (%)</Label>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-24 h-8 text-right text-sm"
                        value={charges.serviceCharge}
                        onChange={e => updateCharges({ serviceCharge: parseFloat(e.target.value) || 0 })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-16">แบ่งแบบ</Label>
                    <Select
                        value={charges.serviceChargeSplit}
                        onValueChange={(v: SplitMode) => updateCharges({ serviceChargeSplit: v })}
                    >
                        <SelectTrigger className="h-8 text-xs flex-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {splitOptions.map(o => (
                                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />

            {/* Tip */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm">ทิป (฿)</Label>
                    <Input
                        type="number"
                        min="0"
                        step="1"
                        className="w-24 h-8 text-right text-sm"
                        value={charges.tip}
                        onChange={e => updateCharges({ tip: parseFloat(e.target.value) || 0 })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-16">แบ่งแบบ</Label>
                    <Select
                        value={charges.tipSplit}
                        onValueChange={(v: SplitMode) => updateCharges({ tipSplit: v })}
                    >
                        <SelectTrigger className="h-8 text-xs flex-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {splitOptions.map(o => (
                                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}