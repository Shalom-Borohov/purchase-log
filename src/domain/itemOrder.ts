import { compareDayDates } from './dayDate'
import type { Item } from './types'

const compareNewestFirst = (first: Item, second: Item) =>
  compareDayDates(second.boughtOn, first.boughtOn) || second.createdAt - first.createdAt

export const newestFirst = (items: Item[]) => items.toSorted(compareNewestFirst)
