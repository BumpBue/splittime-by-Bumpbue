'use client'

import { Clock, LogIn, LogOut, UtensilsCrossed } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { buildTimeline } from '@/lib/calculations'
import { minutesToTime, formatCurrency } from '@/lib/utils'

export function TimelineView() {
    const { participants, items } = useStore()
    const events = buildTimeline(participants, items)

    if (events.length === 0) {
        return (
            <div className="p-3 flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">ยังไม่มีเหตุการณ์</p>
                <p className="text-xs text-muted-foreground mt-1">เพิ่มผู้เข้าร่วมหรือรายการอาหาร</p>
            </div>
        )
    }

    return (
        <div className="p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                ไทม์ไลน์เหตุการณ์
            </p>
            <div className="relative">
                <div className="absolute left-[17px] top-0 bottom-0 w-px bg-border" />
                <div className="space-y-1">
                    {events.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-3 relative">
                            {/* Icon */}
                            <div className={`
                relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ring-2 ring-background
                ${event.type === 'join' ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' : ''}
                ${event.type === 'leave' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : ''}
                ${event.type === 'item' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : ''}
              `}>
                                {event.type === 'join' && <LogIn className="w-3.5 h-3.5" />}
                                {event.type === 'leave' && <LogOut className="w-3.5 h-3.5" />}
                                {event.type === 'item' && <UtensilsCrossed className="w-3.5 h-3.5" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 py-1.5 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        {event.type === 'join' && (
                                            <p className="text-xs">
                                                <span
                                                    className="font-semibold"
                                                    style={{ color: event.participantColor }}
                                                >{event.participantName}</span>
                                                <span className="text-muted-foreground"> เข้าร่วม</span>
                                            </p>
                                        )}
                                        {event.type === 'leave' && (
                                            <p className="text-xs">
                                                <span
                                                    className="font-semibold"
                                                    style={{ color: event.participantColor }}
                                                >{event.participantName}</span>
                                                <span className="text-muted-foreground"> ออกไปแล้ว</span>
                                            </p>
                                        )}
                                        {event.type === 'item' && (
                                            <div>
                                                <p className="text-xs font-medium truncate">{event.itemName}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    ฿{formatCurrency(event.itemPrice ?? 0)} · {event.presentIds?.length ?? 0} คน
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                                        {minutesToTime(event.time)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 