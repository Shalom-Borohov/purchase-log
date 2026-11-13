import { type ReactNode, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronIcon } from '../../components/icons'
import { COMMON_COPY } from '../../copy/common'

export type BreakdownLine = {
  key: string
  label: ReactNode
  total: number
  count: number
  to: string
}

export function Breakdown({ title, lines }: { title: string; lines: BreakdownLine[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const listId = useId()

  return (
    <div className="breakdown">
      <button
        type="button"
        className="breakdown-toggle"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
      >
        <span>{title}</span>
        <ChevronIcon />
      </button>
      {isOpen && (
        <ul id={listId} className="breakdown-lines">
          {lines.map((line) => (
            <li key={line.key}>
              <Link className="breakdown-line" to={line.to}>
                <span className="breakdown-label">{line.label}</span>
                <span className="breakdown-count quiet-text">{COMMON_COPY.itemCount(line.count)}</span>
                <span className="breakdown-total num">{COMMON_COPY.shekels(line.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
