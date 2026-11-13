import { useLiveQuery } from 'dexie-react-hooks'
import { useContext } from 'react'
import type { PhotoRole } from '../domain/types'
import { RecordsContext } from './recordsContext'
import { itemPhoto, itemThumbnail } from './repo'

export function useRecords() {
  return useContext(RecordsContext)
}

export function useItemPhoto(itemId: string | undefined, role: PhotoRole) {
  return useLiveQuery(() => (itemId ? itemPhoto(itemId, role) : undefined), [itemId, role])
}

export function useItemThumbnail(itemId: string | undefined, role: PhotoRole) {
  return useLiveQuery(() => (itemId ? itemThumbnail(itemId, role) : undefined), [itemId, role])
}
