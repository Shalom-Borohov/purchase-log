import { parse } from 'valibot'
import { dayYear, isAfterToday, todayDate } from '../domain/dayDate'
import { kindsInOrder, nextKindColour, OTHER_KIND_ID } from '../domain/kinds'
import {
  type Item,
  itemSchema,
  kindSchema,
  PHOTO_FLAGS,
  PHOTO_ROLES,
  type PhotoRole,
  type ShrunkPhoto,
} from '../domain/types'
import { db, itemTables, type PhotoKey } from './db'

export type ItemDraft = Omit<Item, 'id' | 'createdAt' | 'year' | 'sequence' | 'hasPhoto' | 'hasReceipt'>

export type ItemPhotos = Partial<Record<PhotoRole, ShrunkPhoto>>

const FIRST_SEQUENCE = 1

const NEXT_POSITION = 1

const BEFORE_FIRST_POSITION = -1

export const allItems = () => db.items.toArray()

export const allKinds = () => db.kinds.toArray().then(kindsInOrder)

export async function itemPhoto(itemId: string, role: PhotoRole) {
  const stored = await db.photos.get([itemId, role])

  return stored?.bytes
}

export async function itemThumbnail(itemId: string, role: PhotoRole) {
  const stored = await db.thumbnails.get([itemId, role])

  return stored?.bytes
}

function pastItem(item: Item, now: number) {
  const parsed = parse(itemSchema, item)

  if (isAfterToday(parsed.boughtOn, todayDate(new Date(now)))) {
    throw new Error('a purchase cannot be dated after today')
  }

  return parsed
}

const putPhoto = (itemId: string, role: PhotoRole, { photo, thumbnail }: ShrunkPhoto) =>
  db.photos.put({ itemId, role, bytes: photo }).then(() => db.thumbnails.put({ itemId, role, bytes: thumbnail }))

async function nextSequence(year: number) {
  const counter = await db.counters.get(year)
  const sequence = counter ? counter.last + NEXT_POSITION : FIRST_SEQUENCE

  await db.counters.put({ year, last: sequence })

  return sequence
}

const photoFlags = (photos: ItemPhotos) =>
  Object.fromEntries(PHOTO_ROLES.filter((role) => photos[role]).map((role) => [PHOTO_FLAGS[role], true]))

export const addItem = (draft: ItemDraft, photos: ItemPhotos, now: number) =>
  db.transaction('rw', itemTables(), async () => {
    const id = crypto.randomUUID()
    const year = dayYear(draft.boughtOn)
    const sequence = await nextSequence(year)

    await db.items.add(pastItem({ ...draft, ...photoFlags(photos), id, year, sequence, createdAt: now }, now))
    await Promise.all(
      PHOTO_ROLES.map((role) => {
        const photo = photos[role]

        return photo && putPhoto(id, role, photo)
      }),
    )

    return id
  })

export async function updateItem(item: Item, now: number) {
  await db.items.put(pastItem(item, now))
}

const photoKeys = (itemId: string): PhotoKey[] => PHOTO_ROLES.map((role) => [itemId, role])

export const setItemPhoto = (itemId: string, role: PhotoRole, photo: ShrunkPhoto | undefined) =>
  db.transaction('rw', itemTables(), async () => {
    if (photo) {
      await putPhoto(itemId, role, photo)
      await db.items.update(itemId, { [PHOTO_FLAGS[role]]: true })

      return
    }

    await db.photos.delete([itemId, role])
    await db.thumbnails.delete([itemId, role])
    await db.items.update(itemId, { [PHOTO_FLAGS[role]]: undefined })
  })

type PhotoUpdate = { role: PhotoRole; photo: ShrunkPhoto | undefined }

export const editItem = (item: Item, photoUpdates: PhotoUpdate[], now: number) =>
  db.transaction('rw', itemTables(), async () => {
    await updateItem(item, now)

    for (const { role, photo } of photoUpdates) {
      await setItemPhoto(item.id, role, photo)
    }
  })

export const deleteItem = (itemId: string) =>
  db.transaction('rw', itemTables(), async () => {
    await db.items.delete(itemId)
    await db.photos.bulkDelete(photoKeys(itemId))
    await db.thumbnails.bulkDelete(photoKeys(itemId))
  })

export const addKind = (name: string, now: number) =>
  db.transaction('rw', db.kinds, async () => {
    const kinds = await db.kinds.toArray()
    const id = crypto.randomUUID()
    const position = Math.max(BEFORE_FIRST_POSITION, ...kinds.map((kind) => kind.position)) + NEXT_POSITION

    await db.kinds.add(parse(kindSchema, { id, name, colour: nextKindColour(kinds), position, createdAt: now }))

    return id
  })

export const renameKind = (kindId: string, name: string) =>
  db.transaction('rw', db.kinds, async () => {
    const kind = await db.kinds.get(kindId)

    if (!kind) {
      throw new Error(`no kind ${kindId}`)
    }

    await db.kinds.put(parse(kindSchema, { ...kind, name }))
  })

export const deleteKind = (kindId: string) =>
  db.transaction('rw', [db.kinds, db.items], async () => {
    if (kindId === OTHER_KIND_ID) {
      throw new Error('the kind אחר cannot be deleted')
    }

    await db.items.filter((item) => item.kindId === kindId).modify({ kindId: OTHER_KIND_ID })
    await db.kinds.delete(kindId)
  })
