import { IonModal } from '@ionic/react'
import { useRef, useState } from 'react'
import { useRecords } from '../../data/hooks'
import type { Item } from '../../domain/types'
import { ItemForm } from './ItemForm'
import './itemSheet.css'
import { useDropDraftQuestion } from './useDropDraftQuestion'

export type ItemSheetProps = {
  isOpen: boolean
  item?: Item
  firstPhoto?: File
  onClose: () => void
  onSaved?: (itemId: string) => void
}

const FULL_SHEET = 1

const SHEET_BREAKPOINTS = [0, FULL_SHEET]

const SAVED_ROLE = 'saved'

export function ItemSheet({ isOpen, item, firstPhoto, onClose, onSaved }: ItemSheetProps) {
  const records = useRecords()
  const modal = useRef<HTMLIonModalElement>(null)
  const [isDraftChanged, setIsDraftChanged] = useState(false)
  const askToDropDraft = useDropDraftQuestion()

  const canDismiss = async (_dismissData: undefined, role?: string) =>
    role === SAVED_ROLE || !isDraftChanged || askToDropDraft()

  function closed() {
    setIsDraftChanged(false)
    onClose()
  }

  function saved(itemId: string) {
    onSaved?.(itemId)
    void modal.current?.dismiss(undefined, SAVED_ROLE)
  }

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      initialBreakpoint={FULL_SHEET}
      breakpoints={SHEET_BREAKPOINTS}
      canDismiss={canDismiss}
      onDidDismiss={closed}
    >
      {records && (
        <ItemForm
          item={item}
          firstPhoto={firstPhoto}
          records={records}
          onCancel={() => void modal.current?.dismiss()}
          onSaved={saved}
          onDraftChange={setIsDraftChanged}
        />
      )}
    </IonModal>
  )
}
