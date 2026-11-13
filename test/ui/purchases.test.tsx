import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addItem, type ItemDraft } from '../../src/data/repo'
import type { ItemSheetProps } from '../../src/pages/itemSheet/ItemSheet'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { cameraPhoto } from '../helpers/photo'
import { renderAt } from '../helpers/renderAt'

const SHEET_MARKER = 'item sheet'

const NO_PHOTO_MARKER = 'no photo'

vi.mock('../../src/pages/itemSheet/ItemSheet', () => ({
  ItemSheet: ({ isOpen, firstPhoto }: ItemSheetProps) =>
    isOpen ? (
      <output role="status" aria-label={SHEET_MARKER}>
        {firstPhoto ? firstPhoto.name : NO_PHOTO_MARKER}
      </output>
    ) : null,
}))

const NOW = new Date(2026, 10, 13, 12, 0).getTime()

const PURCHASES_URL = '/tabs/purchases'

const seedItem = (name: string, fields: Partial<ItemDraft> = {}) =>
  addItem({ name, boughtOn: '2026-11-09', ...fields }, {}, NOW)

const gridTiles = () => within(screen.getByRole('list', { name: 'כל הרכישות' })).queryAllByRole('link')

const expectGridOf = (names: string[]) =>
  expect(gridTiles().map((tile) => tile.textContent)).toEqual(names.map((name) => expect.stringContaining(name)))

describe('purchases', () => {
  freezeDate(NOW)
  beforeEach(resetDb)

  it('sums this month under the title, leaving out last month and returned items', async () => {
    await seedItem('Running shoes', { price: 449 })
    await seedItem('Linen shirt', { price: 159, boughtOn: '2026-11-02' })
    await seedItem('Returned kettle', { price: 189, returned: true })
    await seedItem('Rain coat', { price: 299, boughtOn: '2026-10-28' })
    renderAt(PURCHASES_URL)

    expect(await screen.findByText('נובמבר · 2 פריטים · ₪608')).toBeInTheDocument()
  })

  it('leads with the newest purchase and lists the others newest first, each opening its item', async () => {
    await seedItem('Linen shirt', { price: 159, shop: 'Castro', boughtOn: '2026-11-02' })
    const newest = await seedItem('Running shoes', { price: 449, shop: 'Mega Sport', place: 'Azrieli' })
    const middle = await seedItem('Headphones', { price: 1190, shop: 'KSP', boughtOn: '2026-11-05' })

    renderAt(PURCHASES_URL)

    const lead = await screen.findByRole('link', { name: /Running shoes/ })

    expect(lead).toHaveAttribute('href', `/tabs/purchases/${newest}`)
    expect(within(lead).getByText('Mega Sport · Azrieli · 9.11.26')).toBeInTheDocument()

    expectGridOf(['Headphones', 'Linen shirt'])

    const [first] = gridTiles()

    expect(first).toHaveAttribute('href', `/tabs/purchases/${middle}`)
    expect(within(first).getByText('₪1,190')).toBeInTheDocument()
    expect(within(first).getByText('KSP · 5.11.26')).toBeInTheDocument()
  })

  it('leads with the return window closing soonest and links to the rest of them', async () => {
    await seedItem('Newest socks', { boughtOn: '2026-11-13' })
    await seedItem('Rain coat', { returnBy: '2026-11-16' })
    await seedItem('Kettle', { returnBy: '2026-11-14' })
    await seedItem('Lamp', { returnBy: '2026-11-15' })
    await seedItem('Kept jacket', { returnBy: '2026-11-14', keeping: true })
    renderAt(PURCHASES_URL)

    const lead = await screen.findByRole('link', { name: /Kettle/ })

    expect(within(lead).getByText('להחזרה עד מחר')).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'כל הרכישות' })).queryByText('Kettle')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'ועוד 2' })).toHaveAttribute('href', '/tabs/purchases/attention')
  })

  it('shows no more link when a single window is closing', async () => {
    await seedItem('Kettle', { returnBy: '2026-11-14' })
    await seedItem('Newest socks', { boughtOn: '2026-11-13' })
    renderAt(PURCHASES_URL)

    await screen.findByRole('link', { name: /Kettle/ })

    expect(screen.queryByRole('link', { name: /ועוד/ })).not.toBeInTheDocument()
  })

  it('marks a returned item in the grid in words', async () => {
    await seedItem('Returned kettle', { returned: true, boughtOn: '2026-11-01' })
    await seedItem('Running shoes')
    renderAt(PURCHASES_URL)

    const tile = await screen.findByRole('link', { name: /Returned kettle/ })

    expect(within(tile).getByText('הוחזר')).toBeInTheDocument()
  })

  it('shows only the items matching a search, the lead included', async () => {
    await seedItem('Linen shirt', { shop: 'Castro', boughtOn: '2026-11-02' })
    await seedItem('Socks', { shop: 'Castro', boughtOn: '2026-11-03' })
    await seedItem('Running shoes', { shop: 'Mega Sport' })
    renderAt(PURCHASES_URL)

    fireEvent.change(await screen.findByRole('searchbox', { name: 'חיפוש פריט או חנות' }), {
      target: { value: 'castro' },
    })

    await waitFor(() => expect(screen.queryByText('Running shoes')).not.toBeInTheDocument())
    expectGridOf(['Socks', 'Linen shirt'])
  })

  it('filters the grid by kind, counting items without a kind as אחר, and clears on a second tap', async () => {
    await seedItem('Linen shirt', { kindId: 'clothes', boughtOn: '2026-11-02' })
    await seedItem('Headphones', { kindId: 'electronics', boughtOn: '2026-11-03' })
    await seedItem('Umbrella', { boughtOn: '2026-11-04' })
    await seedItem('Running shoes', { kindId: 'shoes' })
    renderAt(PURCHASES_URL)

    const clothes = await screen.findByRole('button', { name: 'בגדים' })

    fireEvent.click(clothes)

    expect(clothes).toHaveAttribute('aria-pressed', 'true')
    expectGridOf(['Linen shirt'])

    fireEvent.click(screen.getByRole('button', { name: 'אחר' }))

    expect(clothes).toHaveAttribute('aria-pressed', 'false')
    expectGridOf(['Umbrella'])

    fireEvent.click(screen.getByRole('button', { name: 'אחר' }))

    expectGridOf(['Umbrella', 'Headphones', 'Linen shirt'])
    expect(screen.getByRole('link', { name: /Running shoes/ })).toBeInTheDocument()
  })

  it('opens the item sheet with the photo just taken', async () => {
    renderAt(PURCHASES_URL)

    expect(screen.queryByRole('status', { name: SHEET_MARKER })).not.toBeInTheDocument()

    fireEvent.change(await screen.findByLabelText('צילום רכישה חדשה'), { target: { files: [cameraPhoto()] } })

    expect(await screen.findByRole('status', { name: SHEET_MARKER })).toHaveTextContent('IMG_0001.jpg')
  })

  it('opens the item sheet without a photo', async () => {
    renderAt(PURCHASES_URL)

    fireEvent.click(await screen.findByRole('button', { name: 'בלי תמונה' }))

    expect(await screen.findByRole('status', { name: SHEET_MARKER })).toHaveTextContent(NO_PHOTO_MARKER)
  })

  it('says calmly that nothing is recorded yet, with the camera still there', async () => {
    renderAt(PURCHASES_URL)

    expect(await screen.findByText('עוד אין כאן רכישות. הראשונה מתחילה בצילום למטה.')).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'כל הרכישות' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('צילום רכישה חדשה')).toBeInTheDocument()
  })
})
