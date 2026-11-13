import { useIonActionSheet } from '@ionic/react'
import { type ChangeEvent, type RefObject, useRef } from 'react'
import { RetakeIcon } from '../../components/icons'
import { takePickedFile } from '../../components/takePickedFile'
import { COMMON_COPY } from '../../copy/common'
import { ITEM_SHEET_COPY } from './copy'

type PhotoOptionsProps = {
  label: string
  onPick: (file: File) => void
  onRemove: () => void
}

type HiddenPhotoInputProps = {
  inputRef: RefObject<HTMLInputElement | null>
  opensCamera: boolean
  onPick: (file: File) => void
}

const IMAGES_ONLY = 'image/*'

const REAR_CAMERA = 'environment'

const OUT_OF_TAB_ORDER = -1

function HiddenPhotoInput({ inputRef, opensCamera, onPick }: HiddenPhotoInputProps) {
  function pickFirst(event: ChangeEvent<HTMLInputElement>) {
    const file = takePickedFile(event.currentTarget)

    if (file) {
      onPick(file)
    }
  }

  return (
    <input
      ref={inputRef}
      className="visually-hidden"
      type="file"
      accept={IMAGES_ONLY}
      capture={opensCamera ? REAR_CAMERA : undefined}
      tabIndex={OUT_OF_TAB_ORDER}
      aria-hidden
      onChange={pickFirst}
    />
  )
}

export function PhotoOptions({ label, onPick, onRemove }: PhotoOptionsProps) {
  const [presentActionSheet] = useIonActionSheet()
  const cameraInput = useRef<HTMLInputElement>(null)
  const libraryInput = useRef<HTMLInputElement>(null)
  const copy = ITEM_SHEET_COPY.photoOptions

  const showOptions = () =>
    void presentActionSheet({
      buttons: [
        { text: copy.retake, handler: () => cameraInput.current?.click() },
        { text: copy.library, handler: () => libraryInput.current?.click() },
        { text: copy.remove, role: 'destructive', handler: onRemove },
        { text: COMMON_COPY.cancel, role: 'cancel' },
      ],
    })

  return (
    <>
      <button type="button" className="item-sheet-retake" onClick={showOptions}>
        <span className="item-sheet-retake-mark">
          <RetakeIcon />
        </span>
        <span className="visually-hidden">{label}</span>
      </button>
      <HiddenPhotoInput inputRef={cameraInput} opensCamera onPick={onPick} />
      <HiddenPhotoInput inputRef={libraryInput} opensCamera={false} onPick={onPick} />
    </>
  )
}
