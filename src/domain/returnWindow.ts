import { daysBetween } from './dayDate'
import type { Item } from './types'

export type ReturnWindow = {
  returnBy: string
  daysLeft: number
  openShare: number
}

const ATTENTION_DAYS = 3

const CLOSED_SHARE = 0

const FULL_SHARE = 1

const LAST_OPEN_DAY = 0

function openShare(daysLeft: number, windowDays: number) {
  if (daysLeft < LAST_OPEN_DAY) {
    return CLOSED_SHARE
  }

  if (windowDays <= LAST_OPEN_DAY) {
    return FULL_SHARE
  }

  return Math.min(FULL_SHARE, daysLeft / windowDays)
}

export function returnWindow({ boughtOn, returnBy }: Item, today: string): ReturnWindow | undefined {
  if (!returnBy) {
    return undefined
  }

  const daysLeft = daysBetween(today, returnBy)

  return { returnBy, daysLeft, openShare: openShare(daysLeft, daysBetween(boughtOn, returnBy)) }
}

export const isClosed = ({ daysLeft }: ReturnWindow) => daysLeft < LAST_OPEN_DAY

function attentionDaysLeft(item: Item, today: string) {
  if (item.returned || item.keeping) {
    return undefined
  }

  const window = returnWindow(item, today)

  return window && window.daysLeft >= LAST_OPEN_DAY && window.daysLeft <= ATTENTION_DAYS ? window.daysLeft : undefined
}

export const needsAttention = (item: Item, today: string) => attentionDaysLeft(item, today) !== undefined

export function attentionItems(items: Item[], today: string) {
  return items
    .flatMap((item) => {
      const daysLeft = attentionDaysLeft(item, today)

      return daysLeft === undefined ? [] : [{ item, daysLeft }]
    })
    .sort((first, second) => first.daysLeft - second.daysLeft)
    .map(({ item }) => item)
}
