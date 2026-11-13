import { newestFirst } from '../../domain/itemOrder'
import { attentionItems } from '../../domain/returnWindow'
import type { Item } from '../../domain/types'

const LEAD_COUNT = 1

const NONE = 0

export function wallItems(items: Item[], today: string) {
  const newest = newestFirst(items)
  const closing = attentionItems(items, today)
  const lead = closing.at(0) ?? newest.at(0)

  return {
    lead,
    moreClosing: Math.max(closing.length - LEAD_COUNT, NONE),
    others: newest.filter((item) => item !== lead),
  }
}
