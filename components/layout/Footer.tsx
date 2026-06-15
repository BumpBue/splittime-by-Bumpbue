'use client'

import { Heart, Keyboard, ShieldCheck, Zap } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'

const SHORTCUTS = [
    { keys: 'Ctrl+Z', desc: 'ย้อนกลับ' },
    { keys: 'Ctrl+Y', desc: 'ทำซ้ำ' },
    { keys: 'Ctrl+Shift+Z', desc: 'ทำซ้ำ (Mac)' },
]

export function Footer() {
    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
            <div className="flex items-center gap-2.5 px-4 h-8 text-[11px] text-muted-foreground">

                {/* Brand */}
                <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                    <span className="text-primary font-bold tracking-tight">SplitTime</span>
                    <span className="text-muted-foreground/40">by</span>

                    <a href="https://github.com/bumpbue" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">
                        bumpbue
                    </a>
                </span>

            <Separator orientation="vertical" className="h-3" />

            {/* Made with love */}
            <span className="hidden sm:flex items-center gap-1">
                Made with
                <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500 animate-pulse" />
                in Thailand
            </span>

            <Separator orientation="vertical" className="h-3 hidden sm:block" />

            {/* Version */}
            <span className="hidden md:block font-mono">v1.0.0</span>

            <Separator orientation="vertical" className="h-3 hidden md:block" />

            {/* No data stored badge */}
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="hidden md:flex items-center gap-1 cursor-default">
                            <ShieldCheck className="w-3 h-3 text-green-500" />
                            ไม่มีการเก็บข้อมูล
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs max-w-xs text-center">
                        ข้อมูลทั้งหมดอยู่ใน Browser ของคุณเท่านั้น ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์ใดๆ
                    </TooltipContent>
                </Tooltip>

                {/* Keyboard shortcuts */}
                <div className="hidden xl:flex items-center gap-2">
                    <Separator orientation="vertical" className="h-3" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="flex items-center gap-1.5 cursor-default hover:text-foreground transition-colors">
                                <Keyboard className="w-3 h-3" />
                                <span>Shortcuts</span>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="p-3">
                            <p className="font-semibold text-xs mb-2 text-foreground">แป้นพิมพ์ลัด</p>
                            <div className="space-y-1.5">
                                {SHORTCUTS.map(s => (
                                    <div key={s.keys} className="flex items-center gap-2.5 text-xs">
                                        <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-[10px] text-foreground min-w-[72px] text-center">
                                            {s.keys}
                                        </kbd>
                                        <span className="text-muted-foreground">{s.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Powered by */}
                <div className="hidden xl:flex items-center gap-1.5">
                    <Separator orientation="vertical" className="h-3" />
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>Powered by Next.js 15 · Zustand · shadcn/ui</span>
                </div>
            </TooltipProvider>

            {/* Spacer */}
            <span className="ml-auto" />

            {/* Copyright */}
            <span>© {new Date().getFullYear()} bumpbue. All rights reserved.</span>

        </div>
    </footer >
  )
}