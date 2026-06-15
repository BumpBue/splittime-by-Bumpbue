'use client'

import { useEffect, useState } from 'react'
import { useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'
import { FoodItem } from '@/types'
import { minutesToTime, timeToMinutes } from '@/lib/utils'
import { getEligibleParticipants } from '@/lib/calculations'
import { RefreshCw } from 'lucide-react'

const schema = z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อรายการ'),
    price: z.coerce.number().min(0, 'ราคาต้องไม่ติดลบ'),
    orderedTime: z.string().min(1, 'กรุณาเลือกเวลา'),
})

type FormValues = z.infer<typeof schema>

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    editTarget?: FoodItem | null
}

export function ItemDialog({ open, onOpenChange, editTarget }: Props) {
    const { addItem, updateItem, participants } = useStore()
    const isEditing = !!editTarget

    const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FormValues>({
        resolver: zodResolver(schema) as Resolver<FormValues>,
        defaultValues: isEditing
            ? { name: editTarget.name, price: editTarget.price, orderedTime: minutesToTime(editTarget.orderedTime) }
            : { name: '', price: 0, orderedTime: '19:00' },
    })

    // local state for manual participant selection
    const [manualIds, setManualIds] = [
        editTarget?.participantIds ?? [],
        (ids: string[]) => { /* will track in form */ }
    ]
    const [selectedIds, setSelectedIds] = useLocalState<string[]>(
        editTarget?.participantIds ?? []
    )
    const [isManual, setIsManual] = useLocalState<boolean>(
        editTarget?.isManualOverride ?? false
    )

    const orderedTime = watch('orderedTime')

    // Auto-update eligible when time changes and not manual
    useEffect(() => {
        if (!isManual) {
            const eligible = getEligibleParticipants(
                { orderedTime: timeToMinutes(orderedTime) },
                participants
            )
            setSelectedIds(eligible)
        }
    }, [orderedTime, isManual, participants])

    // Init when dialog opens
    useEffect(() => {
        if (open && editTarget) {
            reset({
                name: editTarget.name,
                price: editTarget.price,
                orderedTime: minutesToTime(editTarget.orderedTime),
            })
            setSelectedIds(editTarget.participantIds)
            setIsManual(editTarget.isManualOverride)
        } else if (open) {
            reset({ name: '', price: 0, orderedTime: '19:00' })
            const defaultTime = timeToMinutes('19:00')
            setSelectedIds(getEligibleParticipants({ orderedTime: defaultTime }, participants))
            setIsManual(false)
        }
    }, [open])

    const autoEligible = getEligibleParticipants(
        { orderedTime: timeToMinutes(orderedTime) },
        participants
    )

    const toggleParticipant = (id: string, checked: boolean) => {
        setIsManual(true)
        setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter(i => i !== id))
    }

    const resetToAuto = () => {
        setIsManual(false)
        setSelectedIds(autoEligible)
    }

    const onSubmit = (data: FormValues) => {
        if (isEditing && editTarget) {
            updateItem(editTarget.id, {
                name: data.name,
                price: data.price,
                orderedTime: timeToMinutes(data.orderedTime),
                participantIds: selectedIds,
                isManualOverride: isManual,
            })
        } else {
            addItem({
                name: data.name,
                price: data.price,
                orderedTime: timeToMinutes(data.orderedTime),
                participantIds: selectedIds,
                isManualOverride: isManual,
            })
        }
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'แก้ไขรายการอาหาร' : 'เพิ่มรายการอาหาร'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label>ชื่อรายการ</Label>
                        <Input placeholder="เช่น ต้มยำกุ้ง, เบียร์ช้าง" {...register('name')} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>ราคา (฿)</Label>
                            <Input type="number" step="0.01" {...register('price')} />
                            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>เวลาสั่ง</Label>
                            <Input type="time" {...register('orderedTime')} />
                        </div>
                    </div>

                    {/* Participant selection */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-1.5">
                                ผู้ร่วมจ่าย
                                {isManual && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">กำหนดเอง</Badge>
                                )}
                            </Label>
                            {isManual && (
                                <Button type="button" variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={resetToAuto}>
                                    <RefreshCw className="w-3 h-3" />
                                    รีเซ็ตอัตโนมัติ
                                </Button>
                            )}
                        </div>

                        {participants.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-2">ยังไม่มีผู้เข้าร่วม</p>
                        ) : (
                            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                {participants.map(p => {
                                    const eligible = autoEligible.includes(p.id)
                                    const checked = selectedIds.includes(p.id)
                                    return (
                                        <div key={p.id} className="flex items-center gap-2.5">
                                            <Checkbox
                                                id={`p-${p.id}`}
                                                checked={checked}
                                                onCheckedChange={(v) => toggleParticipant(p.id, !!v)}
                                            />
                                            <label htmlFor={`p-${p.id}`} className="flex items-center gap-1.5 text-sm cursor-pointer flex-1">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                                {p.name}
                                            </label>
                                            {!eligible && checked && (
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">ไม่อยู่ในช่วงเวลา</Badge>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-1">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                            ยกเลิก
                        </Button>
                        <Button type="submit" className="flex-1">
                            {isEditing ? 'บันทึก' : 'เพิ่ม'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function useLocalState<T>(initial: T): [T, (v: T) => void] {
    return useState(initial)
}