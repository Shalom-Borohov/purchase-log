import { useId } from 'react'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { isDayDate } from '../../domain/dayDate'

type DatePicksProps<Pick extends string> = {
  label: string
  picksLabel: string
  picks: readonly Pick[]
  labelOf: (pick: Pick) => string
  dateOf: (pick: Pick) => string
  date: string
  earliest: string
  onChange: (date: string) => void
}

const NO_DATE = ''

export function DatePicks<Pick extends string>({
  label,
  picksLabel,
  picks,
  labelOf,
  dateOf,
  date,
  earliest,
  onChange,
}: DatePicksProps<Pick>) {
  const inputId = useId()
  const chosen = picks.find((pick) => dateOf(pick) === date)

  function typeDate(typed: string) {
    if (typed === NO_DATE || (isDayDate(typed) && typed >= earliest)) {
      onChange(typed)
    }
  }

  return (
    <div className="item-sheet-date-picks">
      <div className="item-sheet-date-field">
        <label className="item-sheet-line-title" htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          className="field item-sheet-date-input num"
          type="date"
          min={earliest}
          value={date}
          onChange={(event) => typeDate(event.target.value)}
        />
      </div>
      <ChoiceGroup
        label={picksLabel}
        choices={picks}
        chosen={chosen}
        labelOf={labelOf}
        tapAgainClears
        onChoose={(pick) => onChange(pick ? dateOf(pick) : NO_DATE)}
      />
    </div>
  )
}
