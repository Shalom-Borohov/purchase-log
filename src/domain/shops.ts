import { compareDayDates, daysBetween } from './dayDate'
import { newestFirst } from './itemOrder'
import { normalizeText } from './text'
import { spentTotal } from './totals'
import type { Item } from './types'

export const SHOP_ORDERS = ['total', 'recent', 'name'] as const

export type ShopOrder = (typeof SHOP_ORDERS)[number]

export type ShopGroup = {
  key: string
  name: string
  places: string[]
  items: Item[]
  total: number
  count: number
  lastBoughtOn: string
}

const SHOP_NAME_COLLATOR = new Intl.Collator('he')

export const shopKey = (shop: string) => normalizeText(shop)

const distinct = (texts: (string | undefined)[]) => [
  ...new Set(texts.filter((text): text is string => text !== undefined)),
]

type ShopItem = Item & { shop: string }

const hasShop = (item: Item): item is ShopItem => item.shop !== undefined

const itemsByShop = (items: Item[]) => Map.groupBy(newestFirst(items).filter(hasShop), ({ shop }) => shopKey(shop))

export function shopGroups(items: Item[]): ShopGroup[] {
  return [...itemsByShop(items)].map(([key, shopItems]) => {
    const [latest] = shopItems

    return {
      key,
      name: latest.shop,
      places: distinct(shopItems.map(({ place }) => place)),
      items: shopItems,
      total: spentTotal(shopItems),
      count: shopItems.length,
      lastBoughtOn: latest.boughtOn,
    }
  })
}

const SHOP_COMPARERS: Record<ShopOrder, (first: ShopGroup, second: ShopGroup) => number> = {
  total: (first, second) => second.total - first.total,
  recent: (first, second) => compareDayDates(second.lastBoughtOn, first.lastBoughtOn),
  name: (first, second) => SHOP_NAME_COLLATOR.compare(first.name, second.name),
}

export const sortShops = (groups: ShopGroup[], order: ShopOrder) => groups.toSorted(SHOP_COMPARERS[order])

export const shopSuggestions = (items: Item[]) => sortShops(shopGroups(items), 'recent').map(({ name }) => name)

export function itemsAtShop(items: Item[], shop: string) {
  const key = shopKey(shop)

  return newestFirst(items.filter((item) => hasShop(item) && shopKey(item.shop) === key))
}

export const placesAtShop = (items: Item[], shop: string) => distinct(itemsAtShop(items, shop).map(({ place }) => place))

type ReturnableItem = Item & { returnBy: string }

const hasReturnBy = (item: Item): item is ReturnableItem => item.returnBy !== undefined

export function returnDaysAtShop(items: Item[], shop: string) {
  const [enteredLast] = itemsAtShop(items, shop)
    .filter(hasReturnBy)
    .toSorted((first, second) => second.createdAt - first.createdAt)

  return enteredLast && daysBetween(enteredLast.boughtOn, enteredLast.returnBy)
}
