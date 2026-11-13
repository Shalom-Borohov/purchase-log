import type { ReturnWindow } from '../domain/returnWindow'
import './ReturnBar.css'

type ReturnBarProps = {
  window: ReturnWindow
  text: string
}

const PERCENT = 100

export function ReturnBar({ window, text }: ReturnBarProps) {
  return (
    <div className="return-bar">
      <span>{text}</span>
      <span className="return-bar-track" aria-hidden="true">
        <i style={{ width: `${window.openShare * PERCENT}%` }} />
      </span>
    </div>
  )
}
