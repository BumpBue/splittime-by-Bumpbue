'use client'

import { useState } from 'react'
import { Pencil, Trash2, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ItemDialog } from './ItemDialog'
import { useStore } from '@/store/useStore'
import { FoodItem } from '@/types'
import { minutesToTime, formatCurrency } from '@/lib/utils'

export function ItemCard({ item }: { item: FoodItem }) {
    const { deleteItem, participants } = useStore()
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const activeParticipants = participants.filter(p => item.participantIds.includes(p.id))
    const sharePerPerson = activeParticipants.length > 0 ? item.price / activeParticipants.length : 0

    return (
        <>
            <div className="group p-3 rounded-lg border bg-card hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-medium text-sm">{item.name}</p>
                            {item.isManualOverride && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">กำหนดเอง</Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {minutesToTime(item.orderedTime)}
                            </span>
                            {activeParticipants.length > 1 && (
                                <span className="text-xs text-muted-foreground">
                                    ÷{activeParticipants.length} = ฿{formatCurrency(sharePerPerson)}/คน
                                </span>
                            )}
                        </div>
                        {/* Avatars */}
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                            {activeParticipants.length === 0 ? (
                                <span className="text-xs text-destructive">ไม่มีผู้ร่วมจ่าย</span>
                            ) : (
                                activeParticipants.map(p => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                                        style={{ backgroundColor: p.color }}
                                    >
                                        {p.name}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="font-semibold text-base">฿{formatCurrency(item.price)}</p>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity mt-1 justify-end">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditOpen(true)}>
                                <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => setDeleteOpen(true)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ItemDialog open={editOpen} onOpenChange={setEditOpen} editTarget={item} />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ลบ {item.name}?</AlertDialogTitle>
                        <AlertDialogDescription>รายการนี้จะถูกลบออกถาวร</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteItem(item.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            ลบ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}