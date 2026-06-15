import { AppState } from '@/types'

export function encodeState(state: AppState): string {
  try {
    const json = JSON.stringify(state)
    return btoa(encodeURIComponent(json))
  } catch {
    return ''
  }
}

export function decodeState(encoded: string): AppState | null {
  try {
    const json = decodeURIComponent(atob(encoded))
    return JSON.parse(json) as AppState
  } catch {
    return null
  }
}

export function generateShareUrl(state: AppState): string {
  if (typeof window === 'undefined') return ''
  const encoded = encodeState(state)
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('s', encoded)
  return url.toString()
}

export function loadFromUrl(): AppState | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const s = params.get('s')
  if (!s) return null
  return decodeState(s)
}