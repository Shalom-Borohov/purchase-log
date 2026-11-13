import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { allItems } from '../../src/data/repo'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { chooseFromActionSheet, openSheet, SHEET_NOW, typeInto } from '../helpers/itemSheet'
import { modalDismissed } from '../helpers/overlays'
import { cameraPhoto, stubObjectUrls } from '../helpers/photo'

vi.mock('../../src/photo/shrink', () => ({
  shrinkPhoto: async () => ({ photo: new Uint8Array([1]).buffer, thumbnail: new Uint8Array([2]).buffer }),
}))

const isSheetOpen = () => document.querySelector('ion-modal')?.classList.contains('overlay-hidden') === false

describe('dismissing the item sheet', () => {
  beforeEach(resetDb)
  freezeDate(SHEET_NOW)
  stubObjectUrls()

  it('closes a sheet nothing was changed in at once on ביטול', async () => {
    await openSheet()

    const dismissed = modalDismissed()

    fireEvent.click(screen.getByText('ביטול'))
    await dismissed

    expect(document.querySelector('ion-action-sheet')).not.toBeInTheDocument()
  })

  it('asks before dropping a changed sheet, and המשך עריכה keeps the draft', async () => {
    await openSheet()
    await typeInto('שם', 'מטריה')

    await chooseFromActionSheet(() => fireEvent.click(screen.getByText('ביטול')), 'המשך עריכה')

    await waitFor(() => expect(document.querySelector('ion-action-sheet')).not.toBeInTheDocument())
    expect(isSheetOpen()).toBe(true)
    expect(screen.getByLabelText('שם')).toHaveValue('מטריה')
  })

  it('closes without saving once מחיקת הטיוטה is chosen', async () => {
    await openSheet()
    await typeInto('שם', 'מטריה')

    const dismissed = modalDismissed()

    await chooseFromActionSheet(() => fireEvent.click(screen.getByText('ביטול')), 'מחיקת הטיוטה')
    await dismissed

    expect(await allItems()).toEqual([])
  })

  it('asks before dropping a sheet opened with a photo just taken', async () => {
    await openSheet({ firstPhoto: cameraPhoto() })

    await chooseFromActionSheet(() => fireEvent.click(screen.getByText('ביטול')), 'המשך עריכה')

    await waitFor(() => expect(document.querySelector('ion-action-sheet')).not.toBeInTheDocument())
    expect(isSheetOpen()).toBe(true)
  })

  it('asks the same when a changed sheet is swiped down', async () => {
    await openSheet()
    fireEvent.click(screen.getByRole('button', { name: 'נעליים' }))

    const modal = document.querySelector('ion-modal')

    await chooseFromActionSheet(() => void modal?.dismiss(undefined, 'gesture'), 'המשך עריכה')

    await waitFor(() => expect(document.querySelector('ion-action-sheet')).not.toBeInTheDocument())
    expect(isSheetOpen()).toBe(true)
  })
})
