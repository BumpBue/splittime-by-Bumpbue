import { create } from 'zustand'
import { AppState, Charges, FoodItem, Participant } from '@/types'
import { generateId, getNextColor } from '@/lib/utils'
import { getEligibleParticipants } from '@/lib/calculations'

const MAX_HISTORY = 50

const DEFAULT_CHARGES: Charges = {
  vat: 7,
  serviceCharge: 0,
  tip: 0,
  vatSplit: 'proportional',
  serviceChargeSplit: 'proportional',
  tipSplit: 'proportional',
  payerId: null,
}

// ────────────────────────────────────────────────────────────
// Helpers (module-level pure functions)
// ────────────────────────────────────────────────────────────

function refreshNonManualItems(participants: Participant[], items: FoodItem[]): FoodItem[] {
  return items.map(item => {
    if (item.isManualOverride) return item
    return { ...item, participantIds: getEligibleParticipants(item, participants) }
  })
}

function snap(state: SplitTimeStore): AppState {
  return {
    sessionName: state.sessionName,
    participants: state.participants,
    items: state.items,
    charges: state.charges,
  }
}

function withHistory(state: SplitTimeStore, updates: Partial<AppState>): Partial<SplitTimeStore> {
  return {
    ...updates,
    _past: [...state._past, snap(state)].slice(-MAX_HISTORY),
    _future: [],
    canUndo: true,
    canRedo: false,
  }
}

// ────────────────────────────────────────────────────────────
// Store types
// ────────────────────────────────────────────────────────────

interface SplitTimeStore extends AppState {
  _past: AppState[]
  _future: AppState[]
  canUndo: boolean
  canRedo: boolean

  setSessionName: (name: string) => void

  addParticipant: (data: { name: string; joinTime: number; leaveTime: number }) => void
  updateParticipant: (id: string, data: Partial<Omit<Participant, 'id' | 'color'>>) => void
  deleteParticipant: (id: string) => void

  addItem: (data: {
    name: string
    price: number
    orderedTime: number
    participantIds?: string[]
    isManualOverride?: boolean
  }) => void
  updateItem: (id: string, data: Partial<Omit<FoodItem, 'id'>>) => void
  deleteItem: (id: string) => void
  setItemParticipants: (itemId: string, participantIds: string[], isManual: boolean) => void

  updateCharges: (data: Partial<Charges>) => void

  undo: () => void
  redo: () => void

  loadState: (state: AppState) => void
  resetState: () => void
  loadDemoData: () => void
}

// ────────────────────────────────────────────────────────────
// Store
// ────────────────────────────────────────────────────────────

export const useStore = create<SplitTimeStore>()((set) => ({
  sessionName: 'งานเลี้ยงอาหาร',
  participants: [],
  items: [],
  charges: DEFAULT_CHARGES,
  _past: [],
  _future: [],
  canUndo: false,
  canRedo: false,

  // ── Session ──────────────────────────────────────────────
  setSessionName: (name) =>
    set(state => withHistory(state, { sessionName: name })),

  // ── Participants ─────────────────────────────────────────
  addParticipant: ({ name, joinTime, leaveTime }) =>
    set(state => {
      const color = getNextColor(state.participants.map(p => p.color))
      const newP: Participant = { id: generateId(), name, joinTime, leaveTime, color }
      const newParticipants = [...state.participants, newP]
      return withHistory(state, {
        participants: newParticipants,
        items: refreshNonManualItems(newParticipants, state.items),
      })
    }),

  updateParticipant: (id, data) =>
    set(state => {
      const newParticipants = state.participants.map(p => p.id === id ? { ...p, ...data } : p)
      return withHistory(state, {
        participants: newParticipants,
        items: refreshNonManualItems(newParticipants, state.items),
      })
    }),

  deleteParticipant: (id) =>
    set(state => {
      const newParticipants = state.participants.filter(p => p.id !== id)
      const newItems = refreshNonManualItems(
        newParticipants,
        state.items.map(item => ({
          ...item,
          participantIds: item.participantIds.filter(pid => pid !== id),
        }))
      )
      const newCharges = state.charges.payerId === id
        ? { ...state.charges, payerId: null }
        : state.charges
      return withHistory(state, { participants: newParticipants, items: newItems, charges: newCharges })
    }),

  // ── Items ────────────────────────────────────────────────
  addItem: ({ name, price, orderedTime, participantIds, isManualOverride }) =>
    set(state => {
      const eligible = participantIds ?? getEligibleParticipants({ orderedTime }, state.participants)
      const newItem: FoodItem = {
        id: generateId(),
        name,
        price,
        orderedTime,
        participantIds: eligible,
        isManualOverride: isManualOverride ?? false,
      }
      return withHistory(state, { items: [...state.items, newItem] })
    }),

  updateItem: (id, data) =>
    set(state => {
      const newItems = state.items.map(item => {
        if (item.id !== id) return item
        const updated = { ...item, ...data }
        if (data.orderedTime !== undefined && !updated.isManualOverride) {
          updated.participantIds = getEligibleParticipants(updated, state.participants)
        }
        return updated
      })
      return withHistory(state, { items: newItems })
    }),

  deleteItem: (id) =>
    set(state => withHistory(state, { items: state.items.filter(i => i.id !== id) })),

  setItemParticipants: (itemId, participantIds, isManual) =>
    set(state => ({
      ...withHistory(state, {
        items: state.items.map(i =>
          i.id === itemId ? { ...i, participantIds, isManualOverride: isManual } : i
        ),
      }),
    })),

  // ── Charges ──────────────────────────────────────────────
  updateCharges: (data) =>
    set(state => withHistory(state, { charges: { ...state.charges, ...data } })),

  // ── History ──────────────────────────────────────────────
  undo: () =>
    set(state => {
      if (state._past.length === 0) return state
      const past = [...state._past]
      const previous = past.pop()!
      return {
        ...previous,
        _past: past,
        _future: [snap(state), ...state._future],
        canUndo: past.length > 0,
        canRedo: true,
      }
    }),

  redo: () =>
    set(state => {
      if (state._future.length === 0) return state
      const [next, ...rest] = state._future
      return {
        ...next,
        _past: [...state._past, snap(state)],
        _future: rest,
        canUndo: true,
        canRedo: rest.length > 0,
      }
    }),

  // ── Session management ───────────────────────────────────
  loadState: (appState) =>
    set({ ...appState, _past: [], _future: [], canUndo: false, canRedo: false }),

  resetState: () =>
    set({
      sessionName: 'งานเลี้ยงอาหาร',
      participants: [],
      items: [],
      charges: DEFAULT_CHARGES,
      _past: [],
      _future: [],
      canUndo: false,
      canRedo: false,
    }),

  loadDemoData: () =>
    set(state => {
      const participants: Participant[] = [
        { id: 'd1', name: 'สมชาย', joinTime: 18 * 60, leaveTime: 22 * 60, color: '#ef4444' },
        { id: 'd2', name: 'สมหญิง', joinTime: 19 * 60, leaveTime: 22 * 60, color: '#3b82f6' },
        { id: 'd3', name: 'วิชัย', joinTime: 18 * 60, leaveTime: 20 * 60, color: '#22c55e' },
        { id: 'd4', name: 'รัตนา', joinTime: 19 * 60 + 30, leaveTime: 22 * 60, color: '#f97316' },
      ]
      const items: FoodItem[] = [
        { id: 'i1', name: 'ส้มตำ', price: 120, orderedTime: 18 * 60 + 30, participantIds: ['d1', 'd3'], isManualOverride: false },
        { id: 'i2', name: 'เบียร์ช้าง ×2', price: 160, orderedTime: 18 * 60 + 30, participantIds: ['d1', 'd3'], isManualOverride: false },
        { id: 'i3', name: 'ข้าวผัดกุ้ง', price: 90, orderedTime: 19 * 60 + 30, participantIds: ['d2'], isManualOverride: false },
        { id: 'i4', name: 'พิซซ่า', price: 320, orderedTime: 20 * 60 + 30, participantIds: ['d1', 'd2', 'd4'], isManualOverride: false },
        { id: 'i5', name: 'ไวน์แดง', price: 500, orderedTime: 21 * 60, participantIds: ['d1', 'd2', 'd4'], isManualOverride: false },
      ]
      return {
        ...withHistory(state, {
          sessionName: 'งานเลี้ยงวันเกิดสมชาย 🎂',
          participants,
          items,
          charges: { vat: 7, serviceCharge: 10, tip: 0, vatSplit: 'proportional', serviceChargeSplit: 'proportional', tipSplit: 'proportional', payerId: 'd1' },
        }),
      }
    }),
}))