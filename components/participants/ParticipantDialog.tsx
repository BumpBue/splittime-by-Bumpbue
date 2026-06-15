'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/useStore'
import { Participant } from '@/types'
import { minutesToTime, timeToMinutes } from '@/lib/utils'

const schema = z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อ'),
    joinTime: z.string().min(1, 'กรุณาเลือกเวลาเข้า'),
    leaveTime: z.string().min(1, 'กรุณาเลือกเวลาออก'),
}).refine(d => timeToMinutes(d.leaveTime) >= timeToMinutes(d.joinTime), {
    message: 'เวลาออกต้องไม่ก่อนเวลาเข้า',
    path: ['leaveTime'],
})

type FormValues = z.infer<typeof schema>

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    editTarget?: Participant | null
}

export function ParticipantDialog({ open, onOpenChange, editTarget }: Props) {
    const { addParticipant, updateParticipant } = useStore()
    const isEditing = !!editTarget

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: isEditing ? {
            name: editTarget.name,
            joinTime: minutesToTime(editTarget.joinTime),
            leaveTime: minutesToTime(editTarget.leaveTime),
        } : { name: '', joinTime: '18:00', leaveTime: '22:00' },
    })

    const onSubmit = (data: FormValues) => {
        if (isEditing && editTarget) {
            updateParticipant(editTarget.id, {
                name: data.name,
                joinTime: timeToMinutes(data.joinTime),
                leaveTime: timeToMinutes(data.leaveTime),
            })
        } else {
            addParticipant({
                name: data.name,
                joinTime: timeToMinutes(data.joinTime),
                leaveTime: timeToMinutes(data.leaveTime),
            })
        }
        reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'แก้ไขผู้เข้าร่วม' : 'เพิ่มผู้เข้าร่วม'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">ชื่อ</Label>
                        <Input id="name" placeholder="เช่น สมชาย" {...register('name')} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="joinTime">เวลาเข้า</Label>
                            <Input id="joinTime" type="time" {...register('joinTime')} />
                            {errors.joinTime && <p className="text-xs text-destructive">{errors.joinTime.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="leaveTime">เวลาออก</Label>
                            <Input id="leaveTime" type="time" {...register('leaveTime')} />
                            {errors.leaveTime && <p className="text-xs text-destructive">{errors.leaveTime.message}</p>}
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => { reset(); onOpenChange(false) }}>
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