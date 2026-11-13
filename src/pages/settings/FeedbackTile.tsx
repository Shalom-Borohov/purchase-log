import { useState } from 'react'
import { ChatIcon } from '../../components/icons'
import { SETTINGS_COPY } from './copy'
import { FeedbackSheet } from './FeedbackSheet'

export function FeedbackTile() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="panel settings-tile">
      <h2>{SETTINGS_COPY.feedback}</h2>
      <button type="button" className="quiet-button settings-action" onClick={() => setIsOpen(true)}>
        <ChatIcon />
        {SETTINGS_COPY.reportBugOrIdea}
      </button>
      <FeedbackSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  )
}
