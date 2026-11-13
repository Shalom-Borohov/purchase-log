import { Link } from 'react-router-dom'
import { COMMON_COPY } from '../../copy/common'
import { joinParts } from '../../copy/joinParts'
import type { ShopGroup } from '../../domain/shops'
import { shopPath } from '../../navigation/paths'

const FULL_PERCENT = 100

const NO_SHARE = 0

const sharePercent = (total: number, topTotal: number) =>
  topTotal > NO_SHARE ? (total / topTotal) * FULL_PERCENT : NO_SHARE

export function ShopRankRow({ group, topTotal }: { group: ShopGroup; topTotal: number }) {
  const [latestPlace] = group.places

  return (
    <li>
      <Link className="shop-rank-row" to={shopPath(group.key)}>
        <span className="shop-rank-top">
          <span className="shop-rank-text">
            <span className="shop-rank-name">
              <bdi>{group.name}</bdi>
            </span>
            <span className="shop-rank-details quiet-text">{joinParts([latestPlace, COMMON_COPY.itemCount(group.count)])}</span>
          </span>
          <span className="shop-rank-total num">{COMMON_COPY.shekels(group.total)}</span>
        </span>
        <span className="shop-rank-bar" aria-hidden="true">
          <i style={{ width: `${sharePercent(group.total, topTotal)}%` }} />
        </span>
      </Link>
    </li>
  )
}
