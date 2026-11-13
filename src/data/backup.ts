import { strFromU8, strToU8, unzipSync, Zip, ZipDeflate, ZipPassThrough } from 'fflate'
import { array, type InferOutput, literal, number, object, omit, parse, parseJson, pipe, string } from 'valibot'
import {
  counterSchema,
  type Item,
  itemSchema,
  kindSchema,
  PHOTO_FLAGS,
  PHOTO_ROLES,
  type StoredPhoto,
} from '../domain/types'
import { allTables, db } from './db'

const BACKUP_VERSION = 1

const DATA_FILE = 'data.json'

const ZIP_LEVEL = 6

const photoPath = ({ itemId, role }: Pick<StoredPhoto, 'itemId' | 'role'>) => `photos/${itemId}-${role}.jpg`

const thumbnailPath = ({ itemId, role }: Pick<StoredPhoto, 'itemId' | 'role'>) => `thumbnails/${itemId}-${role}.jpg`

const backupFileSchema = pipe(
  string(),
  parseJson(),
  object({
    version: literal(BACKUP_VERSION),
    exportedAt: number(),
    items: array(omit(itemSchema, ['hasPhoto', 'hasReceipt'])),
    kinds: array(kindSchema),
    counters: array(counterSchema),
  }),
)

type BackupFile = InferOutput<typeof backupFileSchema>

export type ParsedBackup = Omit<BackupFile, 'items'> & {
  items: Item[]
  photos: StoredPhoto[]
  thumbnails: StoredPhoto[]
}

function zipWriter() {
  const chunks: Uint8Array<ArrayBuffer>[] = []

  const zip = new Zip((error, chunk) => {
    if (error) {
      throw error
    }

    chunks.push(chunk)
  })

  function addStored(path: string, bytes: ArrayBuffer) {
    const entry = new ZipPassThrough(path)

    zip.add(entry)
    entry.push(new Uint8Array(bytes), true)
  }

  function addDeflated(path: string, bytes: Uint8Array<ArrayBuffer>) {
    const entry = new ZipDeflate(path, { level: ZIP_LEVEL })

    zip.add(entry)
    entry.push(bytes, true)
  }

  function finish() {
    zip.end()

    return chunks
  }

  return { addStored, addDeflated, finish }
}

const withoutPhotoFlags = ({ hasPhoto: _hasPhoto, hasReceipt: _hasReceipt, ...item }: Item) => item

export const exportBackup = (now: number) =>
  db.transaction('r', allTables(), async () => {
    const writer = zipWriter()

    const backupFile: BackupFile = {
      version: BACKUP_VERSION,
      exportedAt: now,
      items: (await db.items.toArray()).map(withoutPhotoFlags),
      kinds: await db.kinds.toArray(),
      counters: await db.counters.toArray(),
    }

    writer.addDeflated(DATA_FILE, strToU8(JSON.stringify(backupFile)))
    await db.photos.each((stored) => writer.addStored(photoPath(stored), stored.bytes))
    await db.thumbnails.each((stored) => writer.addStored(thumbnailPath(stored), stored.bytes))

    return writer.finish()
  })

export function parseBackup(archive: Uint8Array): ParsedBackup {
  const files = unzipSync(archive)
  const dataFile = files[DATA_FILE]

  if (!dataFile) {
    throw new Error(`backup has no ${DATA_FILE}`)
  }

  const backupFile = parse(backupFileSchema, strFromU8(dataFile))

  const restored = backupFile.items.map((item) => {
    const itemPhotoFiles = PHOTO_ROLES.flatMap((role) => {
      const key = { itemId: item.id, role }
      const photoFile = files[photoPath(key)]

      return photoFile ? [{ ...key, photoFile, thumbnailFile: files[thumbnailPath(key)] ?? photoFile }] : []
    })

    const flags = Object.fromEntries(itemPhotoFiles.map(({ role }) => [PHOTO_FLAGS[role], true]))
    const restoredItem: Item = { ...item, ...flags }

    return { restoredItem, itemPhotoFiles }
  })

  const photoFiles = restored.flatMap(({ itemPhotoFiles }) => itemPhotoFiles)

  return {
    ...backupFile,
    items: restored.map(({ restoredItem }) => restoredItem),
    photos: photoFiles.map(({ itemId, role, photoFile }) => ({ itemId, role, bytes: photoFile.buffer })),
    thumbnails: photoFiles.map(({ itemId, role, thumbnailFile }) => ({ itemId, role, bytes: thumbnailFile.buffer })),
  }
}

export const restoreBackup = (backup: ParsedBackup) =>
  db.transaction('rw', allTables(), async () => {
    await Promise.all(allTables().map((table) => table.clear()))
    await db.items.bulkAdd(backup.items)
    await db.kinds.bulkAdd(backup.kinds)
    await db.counters.bulkAdd(backup.counters)
    await db.photos.bulkAdd(backup.photos)
    await db.thumbnails.bulkAdd(backup.thumbnails)
  })
