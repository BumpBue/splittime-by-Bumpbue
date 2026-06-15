'use client'

import { useState } from 'react'
import { Pencil, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ParticipantDialog } from './ParticipantDialog'
import { useStore } from '@/store/useStore'
import { Participant } from '@/types'
import { minutesToTime, formatDuration } from '@/lib/utils'

export function ParticipantCard({ participant }: { participant: Participant }) {
    const { deleteParticipant, items } = useStore()
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const itemCount = items.filter(i => i.participantIds.includes(participant.id)).length
    const duration = participant.leaveTime - participant.joinTime

    return (
        <>
            <div className="group flex items-center gap-2.5 p-2.5 rounded-lg border bg-card hover:shadow-sm transition-all">
                <div
                    className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white dark:ring-card"
                    style={{ backgroundColor: participant.color }}
                />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{participant.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{minutesToTime(participant.joinTime)} – {minutesToTime(participant.leaveTime)}</span>
                        <span className="text-muted-foreground/50">·</span>
                        <span>{formatDuration(duration)}</span>
                    </div>
                </div>
                <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0">
                    {itemCount} รายการ
                </Badge>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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

            <ParticipantDialog open={editOpen} onOpenChange={setEditOpen} editTarget={participant} />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ลบ {participant.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ผู้เข้าร่วมคนนี้จะถูกลบออกจากรายการทั้งหมดด้วย
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteParticipant(participant.id)}
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