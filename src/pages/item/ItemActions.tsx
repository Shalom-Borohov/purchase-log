import { ReturnIcon } from '../../components/icons'
import { useMessageToast } from '../../components/useMessageToast'
import { COMMON_COPY } from '../../copy/common'
import { updateItem } from '../../data/repo'
import { needsAttention } from '../../domain/returnWindow'
import type { Item } from '../../domain/types'
import { CalendarButton } from './CalendarButton'
import { ITEM_PAGE_COPY } from './copy'
import { returnEvent } from './itemEvents'

type ItemActionsProps = {
  item: Item
  today: string
}

export function ItemActions({ item, today }: ItemActionsProps) {
  const toast = useMessageToast()

  const save = (changes: Partial<Pick<Item, 'returned' | 'keeping'>>) =>
    void updateItem({ ...item, ...changes }, Date.now()).catch(() => toast(COMMON_COPY.actionFailed))

  const calendarEvent = returnEvent(item, today)

  return (
    <div className="item-actions">
      {calendarEvent && <CalendarButton fileName={item.name} event={calendarEvent} />}
      <button type="button" className="item-action item-action-panel" onClick={() => save({ returned: !item.returned })}>
        <ReturnIcon />
        {item.returned ? ITEM_PAGE_COPY.notReturned : ITEM_PAGE_COPY.returned}
      </button>
      {needsAttention(item, today) && (
        <button type="button" className="item-action item-action-panel" onClick={() => save({ keeping: true })}>
          {ITEM_PAGE_COPY.keeping}
        </button>
      )}
    </div>
  )
}
