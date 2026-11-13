import { Link } from 'react-router-dom'
import { ChevronIcon } from '../../components/icons'
import { ItemLabel } from '../../components/ItemLabel'
import { LitTile } from '../../components/LitTile'
import type { Item } from '../../domain/types'
import { ATTENTION_PATH, purchasesItemPath } from '../../navigation/paths'
import { PURCHASES_COPY } from './copy'

type LeadPieceProps = {
  item: Item
  today: string
  moreClosing: number
}

const NONE = 0

export function LeadPiece({ item, today, moreClosing }: LeadPieceProps) {
  return (
    <section className="lead-slot">
      <Link className="lead-piece" to={purchasesItemPath(item.id)}>
        <LitTile item={item} size="lead" />
        <ItemLabel item={item} today={today} />
      </Link>
      {moreClosing > NONE && (
        <Link className="lead-more" to={ATTENTION_PATH}>
          {PURCHASES_COPY.moreClosing(moreClosing)}
          <ChevronIcon />
        </Link>
      )}
    </section>
  )
}
