import { useId } from 'react'
import type { Item } from '../../domain/types'
import { summaryItemPath } from '../../navigation/paths'
import { ItemRow } from '../../components/ItemRow'
import { shopAndDate } from '../../copy/itemCopy'
import { SUMMARY_COPY } from './copy'

export function MostExpensive({ items }: { items: Item[] }) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading">
        {SUMMARY_COPY.mostExpensive}
      </h2>
      <ul className="item-rows">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} details={shopAndDate(item)} to={summaryItemPath(item.id)} />
        ))}
      </ul>
    </section>
  )
}
