import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import {
  addItem,
  addKind,
  allItems,
  allKinds,
  deleteItem,
  deleteKind,
  editItem,
  itemPhoto,
  itemThumbnail,
  renameKind,
  setItemPhoto,
  updateItem,
} from '../../src/data/repo'
import { OTHER_KIND_ID } from '../../src/domain/kinds'
import { resetDb } from '../helpers/db'
import { shrunkPhoto } from '../helpers/photo'

const NOW = new Date(2026, 10, 12, 10, 0).getTime()

const bytes = (...values: number[]) => new Uint8Array(values).buffer

const photo = shrunkPhoto(bytes(1, 2), bytes(1))

const receipt = shrunkPhoto(bytes(3, 4), bytes(3))

const addNamed = (name: string, boughtOn = '2026-11-12') => addItem({ name, boughtOn }, {}, NOW)

async function storedItem(id: string) {
  const stored = await db.items.get(id)

  if (!stored) {
    throw new Error(`no item ${id}`)
  }

  return stored
}

describe('repo', () => {
  beforeEach(resetDb)
  afterEach(() => vi.restoreAllMocks())

  it('numbers items in entry order within their purchase year', async () => {
    const first = await addNamed('First')
    const second = await addNamed('Second', '2026-01-03')
    const lastYear = await addNamed('Last year', '2025-12-30')

    expect(await storedItem(first)).toMatchObject({ year: 2026, sequence: 1 })
    expect(await storedItem(second)).toMatchObject({ year: 2026, sequence: 2 })
    expect(await storedItem(lastYear)).toMatchObject({ year: 2025, sequence: 1 })
  })

  it('never reuses a number after a delete', async () => {
    await addNamed('First')
    const second = await addNamed('Second')

    await deleteItem(second)

    expect(await storedItem(await addNamed('Third'))).toMatchObject({ sequence: 3 })
  })

  it('keeps an item’s number when its date moves to another year', async () => {
    const id = await addNamed('Moved')

    await updateItem({ ...(await storedItem(id)), boughtOn: '2025-06-01' }, NOW)

    expect(await storedItem(id)).toMatchObject({ year: 2026, sequence: 1, boughtOn: '2025-06-01' })
  })

  it('refuses a purchase dated after today', async () => {
    await expect(addNamed('Tomorrow', '2026-11-13')).rejects.toThrow()
  })

  it('stores the item photo and the receipt photo separately', async () => {
    const id = await addItem({ name: 'Shoes', boughtOn: '2026-11-12' }, { item: photo, receipt }, NOW)

    expect(await storedItem(id)).toMatchObject({ hasPhoto: true, hasReceipt: true })
    expect(await itemPhoto(id, 'item')).toEqual(photo.photo)
    expect(await itemThumbnail(id, 'receipt')).toEqual(receipt.thumbnail)
  })

  it('replaces and removes one photo role without touching the other', async () => {
    const id = await addItem({ name: 'Shoes', boughtOn: '2026-11-12' }, { item: photo, receipt }, NOW)

    await setItemPhoto(id, 'receipt', undefined)

    expect(await storedItem(id)).toMatchObject({ hasPhoto: true })
    expect((await storedItem(id)).hasReceipt).toBeUndefined()
    expect(await itemPhoto(id, 'receipt')).toBeUndefined()
    expect(await itemPhoto(id, 'item')).toEqual(photo.photo)
  })

  it('deletes an item with both its photos', async () => {
    const id = await addItem({ name: 'Shoes', boughtOn: '2026-11-12' }, { item: photo, receipt }, NOW)

    await deleteItem(id)

    expect(await allItems()).toEqual([])
    expect(await db.photos.count()).toBe(0)
    expect(await db.thumbnails.count()).toBe(0)
  })

  it('starts with the six default kinds', async () => {
    expect((await allKinds()).map(({ name }) => name)).toEqual(['בגדים', 'נעליים', 'אלקטרוניקה', 'בית', 'ספורט', 'אחר'])
  })

  it('adds a kind at the end with the next free colour, and renames it', async () => {
    const id = await addKind('ספרים', NOW)

    await renameKind(id, ' ספרים וקומיקס ')

    expect((await allKinds()).find((kind) => kind.id === id)).toMatchObject({
      name: 'ספרים וקומיקס',
      colour: 'peach',
      position: 6,
    })
  })

  it('puts the first kind first when there are no kinds at all', async () => {
    await db.kinds.clear()

    const id = await addKind('ספרים', NOW)

    expect((await allKinds()).find((kind) => kind.id === id)).toMatchObject({ position: 0, colour: 'sky' })
  })

  it('leaves an edited item untouched when its photo cannot be stored', async () => {
    const id = await addItem({ name: 'Shoes', boughtOn: '2026-11-12' }, { item: photo }, NOW)
    const stored = await storedItem(id)

    vi.spyOn(db.photos, 'put').mockRejectedValueOnce(new Error('storage full'))

    await expect(editItem({ ...stored, name: 'Running shoes' }, [{ role: 'receipt', photo: receipt }], NOW)).rejects.toThrow()

    expect(await storedItem(id)).toEqual(stored)
    expect(await itemPhoto(id, 'receipt')).toBeUndefined()
  })

  it('moves a deleted kind’s items to אחר', async () => {
    const id = await addItem({ name: 'Shirt', boughtOn: '2026-11-12', kindId: 'clothes' }, {}, NOW)

    await deleteKind('clothes')

    expect(await storedItem(id)).toMatchObject({ kindId: OTHER_KIND_ID })
    expect((await allKinds()).map(({ id: kindId }) => kindId)).not.toContain('clothes')
  })

  it('refuses to delete אחר', async () => {
    await expect(deleteKind(OTHER_KIND_ID)).rejects.toThrow()
  })
})
