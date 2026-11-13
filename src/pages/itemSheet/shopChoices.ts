import { newestFirst } from '../../domain/itemOrder'
import { placesAtShop, shopKey } from '../../domain/shops'
import type { Item } from '../../domain/types'

const RECENT_SHOP_COUNT = 4

export const recentShops = (shops: string[]) => shops.slice(0, RECENT_SHOP_COUNT)

export const chipFor = (chips: string[], shop: string) => chips.find((chip) => shopKey(chip) === shopKey(shop))

const earlierPlaces = (items: Item[]) => [
  ...new Set(newestFirst(items).flatMap(({ place }) => (place ? [place] : []))),
]

export function placeSuggestions(items: Item[], shop: string) {
  const placesHere = placesAtShop(items, shop)

  return placesHere.length > 0 ? placesHere : earlierPlaces(items)
}
