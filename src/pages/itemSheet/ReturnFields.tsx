import { useId, useState } from 'react'
import { ChevronIcon } from '../../components/icons'
import { shortDate } from '../../copy/formats'
import { isDayDate } from '../../domain/dayDate'
import { ITEM_SHEET_COPY } from './copy'
import { DatePicks } from './DatePicks'
import { RETURN_PICKS, returnPickDate, WARRANTY_PICKS, warrantyPickDate } from './quickPicks'

type ReturnFieldsProps = {
  boughtOn: string
  returnBy: string
  warrantyUntil: string
  onReturnByChange: (returnBy: string) => void
  onWarrantyChange: (warrantyUntil: string) => void
}

export function ReturnFields({
  boughtOn,
  returnBy,
  warrantyUntil,
  onReturnByChange,
  onWarrantyChange,
}: ReturnFieldsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const revealId = useId()
  const titleId = useId()
  const valueId = useId()
  const hasReturnBy = isDayDate(returnBy)

  return (
    <>
      <button
        type="button"
        className="item-sheet-line item-sheet-toggle"
        aria-expanded={isOpen}
        aria-controls={revealId}
        aria-labelledby={titleId}
        aria-describedby={hasReturnBy ? valueId : undefined}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span id={titleId} className="item-sheet-line-title">
          {ITEM_SHEET_COPY.returnAndWarranty}
        </span>
        {hasReturnBy && (
          <span id={valueId} className="item-sheet-line-value num">
            {ITEM_SHEET_COPY.returnUntil(shortDate(returnBy))}
          </span>
        )}
        <ChevronIcon />
      </button>
      {isOpen && (
        <div id={revealId} className="item-sheet-reveal">
          <DatePicks
            label={ITEM_SHEET_COPY.returnBy}
            picksLabel={ITEM_SHEET_COPY.returnPicks}
            picks={RETURN_PICKS}
            labelOf={(pick) => ITEM_SHEET_COPY.returnPickLabels[pick]}
            dateOf={(pick) => returnPickDate(boughtOn, pick)}
            date={returnBy}
            earliest={boughtOn}
            onChange={onReturnByChange}
          />
          <DatePicks
            label={ITEM_SHEET_COPY.warrantyUntil}
            picksLabel={ITEM_SHEET_COPY.warrantyPicks}
            picks={WARRANTY_PICKS}
            labelOf={(pick) => ITEM_SHEET_COPY.warrantyPickLabels[pick]}
            dateOf={(pick) => warrantyPickDate(boughtOn, pick)}
            date={warrantyUntil}
            earliest={boughtOn}
            onChange={onWarrantyChange}
          />
        </div>
      )}
    </>
  )
}
