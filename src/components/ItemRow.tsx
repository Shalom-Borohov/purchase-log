import { Link } from 'react-router-dom'
import { COMMON_COPY } from '../copy/common'
import { ITEM_COPY } from '../copy/itemCopy'
import type { Item } from '../domain/types'
import './ItemRow.css'
import { LitTile } from './LitTile'

type ItemRowProps = {
  item: Item
  details: string
  to: string
}

export function ItemRow({ item, details, to }: ItemRowProps) {
  return (
    <li>
      <Link className="item-row" to={to}>
        <LitTile item={item} size="row" />
        <span className="item-row-body">
          <span className="item-row-text">
            <strong className="item-row-name">{item.name}</strong>
            <span className="item-row-details quiet-text">{details}</span>
            {item.returned && <span className="item-row-returned-mark">{ITEM_COPY.returned}</span>}
          </span>
          {item.price !== undefined && <span className="item-row-price num">{COMMON_COPY.shekels(item.price)}</span>}
        </span>
      </Link>
    </li>
  )
}
