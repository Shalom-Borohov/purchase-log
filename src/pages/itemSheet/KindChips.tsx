import { KindChoices } from '../../components/KindChoices'
import type { Kind } from '../../domain/types'
import { ITEM_SHEET_COPY } from './copy'

type KindChipsProps = {
  kinds: Kind[]
  kindId: string | undefined
  onChange: (kindId: string | undefined) => void
}

export function KindChips({ kinds, kindId, onChange }: KindChipsProps) {
  return (
    <section className="item-sheet-section">
      <h2 className="item-sheet-heading" aria-hidden="true">
        {ITEM_SHEET_COPY.kind}
      </h2>
      <KindChoices
        label={ITEM_SHEET_COPY.kind}
        className="item-sheet-kinds"
        kinds={kinds}
        chosenId={kindId}
        onChoose={onChange}
      />
    </section>
  )
}
