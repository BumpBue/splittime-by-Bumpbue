'use client'

import { Moon, Sun, Share2, RotateCcw, RotateCw, Utensils, Download, Trash2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useStore } from '@/store/useStore'
import { generateShareUrl } from '@/lib/sharing'
import { calculateSummary } from '@/lib/calculations'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export function Header() {
  const { theme, setTheme } = useTheme()
  const {
    sessionName, setSessionName,
    participants, items, charges,
    undo, redo, canUndo, canRedo,
    resetState, loadDemoData,
  } = useStore()

  const handleShare = async () => {
    const url = generateShareUrl({ sessionName, participants, items, charges })
    await navigator.clipboard.writeText(url)
    toast.success('คัดลอกลิงก์แล้ว!', { description: 'แชร์ลิงก์นี้เพื่อกู้คืนเซสชัน' })
  }

  const handleCopySummary = () => {
    const summaries = calculateSummary(participants, items, charges)
    const grandTotal = summaries.reduce((s, p) => s + p.total, 0)
    const lines = [
      `📋 ${sessionName}`,
      `${'─'.repeat(30)}`,
      ...summaries.map(s => [
        `👤 ${s.name} (${s.percentage.toFixed(1)}%)`,
        ...s.sharedItems.map(i =>
          `   ${i.itemName}${i.sharedWith > 1 ? ` ÷${i.sharedWith}` : ''}  ฿${formatCurrency(i.sharePrice)}`
        ),
        `   ${'─'.repeat(20)}`,
        `   รวม  ฿${formatCurrency(s.total)}`,
      ].join('\n')),
      `${'─'.repeat(30)}`,
      `💰 รวมทั้งหมด  ฿${formatCurrency(grandTotal)}`,
    ].join('\n')
    navigator.clipboard.writeText(lines)
    toast.success('คัดลอกสรุปแล้ว!')
  }

  const handleExportJson = () => {
    const data = { sessionName, participants, items, charges }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `splittime-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('ส่งออก JSON แล้ว!')
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 shrink-0">
      <div className="flex items-center gap-2 px-3 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Utensils className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-base hidden sm:block tracking-tight">SplitTime</span>
        </div>

        {/* Session name */}
        <Input
          value={sessionName}
          onChange={e => setSessionName(e.target.value)}
          className="max-w-xs text-sm font-medium h-8 ml-1"
          placeholder="ชื่องานเลี้ยง..."
        />

        {/* Actions */}
        <div className="flex items-center gap-0.5 ml-auto">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={!canUndo}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">ย้อนกลับ (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={!canRedo}>
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">ทำซ้ำ (Ctrl+Y)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost" size="icon" className="h-8 w-8"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">เปลี่ยนธีม</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">แชร์เซสชัน</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleCopySummary}>📋 คัดลอกสรุป</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJson}>📦 ส่งออก JSON</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={loadDemoData} className="text-blue-500">
                  🎲 โหลดข้อมูลตัวอย่าง
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                      <Trash2 className="mr-2 h-3.5 w-3.5" />รีเซ็ตทั้งหมด
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>รีเซ็ตข้อมูลทั้งหมด?</AlertDialogTitle>
                      <AlertDialogDescription>ข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={resetState}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        รีเซ็ต
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}