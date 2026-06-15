export interface Participant {
  id: string
  name: string
  joinTime: number   // นาทีนับจาก 00:00 เช่น 18:00 = 1080
  leaveTime: number
  color: string
}

export interface FoodItem {
  id: string
  name: string
  price: number
  orderedTime: number
  participantIds: string[]
  isManualOverride: boolean
}

export interface Charges {
  vat: number                              // เปอร์เซ็นต์ เช่น 7 = 7%
  serviceCharge: number
  tip: number                              // จำนวนเงินคงที่
  vatSplit: 'proportional' | 'payer'
  serviceChargeSplit: 'proportional' | 'payer'
  tipSplit: 'proportional' | 'payer'
  payerId: string | null
}

export interface SharedItemDetail {
  itemId: string
  itemName: string
  fullPrice: number
  sharePrice: number
  sharedWith: number
}

export interface ParticipantSummary {
  participantId: string
  name: string
  color: string
  itemsTotal: number
  vatAmount: number
  serviceChargeAmount: number
  tipAmount: number
  total: number
  itemCount: number
  sharedItems: SharedItemDetail[]
  percentage: number
}

export interface SettlementTransaction {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amount: number
}

export interface TimelineEvent {
  time: number
  type: 'join' | 'leave' | 'item'
  participantId?: string
  participantName?: string
  participantColor?: string
  itemId?: string
  itemName?: string
  itemPrice?: number
  presentIds?: string[]
}

export interface AppState {
  sessionName: string
  participants: Participant[]
  items: FoodItem[]
  charges: Charges
}