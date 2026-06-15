'use client'

import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticipantCard } from './ParticipantCard'
import { ParticipantDialog } from './ParticipantDialog'
import { useStore } from '@/store/useStore'

export function ParticipantList() {
    const { participants } = useStore()
    const [addOpen, setAddOpen] = useState(false)

    return (
        <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    ผู้เข้าร่วม {participants.length > 0 && `(${participants.length})`}
                </p>
                <Button size="sm" className="h-7 gap-1 text-xs" onClick={() => setAddOpen(true)}>
                    <Plus className="w-3.5 h-3.5" />
                    เพิ่ม
                </Button>
            </div>

            {participants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">ยังไม่มีผู้เข้าร่วม</p>
                    <p className="text-xs text-muted-foreground mt-1">กดปุ่ม &quot;เพิ่ม&quot; เพื่อเริ่มต้น</p>
                </div>
            ) : (
                <div className="space-y-1.5">
                    {participants.map(p => (
                        <ParticipantCard key={p.id} participant={p} />
                    ))}
                </div>
            )}

            <ParticipantDialog open={addOpen} onOpenChange={setAddOpen} />
        </div>
    )
}