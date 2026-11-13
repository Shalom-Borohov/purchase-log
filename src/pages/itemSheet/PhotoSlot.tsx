import { CameraIcon, LibraryIcon } from '../../components/icons'
import { PhotoInput } from '../../components/PhotoInputs'
import type { PhotoRole } from '../../domain/types'
import { objectUrlOf } from '../../photo/objectUrl'
import { usePhotoUrl } from '../../photo/usePhotoUrl'
import { ITEM_SHEET_COPY } from './copy'
import { PhotoOptions } from './PhotoOptions'
import type { PhotoChange } from './usePhotoChanges'

type PhotoSlotProps = {
  role: PhotoRole
  itemId: string | undefined
  change: PhotoChange
  photoName: string
  isShrinking: boolean
  onPick: (file: File) => void
  onRemove: () => void
}

const EMPTY_CAMERA_ICON_SIZE = 34

const keptItemId = (itemId: string | undefined, change: PhotoChange) => (change.kind === 'kept' ? itemId : undefined)

export function PhotoSlot({ role, itemId, change, photoName, isShrinking, onPick, onRemove }: PhotoSlotProps) {
  const copy = ITEM_SHEET_COPY.slots[role]
  const keptUrl = usePhotoUrl(keptItemId(itemId, change), role)
  const pickedUrl = change.kind === 'picked' ? objectUrlOf(change.taken.photo) : undefined
  const shownUrl = change.kind === 'removed' ? undefined : (pickedUrl ?? keptUrl)

  return (
    <div className="item-sheet-slot-column">
      <div
        className={`item-sheet-slot item-sheet-slot-${role}${shownUrl ? ' item-sheet-slot-filled' : ''}`}
        aria-busy={isShrinking}
      >
        {shownUrl ? (
          <>
            <img className="item-sheet-slot-photo" src={shownUrl} alt={photoName} />
            <PhotoOptions label={copy.options} onPick={onPick} onRemove={onRemove} />
          </>
        ) : (
          <PhotoInput className="item-sheet-slot-empty" opensCamera onPick={onPick}>
            <CameraIcon size={EMPTY_CAMERA_ICON_SIZE} />
            <span>{copy.camera}</span>
          </PhotoInput>
        )}
      </div>
      <div className="item-sheet-slot-foot">
        <span className="item-sheet-slot-caption">{copy.caption}</span>
        {!shownUrl && (
          <PhotoInput className="item-sheet-slot-action" opensCamera={false} onPick={onPick}>
            <LibraryIcon />
            <span className="visually-hidden">{copy.library}</span>
          </PhotoInput>
        )}
      </div>
    </div>
  )
}
