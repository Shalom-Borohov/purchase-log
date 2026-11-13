import { useItemPhoto, useItemThumbnail } from '../data/hooks'
import type { PhotoRole } from '../domain/types'
import { objectUrlOf } from './objectUrl'

export function usePhotoUrl(itemId: string | undefined, role: PhotoRole) {
  const bytes = useItemPhoto(itemId, role)

  return bytes ? objectUrlOf(bytes) : undefined
}

export function useThumbnailUrl(itemId: string | undefined, role: PhotoRole) {
  const bytes = useItemThumbnail(itemId, role)

  return bytes ? objectUrlOf(bytes) : undefined
}
