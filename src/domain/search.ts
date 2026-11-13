import { itemNumber } from './itemNumber'
import { normalizeText } from './text'
import type { Item } from './types'

const searchableTexts = (item: Item) => [item.name, item.shop, item.place, item.note, itemNumber(item)]

export function searchItems(items: Item[], query: string) {
  const needle = normalizeText(query)

  return items.filter((item) =>
    searchableTexts(item).some((text) => text !== undefined && normalizeText(text).includes(needle)),
  )
}
