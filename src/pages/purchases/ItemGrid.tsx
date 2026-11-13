import { Link } from 'react-router-dom'
import { LitTile } from '../../components/LitTile'
import { COMMON_COPY } from '../../copy/common'
import { ITEM_COPY, shopAndDate } from '../../copy/itemCopy'
import type { Item } from '../../domain/types'
import { purchasesItemPath } from '../../navigation/paths'
import { PURCHASES_COPY } from './copy'

function GridTile({ item }: { item: Item }) {
  return (
    <Link className="grid-tile" to={purchasesItemPath(item.id)}>
      <LitTile item={item} size="tile" />
      <span className="grid-tile-caption">
        <span className="grid-tile-line">
          <span className="grid-tile-name">{item.name}</span>
          {item.price !== undefined && <span className="grid-tile-price num">{COMMON_COPY.shekels(item.price)}</span>}
        </span>
        <span className="grid-tile-provenance">{shopAndDate(item)}</span>
        {item.returned && <span className="grid-tile-returned">{ITEM_COPY.returned}</span>}
      </span>
    </Link>
  )
}

export function ItemGrid({ items }: { items: Item[] }) {
  return (
    <ul className="item-grid" aria-label={PURCHASES_COPY.allItems}>
      {items.map((item) => (
        <li key={item.id}>
          <GridTile item={item} />
        </li>
      ))}
    </ul>
  )
}
