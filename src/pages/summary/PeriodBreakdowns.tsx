import { KindDot } from '../../components/KindDot'
import { kindOf } from '../../domain/kinds'
import type { ShopGroup } from '../../domain/shops'
import type { KindTotal, Period } from '../../domain/summary'
import type { Kind } from '../../domain/types'
import { Breakdown, type BreakdownLine } from './Breakdown'
import { SUMMARY_COPY } from './copy'
import { kindItemsPath, shopItemsPath } from './itemsFilter'

type PeriodBreakdownsProps = {
  period: Period
  kinds: Kind[]
  byKind: KindTotal[]
  byShop: ShopGroup[]
}

function kindLines(period: Period, kinds: Kind[], byKind: KindTotal[]): BreakdownLine[] {
  return byKind.flatMap(({ kindId, total, count }) => {
    const kind = kindOf(kinds, kindId)

    return kind
      ? [{ key: kindId, label: <KindDot kind={kind} />, total, count, to: kindItemsPath(period, kindId) }]
      : []
  })
}

const shopLines = (period: Period, byShop: ShopGroup[]): BreakdownLine[] =>
  byShop.map(({ key, name, total, count }) => ({
    key,
    label: <bdi>{name}</bdi>,
    total,
    count,
    to: shopItemsPath(period, key),
  }))

export function PeriodBreakdowns({ period, kinds, byKind, byShop }: PeriodBreakdownsProps) {
  return (
    <div className="period-breakdowns">
      <Breakdown title={SUMMARY_COPY.byKind} lines={kindLines(period, kinds, byKind)} />
      {byShop.length > 0 && <Breakdown title={SUMMARY_COPY.byShop} lines={shopLines(period, byShop)} />}
    </div>
  )
}
