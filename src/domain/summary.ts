import { dayMonth, dayYear } from './dayDate'
import { newestFirst } from './itemOrder'
import { kindIdOf } from './kinds'
import { shopGroups } from './shops'
import { countsInTotals, spentTotal } from './totals'
import type { Item, Kind, Records } from './types'

export type Period = { unit: 'month'; month: string } | { unit: 'year'; year: number }

export type KindTotal = {
  kindId: string
  total: number
  count: number
}

const MOST_EXPENSIVE_COUNT = 5

const isInPeriod = (item: Item, period: Period) =>
  period.unit === 'month' ? dayMonth(item.boughtOn) === period.month : dayYear(item.boughtOn) === period.year

export const periodItems = (items: Item[], period: Period) =>
  newestFirst(items.filter((item) => countsInTotals(item) && isInPeriod(item, period)))

function totalsByKind(items: Item[], kinds: Kind[]): KindTotal[] {
  const groups = Map.groupBy(items, (item) => kindIdOf(kinds, item.kindId))

  return [...groups]
    .map(([kindId, kindItems]) => ({ kindId, total: spentTotal(kindItems), count: kindItems.length }))
    .toSorted((first, second) => second.total - first.total)
}

type PricedItem = Item & { price: number }

const isPriced = (item: Item): item is PricedItem => item.price !== undefined

const mostExpensive = (items: Item[]) =>
  items
    .filter(isPriced)
    .toSorted((first, second) => second.price - first.price)
    .slice(0, MOST_EXPENSIVE_COUNT)

export function periodSummary({ items, kinds }: Records, period: Period) {
  const shown = periodItems(items, period)

  return {
    total: spentTotal(shown),
    count: shown.length,
    mostExpensive: mostExpensive(shown),
    byKind: totalsByKind(shown, kinds),
    byShop: shopGroups(shown).toSorted((first, second) => second.total - first.total),
  }
}
