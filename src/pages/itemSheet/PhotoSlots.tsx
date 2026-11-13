import { isName, PHOTO_ROLES, type PhotoRole } from '../../domain/types'
import { ITEM_SHEET_COPY } from './copy'
import { PhotoSlot } from './PhotoSlot'
import './photoSlots.css'
import type { PhotoChanges } from './usePhotoChanges'

type PhotoSlotsProps = {
  itemId: string | undefined
  itemName: string
  changes: PhotoChanges
  shrinkingRoles: PhotoRole[]
  onPick: (role: PhotoRole, file: File) => void
  onRemove: (role: PhotoRole) => void
}

const ITEM_ROLE: PhotoRole = 'item'

function photoNameOf(role: PhotoRole, itemName: string) {
  return role === ITEM_ROLE && isName(itemName) ? itemName : ITEM_SHEET_COPY.slots[role].photo
}

export function PhotoSlots({ itemId, itemName, changes, shrinkingRoles, onPick, onRemove }: PhotoSlotsProps) {
  return (
    <div className="item-sheet-slots">
      {PHOTO_ROLES.map((role) => (
        <PhotoSlot
          key={role}
          role={role}
          itemId={itemId}
          change={changes[role]}
          photoName={photoNameOf(role, itemName)}
          isShrinking={shrinkingRoles.includes(role)}
          onPick={(file) => onPick(role, file)}
          onRemove={() => onRemove(role)}
        />
      ))}
    </div>
  )
}
