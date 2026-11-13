import type { ReturnWindow } from '../domain/returnWindow'
import type { Item } from '../domain/types'
import { dayAndMonth, daysCount, shortDate } from './formats'
import { joinParts } from './joinParts'

const LAST_DAY = 0

const TOMORROW = 1

export const ITEM_COPY = {
  returned: 'הוחזר',
} as const

export const provenance = ({ shop, place, boughtOn }: Item) => joinParts([shop, place, shortDate(boughtOn)])

export const shopAndDate = ({ shop, boughtOn }: Item) => joinParts([shop, shortDate(boughtOn)])

export function returnStatus({ daysLeft }: ReturnWindow) {
  if (daysLeft < LAST_DAY) {
    return 'זמן ההחזרה עבר'
  }

  if (daysLeft === LAST_DAY) {
    return 'היום אחרון להחזרה'
  }

  return daysLeft === TOMORROW ? 'להחזרה עד מחר' : `להחזרה עוד ${daysCount(daysLeft)}`
}

export function returnStatusWithDate(window: ReturnWindow) {
  if (window.daysLeft <= TOMORROW) {
    return returnStatus(window)
  }

  return joinParts([`להחזרה עד ${dayAndMonth(window.returnBy)}`, `עוד ${daysCount(window.daysLeft)}`])
}

export const warrantyUntil = (warrantyEnd: string) => `אחריות עד ${shortDate(warrantyEnd)}`
