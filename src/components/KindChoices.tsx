import { kindsInOrder } from '../domain/kinds'
import type { Kind } from '../domain/types'
import { ChoiceGroup } from './ChoiceGroup'
import { KindDot } from './KindDot'

type KindChoicesProps = {
  label: string
  className: string
  kinds: Kind[]
  chosenId: string | undefined
  onChoose: (kindId: string | undefined) => void
}

export function KindChoices({ label, className, kinds, chosenId, onChoose }: KindChoicesProps) {
  const ordered = kindsInOrder(kinds)
  const kindById = new Map(ordered.map((kind) => [kind.id, kind]))

  return (
    <ChoiceGroup
      label={label}
      className={className}
      choices={ordered.map(({ id }) => id)}
      chosen={chosenId}
      labelOf={(kindId) => {
        const kind = kindById.get(kindId)

        return kind && <KindDot kind={kind} />
      }}
      tapAgainClears
      onChoose={onChoose}
    />
  )
}
