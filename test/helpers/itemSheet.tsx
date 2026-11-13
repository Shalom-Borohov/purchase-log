import { IonApp } from '@ionic/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, vi } from 'vitest'
import { RecordsProvider } from '../../src/data/RecordsProvider'
import { addItem, allItems } from '../../src/data/repo'
import { type HarnessProps, ItemSheetHarness, OPEN_SHEET } from './ItemSheetHarness'
import { actionSheetShown, clickActionSheetButton, modalDismissed } from './overlays'
import { cameraPhoto } from './photo'

export const SHEET_NOW = new Date(2026, 10, 12, 18, 30).getTime()

export const SHEET_TODAY = '2026-11-12'

export const YESTERDAY_EVENING = new Date(2026, 10, 11, 20, 0).getTime()

export async function openSheet(props: HarnessProps = {}) {
  render(
    <IonApp>
      <RecordsProvider>
        <ItemSheetHarness {...props} />
      </RecordsProvider>
    </IonApp>,
  )
  fireEvent.click(screen.getByText(OPEN_SHEET))
  await screen.findByLabelText('שם')
}

export const pickPhoto = async (label: string) =>
  fireEvent.change(await screen.findByLabelText(label), { target: { files: [cameraPhoto()] } })

export const typeInto = async (label: string, text: string) =>
  fireEvent.change(await screen.findByLabelText(label), { target: { value: text } })

export async function addEarlierPurchases() {
  await addItem(
    { name: 'ג׳ינס', boughtOn: '2026-11-01', shop: 'Castro', place: 'קניון עזריאלי', returnBy: '2026-11-15' },
    {},
    YESTERDAY_EVENING,
  )
  await addItem({ name: 'עכבר', boughtOn: '2026-11-05', shop: 'KSP', place: 'דיזנגוף סנטר' }, {}, YESTERDAY_EVENING)
}

export function suggestionsOf(label: string) {
  const listId = screen.getByLabelText(label).getAttribute('list')
  const list = listId ? document.getElementById(listId) : null

  return Array.from(list?.querySelectorAll('option') ?? []).map((option) => option.value)
}

export async function savedNamed(name: string) {
  const items = await allItems()

  return items.find((saved) => saved.name === name)
}

const isSaveDisabled = () => screen.getByText('שמירה').closest('ion-button')?.disabled

export const expectSaveDisabled = (isDisabled: boolean) => waitFor(() => expect(isSaveDisabled()).toBe(isDisabled))

export async function chooseFromActionSheet(open: () => void, text: string) {
  const shown = actionSheetShown()

  open()
  await shown
  clickActionSheetButton(text)
}

export async function inputOpenedFrom(photoOptions: string, choice: string) {
  const inputClicks = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})

  await chooseFromActionSheet(() => fireEvent.click(screen.getByRole('button', { name: photoOptions })), choice)
  await waitFor(() => expect(inputClicks).toHaveBeenCalledOnce())

  const openedInput = inputClicks.mock.contexts.find((context) => context instanceof HTMLInputElement)

  inputClicks.mockRestore()

  if (!openedInput) {
    throw new Error(`${choice} opened no photo input`)
  }

  return openedInput
}

export async function save() {
  await expectSaveDisabled(false)

  const dismissed = modalDismissed()

  fireEvent.click(screen.getByText('שמירה'))
  await dismissed
  await waitFor(() => expect(screen.queryByText('שמירה')).not.toBeInTheDocument())
}
