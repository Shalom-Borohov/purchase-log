import { useId } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LitTile } from '../../components/LitTile'
import { COMMON_COPY } from '../../copy/common'
import { itemsAtShop } from '../../domain/shops'
import type { Item } from '../../domain/types'
import { itemPathInStack } from '../../navigation/paths'
import { ITEM_PAGE_COPY } from './copy'

type SameShopRailProps = {
  item: Item
  items: Item[]
}

export function SameShopRail({ item, items }: SameShopRailProps) {
  const { pathname } = useLocation()
  const headingId = useId()

  if (!item.shop) {
    return null
  }

  const neighbours = itemsAtShop(items, item.shop).filter(({ id }) => id !== item.id)

  if (!neighbours.length) {
    return null
  }

  return (
    <section className="item-same-shop" aria-labelledby={headingId}>
      <div className="item-same-shop-heading">
        <h2 id={headingId}>{ITEM_PAGE_COPY.fromShop(item.shop)}</h2>
        <span className="quiet-text">{COMMON_COPY.itemCount(neighbours.length)}</span>
      </div>
      <div className="item-same-shop-rail">
        {neighbours.map((neighbour) => (
          <Link key={neighbour.id} className="item-same-shop-tile" to={itemPathInStack(pathname, neighbour.id)}>
            <LitTile item={neighbour} size="mini" />
            <p>
              <span className="item-same-shop-name">{neighbour.name}</span>
              {neighbour.price !== undefined && (
                <span className="quiet-text num">{COMMON_COPY.shekels(neighbour.price)}</span>
              )}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
