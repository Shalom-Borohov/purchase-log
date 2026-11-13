import { CalendarIcon } from '../../components/icons'
import { useMessageToast } from '../../components/useMessageToast'
import { COMMON_COPY } from '../../copy/common'
import { type CalendarEvent, calendarEventText } from '../../domain/calendarEvent'
import { handOverCalendarEvent } from './calendarHandoff'
import { ITEM_PAGE_COPY } from './copy'

type CalendarButtonProps = {
  fileName: string
  event: CalendarEvent
  label?: string
}

export function CalendarButton({ fileName, event, label }: CalendarButtonProps) {
  const toast = useMessageToast()

  async function addToCalendar() {
    try {
      const outcome = await handOverCalendarEvent(fileName, calendarEventText(event, Date.now()))

      if (outcome === 'needsAnotherTap') {
        void toast(ITEM_PAGE_COPY.tapAgain)
      }
    } catch {
      void toast(COMMON_COPY.actionFailed)
    }
  }

  return (
    <button
      type="button"
      className="item-action item-action-brass"
      aria-label={label}
      onClick={() => void addToCalendar()}
    >
      <CalendarIcon />
      {ITEM_PAGE_COPY.addToCalendar}
    </button>
  )
}
