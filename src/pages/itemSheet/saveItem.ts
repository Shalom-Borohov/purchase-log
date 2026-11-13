import { addItem, editItem, type ItemDraft } from '../../data/repo'
import type { Item } from '../../domain/types'
import { changedRoles, pickedPhoto, pickedPhotos, type PhotoChanges } from './usePhotoChanges'

export async function saveItem(item: Item | undefined, draft: ItemDraft, photos: PhotoChanges) {
  const now = Date.now()

  if (!item) {
    return addItem(draft, pickedPhotos(photos), now)
  }

  const photoUpdates = changedRoles(photos).map((role) => ({ role, photo: pickedPhoto(photos[role]) }))

  await editItem({ ...item, ...draft }, photoUpdates, now)

  return item.id
}
