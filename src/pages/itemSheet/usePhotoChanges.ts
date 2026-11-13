import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useMessageToast } from '../../components/useMessageToast'
import type { ItemPhotos } from '../../data/repo'
import { PHOTO_ROLES, type PhotoRole, type ShrunkPhoto } from '../../domain/types'
import { shrinkPhoto } from '../../photo/shrink'
import { ITEM_SHEET_COPY } from './copy'

export type PhotoChange = { kind: 'kept' } | { kind: 'picked'; taken: ShrunkPhoto } | { kind: 'removed' }

export type PhotoChanges = Record<PhotoRole, PhotoChange>

const KEPT: PhotoChange = { kind: 'kept' }

const REMOVED: PhotoChange = { kind: 'removed' }

const FIRST_PHOTO_ROLE: PhotoRole = 'item'

export const pickedPhoto = (change: PhotoChange) => (change.kind === 'picked' ? change.taken : undefined)

export const pickedPhotos = (changes: PhotoChanges): ItemPhotos => ({
  item: pickedPhoto(changes.item),
  receipt: pickedPhoto(changes.receipt),
})

export const changedRoles = (changes: PhotoChanges) => PHOTO_ROLES.filter((role) => changes[role].kind !== 'kept')

export function usePhotoChanges(firstPhoto: File | undefined) {
  const [changes, setChanges] = useState<PhotoChanges>({ item: KEPT, receipt: KEPT })
  const [shrinkingRoles, setShrinkingRoles] = useState<PhotoRole[]>(firstPhoto ? [FIRST_PHOTO_ROLE] : [])
  const [isChanged, setIsChanged] = useState(firstPhoto !== undefined)
  const latestShrinks = useRef<Partial<Record<PhotoRole, Promise<ShrunkPhoto>>>>({})
  const toast = useMessageToast()
  const setChange = (role: PhotoRole, change: PhotoChange) => setChanges((current) => ({ ...current, [role]: change }))
  const isLatestShrink = (role: PhotoRole, shrinking: Promise<ShrunkPhoto>) => latestShrinks.current[role] === shrinking

  function stopShrinking(role: PhotoRole) {
    latestShrinks.current[role] = undefined
    setShrinkingRoles((roles) => roles.filter((shrinkingRole) => shrinkingRole !== role))
  }

  function settle(role: PhotoRole, shrinking: Promise<ShrunkPhoto>) {
    latestShrinks.current[role] = shrinking

    void shrinking.then(
      (taken) => {
        if (isLatestShrink(role, shrinking)) {
          setChange(role, { kind: 'picked', taken })
          stopShrinking(role)
        }
      },
      () => {
        if (isLatestShrink(role, shrinking)) {
          void toast(ITEM_SHEET_COPY.photoFailed)
          stopShrinking(role)
        }
      },
    )
  }

  const settleFirstPhoto = useEffectEvent((shrinking: Promise<ShrunkPhoto>) => settle(FIRST_PHOTO_ROLE, shrinking))

  useEffect(() => {
    if (firstPhoto) {
      settleFirstPhoto(shrinkPhoto(firstPhoto))
    }
  }, [firstPhoto])

  function pick(role: PhotoRole, file: File) {
    setIsChanged(true)
    setShrinkingRoles((roles) => (roles.includes(role) ? roles : [...roles, role]))
    settle(role, shrinkPhoto(file))
  }

  function remove(role: PhotoRole) {
    setIsChanged(true)
    stopShrinking(role)
    setChange(role, REMOVED)
  }

  return { changes, shrinkingRoles, isChanged, pick, remove }
}
