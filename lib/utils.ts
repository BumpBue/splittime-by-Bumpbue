import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

export const PARTICIPANT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f43f5e', '#84cc16', '#a855f7',
]

export function getNextColor(existingColors: string[]): string {
  const available = PARTICIPANT_COLORS.filter(c => !existingColors.includes(c))
  if (available.length > 0) return available[0]
  return PARTICIPANT_COLORS[existingColors.length % PARTICIPANT_COLORS.length]
}

export function timeToMinutes(time: string): number {
  const parts = time.split(':')
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (isNaN(h) || isNaN(m)) return 0
  return h * 60 + m
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} นาที`
  if (m === 0) return `${h} ชม.`
  return `${h} ชม. ${m} น.`
}