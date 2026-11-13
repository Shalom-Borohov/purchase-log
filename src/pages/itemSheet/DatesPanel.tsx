import { ITEM_SHEET_COPY } from './copy'
import { DateRow } from './DateRow'
import type { ItemFormState } from './itemForm'
import { withPurchaseDate } from './quickPicks'
import { ReturnFields } from './ReturnFields'

type DatesPanelProps = {
  form: ItemFormState
  today: string
  onChange: (changes: Partial<ItemFormState>) => void
}

const NOTE_ROWS = 2

export function DatesPanel({ form, today, onChange }: DatesPanelProps) {
  return (
    <div className="item-sheet-panel item-sheet-quiet">
      <DateRow boughtOn={form.boughtOn} today={today} onChange={(boughtOn) => onChange(withPurchaseDate(form, boughtOn))} />
      <ReturnFields
        boughtOn={form.boughtOn}
        returnBy={form.returnBy}
        warrantyUntil={form.warrantyUntil}
        onReturnByChange={(returnBy) => onChange({ returnBy, isReturnByChosen: true })}
        onWarrantyChange={(warrantyUntil) => onChange({ warrantyUntil })}
      />
      <label className="item-sheet-line item-sheet-note">
        <span className="visually-hidden">{ITEM_SHEET_COPY.note}</span>
        <textarea
          className="item-sheet-input"
          dir="auto"
          rows={NOTE_ROWS}
          placeholder={ITEM_SHEET_COPY.note}
          value={form.note}
          onChange={(event) => onChange({ note: event.target.value })}
        />
      </label>
    </div>
  )
}
