import { COMMON_COPY } from '../../copy/common'
import { monthName } from '../../copy/formats'
import { joinParts } from '../../copy/joinParts'
import { dayMonth } from '../../domain/dayDate'
import { periodItems } from '../../domain/summary'
import { spentTotal } from '../../domain/totals'
import type { Item } from '../../domain/types'

export function MonthLine({ items, today }: { items: Item[]; today: string }) {
  const month = dayMonth(today)
  const monthItems = periodItems(items, { unit: 'month', month })

  return (
    <p className="wall-subtitle">
      {joinParts([monthName(month), COMMON_COPY.itemCount(monthItems.length), COMMON_COPY.shekels(spentTotal(monthItems))])}
    </p>
  )
}
