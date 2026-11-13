import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addItem, allItems, itemPhoto } from '../../src/data/repo'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import {
  chooseFromActionSheet,
  expectSaveDisabled,
  inputOpenedFrom,
  openSheet,
  pickPhoto,
  save,
  SHEET_NOW,
  typeInto,
  YESTERDAY_EVENING,
} from '../helpers/itemSheet'
import { cameraPhoto, PHOTO_URL, shrunkPhoto, stubObjectUrls } from '../helpers/photo'

const { SHRUNK_BYTES, THUMBNAIL_BYTES, heldShrinks } = vi.hoisted(() => ({
  SHRUNK_BYTES: [1, 2, 3],
  THUMBNAIL_BYTES: [4],
  heldShrinks: { isHolding: false, release: new Array<() => void>() },
}))

vi.mock('../../src/photo/shrink', () => ({
  shrinkPhoto: async () => {
    if (heldShrinks.isHolding) {
      await new Promise<void>((resolve) => heldShrinks.release.push(resolve))
    }

    return { photo: new Uint8Array(SHRUNK_BYTES).buffer, thumbnail: new Uint8Array(THUMBNAIL_BYTES).buffer }
  },
}))

const finishShrink = (index: number) =>
  act(async () => {
    heldShrinks.release[index]()
  })

const shrunkBytes = () => new Uint8Array(SHRUNK_BYTES).buffer

describe('item sheet photos', () => {
  beforeEach(async () => {
    heldShrinks.isHolding = false
    heldShrinks.release = []
    await resetDb()
  })
  freezeDate(SHEET_NOW)
  stubObjectUrls()

  it('keeps שמירה off until every picked photo has finished shrinking, then stores both', async () => {
    heldShrinks.isHolding = true
    await openSheet()
    await typeInto('שם', 'מעיל')
    await pickPhoto('תמונת הפריט מהגלריה')
    await pickPhoto('צילום קבלה')
    await expectSaveDisabled(true)

    await finishShrink(0)
    await expectSaveDisabled(true)

    await finishShrink(1)
    await save()

    const [saved] = await allItems()

    expect(saved).toMatchObject({ hasPhoto: true, hasReceipt: true })
  })

  it('shows the camera photo shrunk in the item slot and stores it with the new item', async () => {
    await openSheet({ firstPhoto: cameraPhoto() })
    await typeInto('שם', 'נעלי ריצה')

    expect(await screen.findByRole('img', { name: 'נעלי ריצה' })).toHaveAttribute('src', PHOTO_URL)
    expect(screen.getByLabelText('צילום קבלה')).toHaveAttribute('capture', 'environment')

    await save()

    const [saved] = await allItems()

    expect(saved.hasPhoto).toBe(true)
    expect(saved.hasReceipt).toBeUndefined()
    expect(await itemPhoto(saved.id, 'item')).toEqual(shrunkBytes())
    expect(await itemPhoto(saved.id, 'receipt')).toBeUndefined()
  })

  it('gives a filled slot one options button instead of gallery and remove buttons, and retakes with the camera', async () => {
    await openSheet({ firstPhoto: cameraPhoto() })
    await screen.findByRole('img', { name: 'תמונת הפריט' })

    expect(screen.queryByLabelText('תמונת הפריט מהגלריה')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'הסרת תמונת הפריט' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('קבלה מהגלריה')).toBeInTheDocument()

    const cameraInput = await inputOpenedFrom('אפשרויות לתמונת הפריט', 'צילום מחדש')

    expect(cameraInput).toHaveAttribute('capture', 'environment')
  })

  it('stores a receipt photo apart from the item photo', async () => {
    await openSheet()

    expect(screen.getByLabelText('קבלה מהגלריה')).not.toHaveAttribute('capture')
    await pickPhoto('צילום קבלה')
    expect(await screen.findByRole('img', { name: 'קבלה' })).toHaveAttribute('src', PHOTO_URL)
    expect(screen.queryByRole('img', { name: 'תמונת הפריט' })).not.toBeInTheDocument()

    await typeInto('שם', 'מקלחון')
    await save()

    const [saved] = await allItems()

    expect(saved.hasReceipt).toBe(true)
    expect(saved.hasPhoto).toBeUndefined()
    expect(await itemPhoto(saved.id, 'receipt')).toEqual(shrunkBytes())
    expect(await itemPhoto(saved.id, 'item')).toBeUndefined()
  })

  it('edits an item, replacing its photo and removing its receipt', async () => {
    const keptPhoto = shrunkPhoto(new Uint8Array([7]).buffer, new Uint8Array([6]).buffer)

    const itemId = await addItem(
      {
        name: 'נעלי ריצה',
        boughtOn: '2026-11-05',
        price: 349.9,
        shop: 'מגה ספורט',
        place: 'רמת אביב',
        kindId: 'shoes',
        returnBy: '2026-11-19',
        note: 'מידה 43',
      },
      { item: keptPhoto, receipt: keptPhoto },
      YESTERDAY_EVENING,
    )

    const [stored] = await allItems()

    await openSheet({ item: stored })

    expect(screen.getByText('עריכת פריט')).toBeInTheDocument()
    expect(screen.getByLabelText('שם')).toHaveValue('נעלי ריצה')
    expect(screen.getByLabelText('מחיר')).toHaveValue('349.9')
    expect(screen.getByRole('button', { name: 'מגה ספורט' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText('מקום')).toHaveValue('רמת אביב')
    expect(screen.getByRole('button', { name: 'נעליים' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('5.11.26')).toBeInTheDocument()
    expect(await screen.findByRole('img', { name: 'קבלה' })).toHaveAttribute('src', PHOTO_URL)

    const libraryInput = await inputOpenedFrom('אפשרויות לתמונת הפריט', 'בחירה מהתמונות')

    expect(libraryInput).not.toHaveAttribute('capture')
    fireEvent.change(libraryInput, { target: { files: [cameraPhoto()] } })
    await chooseFromActionSheet(
      () => fireEvent.click(screen.getByRole('button', { name: 'אפשרויות לקבלה' })),
      'הסרת התמונה',
    )
    await waitFor(() => expect(screen.queryByRole('img', { name: 'קבלה' })).not.toBeInTheDocument())
    await typeInto('שם', 'נעלי ריצה כתומות')
    await save()

    const [edited] = await allItems()

    expect(edited).toMatchObject({
      id: itemId,
      sequence: stored.sequence,
      name: 'נעלי ריצה כתומות',
      price: 349.9,
      shop: 'מגה ספורט',
      returnBy: '2026-11-19',
      note: 'מידה 43',
      hasPhoto: true,
    })
    expect(edited.hasReceipt).toBeUndefined()
    expect(await itemPhoto(itemId, 'item')).toEqual(shrunkBytes())
    expect(await itemPhoto(itemId, 'receipt')).toBeUndefined()
  })
})
