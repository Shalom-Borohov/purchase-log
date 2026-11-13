import { KindChoices } from '../../components/KindChoices'
import type { Kind } from '../../domain/types'
import { PURCHASES_COPY } from './copy'

type KindFilterProps = {
  kinds: Kind[]
  chosenId: string | undefined
  onChoose: (kindId: string | undefined) => void
}

export function KindFilter({ kinds, chosenId, onChoose }: KindFilterProps) {
  return (
    <KindChoices
      label={PURCHASES_COPY.kindFilter}
      className={chosenId ? 'kind-filter is-filtering' : 'kind-filter'}
      kinds={kinds}
      chosenId={chosenId}
      onChoose={onChoose}
    />
  )
}
