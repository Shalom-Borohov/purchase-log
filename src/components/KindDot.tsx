import type { Kind } from '../domain/types'
import './KindDot.css'

export function KindDot({ kind }: { kind: Kind }) {
  return (
    <span className="kind-dot">
      <i className={`kind-dot-mark kind-colour-${kind.colour}`} aria-hidden="true" />
      {kind.name}
    </span>
  )
}
