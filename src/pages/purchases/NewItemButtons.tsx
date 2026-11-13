import { useState } from 'react'
import { CameraIcon } from '../../components/icons'
import { PhotoInput } from '../../components/PhotoInputs'
import { ItemSheet } from '../itemSheet/ItemSheet'
import { PURCHASES_COPY } from './copy'

type SheetRequest = { isOpen: boolean; firstPhoto?: File }

const CLOSED: SheetRequest = { isOpen: false }

export function NewItemButtons() {
  const [sheet, setSheet] = useState<SheetRequest>(CLOSED)

  return (
    <>
      <div slot="fixed" className="new-item-buttons">
        <button type="button" className="no-photo-button" onClick={() => setSheet({ isOpen: true })}>
          {PURCHASES_COPY.newItemWithoutPhoto}
        </button>
        <PhotoInput
          className="camera-button"
          opensCamera
          onPick={(firstPhoto) => setSheet({ isOpen: true, firstPhoto })}
        >
          <CameraIcon />
          <span className="visually-hidden">{PURCHASES_COPY.newItemCamera}</span>
        </PhotoInput>
      </div>
      <ItemSheet
        isOpen={sheet.isOpen}
        firstPhoto={sheet.firstPhoto}
        onClose={() => setSheet(CLOSED)}
      />
    </>
  )
}
