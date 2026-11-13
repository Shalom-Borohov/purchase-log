import { useId } from 'react'
import { ITEM_SHEET_COPY } from './copy'
import { isPriceValid, type ItemFormState } from './itemForm'

type NamePriceFieldsProps = {
  form: ItemFormState
  onChange: (changes: Partial<ItemFormState>) => void
}

export function NamePriceFields({ form, onChange }: NamePriceFieldsProps) {
  const isPriceOk = isPriceValid(form.priceText)
  const priceId = useId()
  const problemId = useId()

  return (
    <>
      <div className="item-sheet-panel">
        <label className="item-sheet-row">
          <span className="item-sheet-row-label">{ITEM_SHEET_COPY.name}</span>
          <input
            className="item-sheet-input"
            dir="auto"
            placeholder={ITEM_SHEET_COPY.namePlaceholder}
            value={form.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </label>
        <div className="item-sheet-row">
          <label className="item-sheet-row-label" htmlFor={priceId}>
            {ITEM_SHEET_COPY.price}
          </label>
          <span className="item-sheet-shekel" aria-hidden="true">
            {ITEM_SHEET_COPY.shekelSign}
          </span>
          <input
            id={priceId}
            className="item-sheet-input num"
            inputMode="decimal"
            dir="ltr"
            value={form.priceText}
            aria-invalid={!isPriceOk}
            aria-describedby={isPriceOk ? undefined : problemId}
            onChange={(event) => onChange({ priceText: event.target.value })}
          />
        </div>
      </div>
      {!isPriceOk && (
        <p id={problemId} className="item-sheet-problem">
          {ITEM_SHEET_COPY.invalidPrice}
        </p>
      )}
    </>
  )
}
