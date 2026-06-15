'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { toast } from 'sonner'

export function useKeyboardShortcuts() {
  const { undo, redo, canUndo, canRedo } = useStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) { undo(); toast.info('ย้อนกลับ') }
      }
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault()
        if (canRedo) { redo(); toast.info('ทำซ้ำ') }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, canUndo, canRedo])
}