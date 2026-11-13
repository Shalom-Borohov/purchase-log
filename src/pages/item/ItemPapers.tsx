import { useState } from 'react'
import { ChevronIcon, ReceiptIcon } from '../../components/icons'
import { warrantyUntil } from '../../copy/itemCopy'
import type { Item } from '../../domain/types'
import { useThumbnailUrl } from '../../photo/usePhotoUrl'
import { CalendarButton } from './CalendarButton'
import { ITEM_PAGE_COPY } from './copy'
import { warrantyEvent } from './itemEvents'
import { ReceiptModal } from './ReceiptModal'

type ItemPapersProps = {
  item: Item
  today: string
}

function ReceiptThumbnail({ item }: { item: Item }) {
  const url = useThumbnailUrl(item.id, 'receipt')

  return url ? <img className="item-receipt-thumbnail" src={url} alt="" /> : <ReceiptIcon />
}

function ReceiptRow({ item }: { item: Item }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button type="button" className="item-papers-row item-receipt" onClick={() => setIsOpen(true)}>
        <ReceiptThumbnail item={item} />
        <span className="item-papers-text">{ITEM_PAGE_COPY.receipt}</span>
        <ChevronIcon />
      </button>
      <ReceiptModal item={item} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

function WarrantyRow({ item, today }: ItemPapersProps) {
  const event = warrantyEvent(item, today)

  if (!item.warrantyUntil) {
    return null
  }

  return (
    <div className="item-papers-row item-warranty">
      <span className="item-papers-text">{warrantyUntil(item.warrantyUntil)}</span>
      {event && <CalendarButton fileName={item.name} event={event} label={ITEM_PAGE_COPY.addWarrantyToCalendar} />}
    </div>
  )
}

export function ItemPapers({ item, today }: ItemPapersProps) {
  return (
    <>
      {(item.hasReceipt || item.warrantyUntil) && (
        <section className="panel item-papers" aria-label={ITEM_PAGE_COPY.papers}>
          {item.hasReceipt && <ReceiptRow item={item} />}
          <WarrantyRow item={item} today={today} />
        </section>
      )}
      {item.note && <p className="item-note">{item.note}</p>}
    </>
  )
}
