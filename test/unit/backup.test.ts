import { strToU8, unzipSync, zipSync } from 'fflate'
import { beforeEach, describe, expect, it } from 'vitest'
import { exportBackup, parseBackup, restoreBackup } from '../../src/data/backup'
import { db } from '../../src/data/db'
import { addItem, addKind, allItems, allKinds, itemPhoto, itemThumbnail } from '../../src/data/repo'
import { PHOTO_ROLES } from '../../src/domain/types'
import { resetDb } from '../helpers/db'
import { shrunkPhoto } from '../helpers/photo'
import { item, kind } from '../helpers/records'

const NOW = new Date(2026, 10, 12, 10, 0).getTime()

const photoBytes = () => new Uint8Array([255, 216, 255, 1, 2, 3]).buffer

const thumbnailBytes = () => new Uint8Array([255, 216, 255, 4]).buffer

const receiptBytes = () => new Uint8Array([255, 216, 255, 9]).buffer

const archiveOf = (backupContents: object, photos: Record<string, Uint8Array<ArrayBuffer>> = {}) =>
  zipSync({ 'data.json': strToU8(JSON.stringify(backupContents)), ...photos })

const exportedArchive = async () => new Uint8Array(await new Blob(await exportBackup(NOW)).arrayBuffer())

const shoes = item({ id: 'shoes', name: 'נעלי ריצה', price: 449, shop: 'מגה ספורט', hasPhoto: true, hasReceipt: true })

const books = kind({ id: 'books', name: 'ספרים', colour: 'peach', position: 6 })

const backupData = (version = 1) => ({
  version,
  exportedAt: NOW,
  items: [shoes],
  kinds: [books],
  counters: [{ year: 2026, last: 41 }],
})

async function seedOldData() {
  await addKind('ישן', NOW)
  await addItem(
    { name: 'ישן', boughtOn: '2026-10-01', returnBy: '2026-10-15' },
    { item: shrunkPhoto(photoBytes(), thumbnailBytes()), receipt: shrunkPhoto(receiptBytes(), receiptBytes()) },
    NOW,
  )
}

async function snapshot() {
  const items = await allItems()

  const photos = await Promise.all(
    items.flatMap((saved) =>
      PHOTO_ROLES.map(async (role) => [await itemPhoto(saved.id, role), await itemThumbnail(saved.id, role)]),
    ),
  )

  return { items, kinds: await allKinds(), counters: await db.counters.toArray(), photos }
}

describe('backup', () => {
  beforeEach(resetDb)

  it('survives a round trip through a zip, both photo roles, kinds and counters included', async () => {
    await seedOldData()
    await addItem({ name: 'חולצה', boughtOn: '2026-11-02', shop: 'Castro', note: 'מידה M' }, {}, NOW)

    const before = await snapshot()
    const archive = await exportedArchive()

    await resetDb()
    await restoreBackup(parseBackup(archive))

    expect(await snapshot()).toEqual(before)
  })

  it('writes data.json and each photo and thumbnail as <id>-<role>.jpg', async () => {
    await seedOldData()

    const [saved] = await allItems()
    const files = unzipSync(await exportedArchive())

    expect(Object.keys(files).sort()).toEqual([
      'data.json',
      `photos/${saved.id}-item.jpg`,
      `photos/${saved.id}-receipt.jpg`,
      `thumbnails/${saved.id}-item.jpg`,
      `thumbnails/${saved.id}-receipt.jpg`,
    ])
    expect(JSON.parse(new TextDecoder().decode(files['data.json']))).toMatchObject({ version: 1, exportedAt: NOW })
    expect(files[`photos/${saved.id}-item.jpg`]).toEqual(new Uint8Array(photoBytes()))
  })

  it('replaces all existing data on restore', async () => {
    await seedOldData()

    await restoreBackup(
      parseBackup(
        archiveOf(backupData(), {
          'photos/shoes-item.jpg': new Uint8Array(photoBytes()),
          'thumbnails/shoes-item.jpg': new Uint8Array(thumbnailBytes()),
          'photos/shoes-receipt.jpg': new Uint8Array(receiptBytes()),
        }),
      ),
    )

    expect(await allItems()).toEqual([shoes])
    expect(await allKinds()).toEqual([books])
    expect(await db.counters.toArray()).toEqual([{ year: 2026, last: 41 }])
    expect(await itemPhoto('shoes', 'item')).toEqual(photoBytes())
    expect(await itemThumbnail('shoes', 'item')).toEqual(thumbnailBytes())
    expect(await itemThumbnail('shoes', 'receipt')).toEqual(receiptBytes())
  })

  it('marks only the photo roles whose files are in the backup, and ignores photos of unknown items', async () => {
    await restoreBackup(
      parseBackup(
        archiveOf(backupData(), {
          'photos/shoes-receipt.jpg': new Uint8Array(receiptBytes()),
          'photos/stranger-item.jpg': new Uint8Array(photoBytes()),
        }),
      ),
    )

    const [restored] = await allItems()

    expect(restored.hasPhoto).toBeUndefined()
    expect(restored.hasReceipt).toBe(true)
    expect(await itemPhoto('shoes', 'item')).toBeUndefined()
    expect(await itemPhoto('stranger', 'item')).toBeUndefined()
  })

  it.each([
    ['not a zip', () => strToU8('{"version":1}')],
    ['a zip without data.json', () => zipSync({ 'notes.txt': strToU8('hi') })],
    ['invalid JSON', () => zipSync({ 'data.json': strToU8('{oops') })],
    ['another shape', () => archiveOf({ version: 1 })],
    ['a newer version', () => archiveOf(backupData(2))],
    ['an item without a name', () => archiveOf({ ...backupData(), items: [{ ...shoes, name: ' ' }] })],
  ])('rejects %s and leaves the data untouched', async (_name, archive) => {
    await seedOldData()

    const before = await snapshot()

    expect(() => parseBackup(archive())).toThrow()
    expect(await snapshot()).toEqual(before)
  })
})
