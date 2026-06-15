import {
  Participant,
  FoodItem,
  Charges,
  ParticipantSummary,
  SharedItemDetail,
  SettlementTransaction,
  TimelineEvent,
} from '@/types'

export function getEligibleParticipants(
  item: Pick<FoodItem, 'orderedTime'>,
  participants: Participant[]
): string[] {
  return participants
    .filter(p => p.joinTime <= item.orderedTime && item.orderedTime <= p.leaveTime)
    .map(p => p.id)
}

export function calculateSummary(
  participants: Participant[],
  items: FoodItem[],
  charges: Charges
): ParticipantSummary[] {
  if (participants.length === 0) return []

  const rawTotals: Record<string, number> = {}
  const sharedItemsMap: Record<string, SharedItemDetail[]> = {}

  participants.forEach(p => {
    rawTotals[p.id] = 0
    sharedItemsMap[p.id] = []
  })

  items.forEach(item => {
    const activeIds = item.participantIds.filter(id =>
      participants.some(p => p.id === id)
    )
    if (activeIds.length === 0) return
    const sharePrice = item.price / activeIds.length
    activeIds.forEach(id => {
      rawTotals[id] = (rawTotals[id] ?? 0) + sharePrice
      sharedItemsMap[id] = [
        ...(sharedItemsMap[id] ?? []),
        { itemId: item.id, itemName: item.name, fullPrice: item.price, sharePrice, sharedWith: activeIds.length },
      ]
    })
  })

  const grandFoodTotal = items.reduce((s, i) => s + i.price, 0)
  const totalRaw = Object.values(rawTotals).reduce((s, v) => s + v, 0)

  const summaries: ParticipantSummary[] = participants.map(participant => {
    const itemsTotal = rawTotals[participant.id] ?? 0
    const proportion = totalRaw > 0 ? itemsTotal / totalRaw : 1 / participants.length
    const isThePayer = charges.payerId !== null && charges.payerId === participant.id

    const totalVat = grandFoodTotal * (charges.vat / 100)
    const vatAmount =
      charges.vatSplit === 'proportional' ? totalVat * proportion
      : isThePayer ? totalVat : 0

    const totalService = grandFoodTotal * (charges.serviceCharge / 100)
    const serviceChargeAmount =
      charges.serviceChargeSplit === 'proportional' ? totalService * proportion
      : isThePayer ? totalService : 0

    const tipAmount =
      charges.tipSplit === 'proportional' ? charges.tip * proportion
      : isThePayer ? charges.tip : 0

    const total = itemsTotal + vatAmount + serviceChargeAmount + tipAmount

    return {
      participantId: participant.id,
      name: participant.name,
      color: participant.color,
      itemsTotal,
      vatAmount,
      serviceChargeAmount,
      tipAmount,
      total,
      itemCount: (sharedItemsMap[participant.id] ?? []).length,
      sharedItems: sharedItemsMap[participant.id] ?? [],
      percentage: 0,
    }
  })

  const totalBill = summaries.reduce((s, p) => s + p.total, 0)
  return summaries.map(s => ({
    ...s,
    percentage: totalBill > 0 ? (s.total / totalBill) * 100 : 0,
  }))
}

export function calculateSettlement(
  summaries: ParticipantSummary[],
  payerId: string | null
): SettlementTransaction[] {
  if (!payerId || summaries.length <= 1) return []
  const payer = summaries.find(s => s.participantId === payerId)
  if (!payer) return []
  return summaries
    .filter(s => s.participantId !== payerId)
    .map(s => ({
      fromId: s.participantId,
      fromName: s.name,
      toId: payerId,
      toName: payer.name,
      amount: Math.round(s.total * 100) / 100,
    }))
    .filter(t => t.amount > 0.01)
}

export function buildTimeline(
  participants: Participant[],
  items: FoodItem[]
): TimelineEvent[] {
  const events: TimelineEvent[] = []

  participants.forEach(p => {
    events.push({ time: p.joinTime, type: 'join', participantId: p.id, participantName: p.name, participantColor: p.color })
    events.push({ time: p.leaveTime, type: 'leave', participantId: p.id, participantName: p.name, participantColor: p.color })
  })

  items.forEach(item => {
    events.push({
      time: item.orderedTime,
      type: 'item',
      itemId: item.id,
      itemName: item.name,
      itemPrice: item.price,
      presentIds: item.participantIds,
    })
  })

  return events.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time
    const order = { join: 0, item: 1, leave: 2 }
    return order[a.type] - order[b.type]
  })
}