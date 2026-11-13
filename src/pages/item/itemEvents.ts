import { provenance } from '../../copy/itemCopy'
import { joinParts } from '../../copy/joinParts'
import type { CalendarEvent } from '../../domain/calendarEvent'
import { addDays } from '../../domain/dayDate'
import { itemNumber } from '../../domain/itemNumber'
import type { Item } from '../../domain/types'
import { ITEM_PAGE_COPY } from './copy'

const DAY_BEFORE = -1

const UID_DOMAIN = 'purchase-log'

type EventPurpose = 'return' | 'warranty'

const EVENT_TITLES: Record<EventPurpose, (name: string) => string> = {
  return: ITEM_PAGE_COPY.returnEventTitle,
  warranty: ITEM_PAGE_COPY.warrantyEventTitle,
}

function eventBefore(item: Item, purpose: EventPurpose, endDay: string | undefined, today: string) {
  if (!endDay) {
    return undefined
  }

  const day = addDays(endDay, DAY_BEFORE)

  if (day < today) {
    return undefined
  }

  return {
    uid: `${item.id}-${purpose}@${UID_DOMAIN}`,
    title: EVENT_TITLES[purpose](item.name),
    day,
    description: joinParts([provenance(item), itemNumber(item)]),
  } satisfies CalendarEvent
}

export const returnEvent = (item: Item, today: string) =>
  item.returned ? undefined : eventBefore(item, 'return', item.returnBy, today)

export const warrantyEvent = (item: Item, today: string) => eventBefore(item, 'warranty', item.warrantyUntil, today)
