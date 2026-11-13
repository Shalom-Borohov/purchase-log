import { kindIdOf } from '../../domain/kinds'
import { shopKey } from '../../domain/shops'
import { type Period, periodItems } from '../../domain/summary'
import type { Item, Records } from '../../domain/types'
import { summaryItemsPath } from '../../navigation/paths'
import { parsePeriodParam, periodParam } from './periodChoice'

const PERIOD_PARAM = 'period'

const KIND_PARAM = 'kind'

const SHOP_PARAM = 'shop'

export type ItemsFilter = {
  period: Period
  kindId: string | null
  shopKey: string | null
}

export const periodItemsPath = (period: Period) => summaryItemsPath({ [PERIOD_PARAM]: periodParam(period) })

export const kindItemsPath = (period: Period, kindId: string) =>
  summaryItemsPath({ [PERIOD_PARAM]: periodParam(period), [KIND_PARAM]: kindId })

export const shopItemsPath = (period: Period, key: string) =>
  summaryItemsPath({ [PERIOD_PARAM]: periodParam(period), [SHOP_PARAM]: key })

export function filterFromParams(params: URLSearchParams): ItemsFilter | undefined {
  const period = parsePeriodParam(params.get(PERIOD_PARAM))

  return period && { period, kindId: params.get(KIND_PARAM), shopKey: params.get(SHOP_PARAM) }
}

const isAtShop = (item: Item, key: string) => item.shop !== undefined && shopKey(item.shop) === key

export const filteredItems = ({ items, kinds }: Records, filter: ItemsFilter) =>
  periodItems(items, filter.period).filter(
    (item) =>
      (filter.kindId === null || kindIdOf(kinds, item.kindId) === filter.kindId) &&
      (filter.shopKey === null || isAtShop(item, filter.shopKey)),
  )
