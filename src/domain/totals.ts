import type { Item } from './types'

const NOTHING_SPENT = 0

export const countsInTotals = (item: Item) => !item.returned

export const spentTotal = (items: Item[]) =>
  items.reduce((total, item) => (countsInTotals(item) && item.price ? total + item.price : total), NOTHING_SPENT)
