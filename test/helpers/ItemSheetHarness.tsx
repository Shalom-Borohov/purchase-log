import { useState } from 'react'
import type { Item } from '../../src/domain/types'
import { ItemSheet } from '../../src/pages/itemSheet/ItemSheet'

export const OPEN_SHEET = 'פתיחה'

export const SAVED_ID = 'saved-id'

export type HarnessProps = {
  item?: Item
  firstPhoto?: File
}

export function ItemSheetHarness({ item, firstPhoto }: HarnessProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [savedId, setSavedId] = useState<string>()

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        {OPEN_SHEET}
      </button>
      {savedId && <output data-testid={SAVED_ID}>{savedId}</output>}
      <ItemSheet
        isOpen={isOpen}
        item={item}
        firstPhoto={firstPhoto}
        onClose={() => setIsOpen(false)}
        onSaved={setSavedId}
      />
    </>
  )
}
