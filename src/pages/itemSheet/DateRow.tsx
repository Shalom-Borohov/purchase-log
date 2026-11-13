import { useId } from 'react'
import { ChevronIcon } from '../../components/icons'
import { useMessageToast } from '../../components/useMessageToast'
import { shortDate } from '../../copy/formats'
import { isAfterToday, isDayDate } from '../../domain/dayDate'
import { ITEM_SHEET_COPY } from './copy'

type DateRowProps = {
  boughtOn: string
  today: string
  onChange: (boughtOn: string) => void
}

export function DateRow({ boughtOn, today, onChange }: DateRowProps) {
  const toast = useMessageToast()
  const inputId = useId()
  const shownDate = boughtOn === today ? ITEM_SHEET_COPY.today(shortDate(boughtOn)) : shortDate(boughtOn)

  function changeDate(chosen: string) {
    if (!isDayDate(chosen)) {
      return
    }

    if (isAfterToday(chosen, today)) {
      void toast(ITEM_SHEET_COPY.futureDate)

      return
    }

    onChange(chosen)
  }

  return (
    <div className="item-sheet-line">
      <label className="item-sheet-line-title" htmlFor={inputId}>
        {ITEM_SHEET_COPY.date}
      </label>
      <span className="item-sheet-line-value">{shownDate}</span>
      <ChevronIcon />
      <input
        id={inputId}
        className="item-sheet-line-picker"
        type="date"
        max={today}
        value={boughtOn}
        onChange={(event) => changeDate(event.target.value)}
      />
    </div>
  )
}
